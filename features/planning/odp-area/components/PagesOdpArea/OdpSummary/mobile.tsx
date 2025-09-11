import React, { useEffect, useState } from 'react'
import { BottomSheet } from "@components/navigation";
import { OdpSummaryProps } from '.'
import { HiOutlineMap } from "react-icons/hi";
import { googleMapsOdpShummary } from '@pages/planning/odp-area/odp-summary';
import { useOdpSummaryStore, useOdpUimValinsStore } from '@features/planning/odp-area/store';
import csvDownload from 'json-to-csv-export';
import { When } from 'react-if';
import { Title } from '@components/text';
import Info from '@public/images/vector/info_transparent.svg'
import ReactTooltip from 'react-tooltip';
import { Button } from '@components/button';

const OdpSummary: React.FC<OdpSummaryProps> = (props) => {

  const [mapType, setMapType] = useState("roadmap");

  const odpSummaryStore = useOdpSummaryStore(state => state.data)
  const odpUimValinsStore = useOdpUimValinsStore(state => state.data)
  const [statusInfo, setStatusInfo] = useState(false)

  useEffect(() => {
    if (odpSummaryStore._id != '') {
      setStatusInfo(true)
    } else {
      setStatusInfo(false)
    }
  }, [odpSummaryStore])

  const handleExport = () => {
    if (odpUimValinsStore.length > 0) {
      const dataToConvert = {
        data: odpUimValinsStore,
        filename: `Odp_Uim_Valins_summary_${odpUimValinsStore[0].provinsi}.csv`,
        delimiter: ",",
      };
      csvDownload(dataToConvert);
    }
  }

  return (
    <BottomSheet ref={props.sheetRef} defaultSnap="max" snapPoints={({ minHeight }) => [20, 100, minHeight]}>
      <div
        className="absolute top-0 -translate-y-[120%] right-2.5 bg-white w-12 h-12 rounded-full shadow cursor-pointer flex items-center justify-center"
        onClick={() => {
          const type = mapType === "roadmap" ? "hybrid" : "roadmap";
          setMapType(type);
          googleMapsOdpShummary.setMapTypeId(type);
        }}
      >
        <HiOutlineMap size="1.5rem" />
      </div>
      <div>
        <When condition={statusInfo}>
          <div className="w-full bg-white p-[16px] flex flex-col gap-[16px]">
            <Title size="large" className='text-center'>Perbandingan : {odpSummaryStore.odp_uim_count ? ((odpSummaryStore.odp_valins_count / odpSummaryStore.odp_uim_count) * 100).toFixed(2) : 0}%</Title>
            <div className='border-b-[0.5px] border-b-black-80 flex items-center justify-between text-sm pb-[18px]'>
              <div>ODP UIM: {odpSummaryStore.odp_uim_count}</div>
              <div className='border-[0.8px] border-black h-full'></div>
              <div>ODP Valins : {odpSummaryStore.odp_valins_count}</div>
            </div>
            <div className='text-[14px]'>
              <div className='flex'>
                <div className='w-full'>Kelurahan</div>
                <div className='w-full flex-wrap'>: {odpSummaryStore.kelurahan}</div>
              </div>
              <div className='flex'>
                <div className='w-full'>Kecamatan</div>
                <div className='w-full flex-wrap'>: {odpSummaryStore.kecamatan}</div>
              </div>
              <div className='flex'>
                <div className='w-full'>Kota</div>
                <div className='w-full flex-wrap'>: {odpSummaryStore.kota}</div>
              </div>
              <div className='flex'>
                <div className='w-full'>Provinsi</div>
                <div className='w-full flex-wrap'>: {odpSummaryStore.provinsi}</div>
              </div>
            </div>
          </div>
        </When>
        <When condition={odpUimValinsStore[0]._id != ''}>
          <div className="w-full bg-white p-[16px] flex flex-col gap-[16px]">
            <Title size="large">Informasi</Title>
            <div>
              <div className="w-full h-[34px] bg-[#2B2A3A] text-[16px] text-white font-medium flex items-center justify-center">0%</div>
              <div className="w-full h-[34px] bg-[#652794] text-[16px] text-white font-medium flex items-center justify-center">{`<`} 10%</div>
              <div className="w-full h-[34px] bg-[#863C84] text-[16px] text-white font-medium flex items-center justify-center">11% {'<'} 40%</div>
              <div className="w-full h-[34px] bg-[#B14C79] text-[16px] text-white font-medium flex items-center justify-center">41% {'<'} 70%</div>
              <div className="w-full h-[34px] bg-[#D86161] text-[16px] text-white font-medium flex items-center justify-center">71% {'<'} 99%</div>
              <div className="w-full h-[34px] bg-[#F38840] text-[16px] text-white font-medium flex items-center justify-center gap-2 relative">
                <span>100%</span>
                <div className='cursor-pointer' data-tip='Semua ODP sudah ODP Valins'>
                  <Info />
                </div>
                <ReactTooltip />
              </div>
            </div>
            <Button disabled={odpUimValinsStore.length <= 0} onClick={() => handleExport()} variant='ghost' className='w-full'>Export CSV</Button>
          </div>
        </When>
      </div>
    </BottomSheet>
  )
}

export default OdpSummary