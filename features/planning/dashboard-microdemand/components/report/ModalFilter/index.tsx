import { Button } from '@components/button';
import { Dropdown } from '@components/dropdown';
import { Modal } from '@components/layout'
import { ModalTitle } from '@components/text'
import { useSurveyCategorylStore, useWitelStore } from '@features/planning/dashboard-microdemand/store/report';
import UseModal from '@hooks/useModal';
import { useState } from 'react'
import { FiltersProps } from '../Filters';
import DateRange from '../Filters/DateRange';

export default function ModalFilter({ params, setParams, user }: FiltersProps) {

  const { modal, setModal } = UseModal("modal-filter-report");

  const [witels] = useWitelStore(set => [set.data])
  const [survey_categories] = useSurveyCategorylStore(set => [set.data])
  const [dateParams, setDate] = useState({
    survey_at_start: params.survey_at_start,
    survey_at_end: params.survey_at_end,
  })
  const [witel, setWitel] = useState(params.witel)
  const [surveyCategory, setSurveyCategory] = useState(params.surveyCategory)

  const handleFilter = () => {
    setParams({
      ...params,
      survey_at_start: dateParams.survey_at_start,
      survey_at_end: dateParams.survey_at_end,
      witel: witel,
      surveyCategory: surveyCategory
    })
    setModal(false)
  }

  return (
    <Modal
      visible={modal}
      className="w-[55rem]"
    >
      <ModalTitle onClose={() => setModal(false)}>Filter</ModalTitle>
      <div className='mt-[24px] p-0 gap-6 flex flex-col justify-end'>
        <div className='w-full'>
          <p className='mb-2'>Periode</p>
          <DateRange mobile params={params} setParams={setDate} />
        </div>
        <div className='w-full'>
          <p className='mb-2'>Witel</p>
          <Dropdown
            id="filter-dashboard-microdemand-report"
            placeholder="Pilih Witel"
            value={witel[0] || ''}
            options={user?.witel ? [{ label: params.witel[0], value: params.witel[0] }] : witels}
            onChange={(value) => {
              setWitel([value]);
            }}
            className="w-full"
          />
        </div>
        <div className='min-w-full'>
          <p className='mb-2'>Kategori Survey</p>
          <Dropdown
            id="filter-dashboard-microdemand-report"
            placeholder="Pilih Survey"
            value={surveyCategory}
            options={survey_categories}
            onChange={(value) => {
              setSurveyCategory(value);
            }}
            className="w-full overflow-hidden"
          />
        </div>
      </div>
      <Button onClick={() => handleFilter()} className='ml-auto mt-5'>Terapkan</Button>
    </Modal>
  )
}
