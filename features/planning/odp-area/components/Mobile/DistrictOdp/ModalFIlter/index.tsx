import { Button } from '@components/button'
import { Modal } from '@components/layout'
import { ModalTitle } from '@components/text'
import { showPolygonBuilding } from '@features/planning/odp-area/queries/building_by_kelurahan'
import { showDistrictOdp } from '@features/planning/odp-area/queries/odp_uim_by_kelurahan'
import { showHeatmap } from '@features/planning/odp-area/queries/odp_uim_mini_by_kabupaten'
import { useDistrictBuildingStore, useDistrictHeatmapStore, useDistrictOdpSummaryStore, useSource } from '@features/planning/odp-area/store'
import useModal from '@hooks/useModal'
import { heatmapOdpAreaDistrictOdp, odpAreaMarkersDistrictOdp, odpAreaPolygonsDistrictOdp } from '@pages/planning/odp-area/district-odp'
import React, { useEffect, useState } from 'react'
import CheckBoxOdpArea from '../../../CheckBoxOdpArea'

const ModalFilter = () => {

  const { modal, setModal } = useModal('modal-filter')
  const [sourceStore, setSourceStore] = useSource(state => [state.source, state.setSource])
  const [source, setSource] = useState('district-odp')
  const [district_building, statusBuilding] = useDistrictBuildingStore(state => [state.data, state.status])
  const [odpSummary] = useDistrictOdpSummaryStore(state => [state.data])
  const [district_heatmap] = useDistrictHeatmapStore(state => [state.data, state.status])


  const onTabChange = (e: string) => {
    setSourceStore(e)
    if (e == 'district-odp') {
      heatmapOdpAreaDistrictOdp.forEach((x) => x.setMap(null));
      heatmapOdpAreaDistrictOdp.length = 0;
      odpAreaPolygonsDistrictOdp.forEach((x) => x.setMap(null));
      odpAreaPolygonsDistrictOdp.length = 0;
      showDistrictOdp(odpSummary.lists)
    } else if (e == 'district-building') {
      heatmapOdpAreaDistrictOdp.forEach((x) => x.setMap(null));
      heatmapOdpAreaDistrictOdp.length = 0;
      odpAreaMarkersDistrictOdp.forEach((x) => x.setMap(null));
      odpAreaMarkersDistrictOdp.length = 0;
      showPolygonBuilding(district_building)
    } else {
      odpAreaPolygonsDistrictOdp.forEach((x) => x.setMap(null));
      odpAreaPolygonsDistrictOdp.length = 0;
      odpAreaMarkersDistrictOdp.forEach((x) => x.setMap(null));
      odpAreaMarkersDistrictOdp.length = 0;
      showHeatmap(district_heatmap)
    }
    setModal(false)
  }

  useEffect(() => {
    if (sourceStore != source) {
      setSourceStore(source)
    }
  }, [source])

  return (
    <Modal
      visible={modal}
      className='min-w-[90vw] mt-[70%] flex flex-col gap-[16px]'
    >
      <ModalTitle onClose={() => setModal(false)}>Filter</ModalTitle>
      <CheckBoxOdpArea
        disabled={statusBuilding == 'pending'}
        value={source}
        onChange={(e) => {
          setSource(e)
          setSourceStore(e)
        }}
        options={[
          { label: "ODP", value: "district-odp" },
          { label: "Building", value: "district-building" },
          { label: "Heatmap", value: "district-heatmap" },
        ]}
      />
      <Button className='w-full' onClick={() => onTabChange(source)} >Terapkan</Button>
    </Modal>
  )
}

export default ModalFilter