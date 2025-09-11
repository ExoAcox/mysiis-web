import { getSummaryPolygonByUser, GetSurveyCountByUser } from '@api/survey-demand/respondent';
import { Modal } from '@components/layout'
import { Table } from '@components/table';
import { ModalTitle } from '@components/text'
import { isDecimal } from '@features/planning/dashboard-microdemand/functions/report';
import useFetch from '@hooks/useFetch';
import useModal from '@hooks/useModal';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'

export default function ModalDetailActivity() {
  const { modal, setModal, data } = useModal<{ userId: string, name: string }>("modal-detail-activity-surveyor");
  const getSummaryByUser = useFetch<GetSurveyCountByUser[]>([]);

  useEffect(() => {
    if (modal && data.userId) {
      getSummaryByUser.fetch(getSummaryPolygonByUser({ userid: data.userId}))
    }
  }, [modal, data])

  return (
    <Modal
      visible={modal}
    >
      <ModalTitle onClose={() => setModal(false)}>Detail Activity {data.name}</ModalTitle>
      <Table
          bodyClassName="text-center"
          loading={getSummaryByUser.status === "pending"}
          className="mt-2"
          rows={getSummaryByUser.data}
          columns={[
              { header: "Polygon", value: (data) => data.cluster ?? "-", className: "text-left whitespace-nowrap" },
              { header: "Terakhir Survey", value: (data) => dayjs(data.last_survey_created).format('YYYY-MM-DD'), className: "text-left whitespace-nowrap" },
              { header: "Unvalidated", value: (data) => data.unvalidated, className: "text-right whitespace-nowrap" },
              { header: "Valid-mitra", value: (data) => data['valid-mitra'], className: "text-right whitespace-nowrap" },
              { header: "Valid", value: (data) => data.valid, className: "text-right whitespace-nowrap" },
              { header: "Invalid", value: (data) => data.invalid, className: "text-right whitespace-nowrap" },
              { header: "Total", value: (data) => data.total_survey, className: "text-right whitespace-nowrap" },
          ]}
          notFoundComponent={
              <div className="py-8 text-center">
                  DATA TIDAK DITEMUKAN
              </div>
          }
      />
    </Modal>
  )
}
