import { Dropdown } from '@components/dropdown'
import { listRegional, validationUserRole } from '@features/planning/dashboard-microdemand/functions/report'
import { getDataFilter, handleWitel } from '@features/planning/dashboard-microdemand/queries/report'
import { useWitelStore } from '@features/planning/dashboard-microdemand/store/report'
import { useEffect, useState } from 'react'
import { When } from 'react-if'
import { ParamsStateMainContentReport } from '../MainContent'
import DateRange from './DateRange'
import { optionsStatus } from '@features/planning/dashboard-microdemand/functions/common'

export interface FiltersProps {
  source?: string;
  params: ParamsStateMainContentReport;
  setParams: (e: ParamsStateMainContentReport) => void;
  user: User
}

export default function Filters({ source, params, setParams, user }: FiltersProps) {

  const [witels] = useWitelStore(set => [set.data])
  const [resgional, setRegional] = useState('')

  useEffect(() => {
    getDataFilter({ params, setParams, user })
  }, [])

  return (
    <div className='mt-[24px] p-0 gap-6 flex justify-end'>
      {/* <div className='w-[364px]'>
        <p className='mb-2'>Cari</p>
        <SearchField />
      </div> */}
      <div className='w-[230px]'>
        <p className='mb-2'>Periode</p>
        <DateRange params={params} setParams={setParams} />
      </div>
      <When condition={source === 'polygon'}>
        <div className='w-[183px]'>
          <p className='mb-2'>Status</p>
          <Dropdown
              id="filter-status"
              placeholder="Pilih Status"
              value={params.statusPolygon}
              options={optionsStatus}
              onChange={(value) => {
                setParams({ ...params, statusPolygon: value, page: 1 });                
              }}
              className="w-full md:w-[70vw]"
          />
        </div>
      </When>
      <When condition={validationUserRole(user.role_keys, ["admin-survey-mitra"])}>
        <div className='w-[183px]'>
          <p className='mb-2'>Region</p>
          <Dropdown
            id="filter-dashboard-microdemand-report"
            placeholder="Pilih Regional"
            value={params.regional || ''}
            options={listRegional}
            onChange={(value) => {
              setRegional(value);
              handleWitel(value)
            }}
            className="w-full md:w-[70vw]"
          />
        </div>
      </When>
      <div className='w-[200px]'>
        <p className='mb-2'>Branch</p>
        <Dropdown
          // disabled={!validationUserRole(user.role_keys, ["admin-survey-mitra", "admin-survey-region"]) || witels[0].value == ''}
          id="filter-dashboard-microdemand-report"
          placeholder="Pilih Witel"
          value={params.witel[0]}
          options={witels}
          onChange={(value) => {
            if(value === '') {
              setParams({ ...params, witel: [], regional: resgional, page: 1 });
            } else {
              setParams({ ...params, witel: [value], regional: resgional, page: 1 });
            }
          }}
          className="w-full md:w-[70vw]"
        />
      </div>
    </div>
  )
}
