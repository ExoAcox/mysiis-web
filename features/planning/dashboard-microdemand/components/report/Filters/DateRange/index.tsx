import React, { useState, useEffect } from 'react'
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Calendar from "@images/vector/calendar.svg";
import dayjs from 'dayjs';
import { ParamsStateMainContentReport } from '../../MainContent';
import { DateRangePicker } from '@components/calendar';

interface DateRangeProps {
  params: ParamsStateMainContentReport;
  setParams: (e: ParamsStateMainContentReport) => void;
  mobile?: boolean
}

export default function DateRange({ params, setParams }: DateRangeProps) {

  const [dateTemp, setDateTemp] = useState<{ startDate?: Date; endDate?: Date }>({
    startDate: dayjs(params.survey_at_start).toDate(),
    endDate: dayjs(params.survey_at_end).toDate()
  });

  useEffect(() => {
    setParams({
      ...params,
      survey_at_start: dayjs(dateTemp.startDate).format("YYYY-MM-DD"),
      survey_at_end: dayjs(dateTemp.endDate).format("YYYY-MM-DD"),
    });
  }, [dateTemp])

  return (
    <div className='p-0 relative w-full'>
      <DateRangePicker
        id={'data-picker-report-microdemand'}
        value={{
          start: dayjs(dateTemp.startDate).format("YYYY-MM-DD"),
          end: dayjs(dateTemp.endDate).format("YYYY-MM-DD")
        }}
        onChange={function (start: string, end: string): void {
          setDateTemp({ startDate: dayjs(start).toDate(), endDate: dayjs(end).toDate() })
        }}
        icon={<Calendar />}
        parentClassName='p-0 m-0'
      />
    </div>
  )
}
