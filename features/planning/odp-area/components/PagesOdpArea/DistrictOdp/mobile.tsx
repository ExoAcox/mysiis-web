import React, { useState } from 'react'
import { BottomSheet } from "@components/navigation";
import { DistrictOdpProps } from '.';
import { googleMapsDistrictOdp } from '@pages/planning/odp-area/district-odp';
import { HiOutlineMap } from "react-icons/hi";
import { When } from 'react-if';
import ListItem from '../../ListItem';
import { useCountTotalBuidlingStore, useDistrictBuildingStore, useDistrictOdpSummaryStore, useDistrictStore, useReport } from '@features/planning/odp-area/store';
import { Title } from '@components/text';
import { Button } from '@components/button';
import { fetchReportData } from '@features/planning/odp-area/queries/building_by_kelurahan';
import useModal from '@hooks/useModal';

const DistrictOdp: React.FC<DistrictOdpProps> = (props) => {

  const [mapType, setMapType] = useState("roadmap");
  const setModalDistrict = useModal("odp-modal");

  const [district, statusDictrict] = useDistrictStore(state => [state.data, state.status])
  const [odpSummary, statusDistrictOdpSummary] = useDistrictOdpSummaryStore(state => [state.data, state.status])
  const [statusBuilding] = useDistrictBuildingStore(state => [state.status])
  const [countTotal] = useCountTotalBuidlingStore(state => [state.countTotal, state.status])
  const [report, statusReport] = useReport(state => [state.report, state.status]);

  return (
    <BottomSheet ref={props.sheetRef} defaultSnap="max" snapPoints={({ minHeight }) => [20, 100, minHeight]}>
      <div
        className="absolute top-0 -translate-y-[120%] right-2.5 bg-white w-12 h-12 rounded-full shadow cursor-pointer flex items-center justify-center"
        onClick={() => {
          const type = mapType === "roadmap" ? "hybrid" : "roadmap";
          setMapType(type);
          googleMapsDistrictOdp.setMapTypeId(type);
        }}
      >
        <HiOutlineMap size="1.5rem" />
      </div>
      <When condition={statusDictrict != 'idle'}>
        <div className="w-full bg-white p-[16px] flex flex-col gap-[16px]">
          <Title size="large" className='text-center'>Informasi ODP</Title>
          <When condition={statusDictrict == 'resolve'}>
            <div className='text-[14px]'>
              <ListItem title='Kelurahan' subTitle={district.kelurahan} />
              <ListItem title='Kecamatan' subTitle={district.kecamatan} />
              <ListItem title='Kota' subTitle={district.kota} />
              <ListItem title='Provinsi' subTitle={district.provinsi} />
            </div>
          </When>
          <When condition={statusDictrict == 'pending'}>
            <p>Fetch Data...</p>
          </When>
          <When condition={statusDictrict == 'reject'}>
            <p>Terjadi Kesalahan</p>
          </When>

          <When condition={statusDistrictOdpSummary == 'resolve' && statusBuilding == 'resolve'}>
            <div className='text-[14px]'>
              <ListItem title='Device Port' subTitle={odpSummary.deviceportnumber} />
              <ListItem title='Idle Port' subTitle={odpSummary.portidlenumber} />
              <ListItem title='Used Port' subTitle={(odpSummary.deviceportnumber - odpSummary.portidlenumber)} />
              <ListItem title='Total ODP' subTitle={odpSummary.total_odp} />
            </div>
            <div className='text-[14px]'>
              <ListItem subTitle={odpSummary.status_occ_add.green}>
                <div className='rounded-full w-[16px] h-[16px] bg-[#2FA52D]' />
                <span className='ml-2'>Green</span>
              </ListItem>
              <ListItem subTitle={odpSummary.status_occ_add.yellow}>
                <div className='rounded-full w-[16px] h-[16px] bg-[#FFFF00]' />
                <span className='ml-2'>Yellow</span>
              </ListItem>
              <ListItem subTitle={odpSummary.status_occ_add.red}>
                <div className='rounded-full w-[16px] h-[16px] bg-[#C00000]' />
                <span className='ml-2'>Red</span>
              </ListItem>
              <ListItem subTitle={odpSummary.status_occ_add.black_system}>
                <div className='rounded-full w-[16px] h-[16px] bg-[#000000] border-2 border-[#2FA52D]' />
                <span className='ml-2'>Black Green</span>
              </ListItem>
              <ListItem subTitle={odpSummary.status_occ_add.black}>
                <div className='rounded-full w-[16px] h-[16px] bg-[#000000]' />
                <span className='ml-2'>Black</span>
              </ListItem>
            </div>
          </When>
          <When condition={statusDistrictOdpSummary == 'pending' || statusBuilding == 'pending'}>
            <p>Fetch Data...</p>
          </When>
          <When condition={statusDistrictOdpSummary == 'reject' || statusBuilding == 'reject'}>
            <p>Terjadi Kesalahan</p>
          </When>
          <Button
            disabled={statusDistrictOdpSummary != 'resolve' && statusBuilding != 'resolve' || statusDistrictOdpSummary == 'pending' || statusBuilding == 'pending'}
            onClick={() => setModalDistrict.setModal(true)}
            className='w-full'
          >Lihat Daftar ODP</Button>
          <div>
            <Title className='mb-2' size="large">Informasi Building</Title>
            <ListItem title='Building Count' subTitle={countTotal} />
            <When condition={statusReport == 'resolve'}>
              <ListItem titleClassname='text-[16px]' title='Penetration' subTitle={`${report.penetration}%`} />
              <ListItem titleClassname='text-[16px]' title='Readiness' subTitle={`${report.readiness}%`} />
            </When>
          </div>
          <Button
            disabled={statusReport == 'resolve' || statusDistrictOdpSummary != 'resolve' && statusBuilding != 'resolve' || statusDistrictOdpSummary == 'pending' || statusBuilding == 'pending'}
            variant='ghost'
            className='w-full'
            onClick={() => fetchReportData()}
          >Get Report</Button>
        </div>
      </When>
    </BottomSheet>
  )
}

export default DistrictOdp