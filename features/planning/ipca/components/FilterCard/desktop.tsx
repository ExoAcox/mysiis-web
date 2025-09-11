import { getWitel } from '@api/district/network';
import { Button } from '@components/button';
import { Dropdown } from '@components/dropdown';
import { Card } from '@components/maps';
import { Title } from '@components/text';
import CheckBoxOdpArea from '@features/planning/odp-area/components/CheckBoxOdpArea';
import { errorHelper } from '@functions/common';
import React, { useState } from 'react'
import { When } from 'react-if';
import { fetchBuildingIpca, fetchOdpAddOns, fetchOdpUimIpca } from '../../queries/odpAddons';
import { useAllBuildingData, useDefaultAllDataOdpStore, useIpcaStore, usePolygonStore } from '../../store/cummon';
import { useFilterStore, useSource } from '../../store/filter';
import { exportCsv, regionals } from '../../functions/common';
import { GetBuildingIpca, UimIpcaById } from '@api/addons/ipca';
import useModal from '@hooks/useModal';
import { toast } from 'react-toastify';


interface Props {
  access: Access;
  mapState: MapState;
  device: Device;
}

const FilterCard: React.FC<Props> = () => {

  const [params, setParams] = useFilterStore(e => [e.filter, e.set])
  const [witels, setWitels] = useState<string[]>([''])
  const [statusGetWitel, setStatusGetWitel] = useState<DataStatus>('idle')
  const [dataPolygonCluster, status] = useIpcaStore(state => [state.data, state.status])
  const [source, setSource] = useSource(state => [state.source, state.set])
  const [polygon, statusPolygon] = usePolygonStore(state => [state.data, state.status])
  const [allOdp] = useDefaultAllDataOdpStore(state => [state.data])
  const [allBuilding] = useAllBuildingData(state => [state.data])

  const setData = useModal('modal-list-ipca').setData

  const fetchWitel = (regional: { regional: string }) => {
    setStatusGetWitel('pending')
    setWitels([])
    getWitel(regional)
      .then((result) => {
        setStatusGetWitel('resolve')
        setWitels(result);
      })
      .catch((error) => {
        setStatusGetWitel('reject')
        errorHelper(error);
        setWitels(['Terjadi Kesalahan'])
      });
  };

  const handleShowData = (e: string) => {
    if (statusPolygon != 'idle') {
      if (e == 'odp') {
        fetchOdpUimIpca(polygon)
      } else {
        fetchBuildingIpca(polygon)
      }
    }
  }

  const handleExport = () => {
    let data: UimIpcaById[] | GetBuildingIpca[];
    if (source == 'odp') data = allOdp
    else data = allBuilding
    exportCsv(data)
  }

  const handleTerapkan = () => {
    if (params?.witel) fetchOdpAddOns({ regional: params.regional, witel: params.witel })
    else toast.info('Pilih lokasi terlebih dahulu!', {
      position: 'bottom-center'
    })
  }

  return (
    <Card className='min-w-[334px] grid gap-3 z-10'>
      <Title size="large">Filter</Title>
      <div>
        <div className="mb-2">Regional</div>
        <Dropdown
          id="filter-odp-area-odp-summary"
          placeholder="Pilih Regional"
          value={params.regional}
          options={regionals.map(e => ({ label: e, value: e }))}
          onChange={(value) => {
            setParams({ ...params, regional: value });
            fetchWitel({ regional: value })
          }}
          className="w-full md:w-[70vw] overflow-hidden"
        />
      </div>
      <div>
        <div className="mb-2">Witel</div>
        <Dropdown
          loading={statusGetWitel == 'pending' ? true : false}
          id="filter-odp-area-odp-summary"
          placeholder="Pilih Witel"
          value={params.witel}
          options={witels.map(e => ({ label: e, value: e }))}
          onChange={(value) => {
            setParams({ ...params, witel: value });
          }}
          className="w-full md:w-[70vw] overflow-hidden"
        />
      </div>
      <Button
        loading={status == 'pending' ? true : false}
        onClick={() => handleTerapkan()}
        className="w-full mt-2">
        Terapkan
      </Button>
      <When condition={status == 'resolve'}>
        <Button
          onClick={() => setData(dataPolygonCluster)}
          variant='ghost'
          className="w-full mt-2">
          List Segment
        </Button>
      </When>
      <When condition={statusPolygon != 'idle'}>
        <div className='mt-3 grid gap-3'>
          <CheckBoxOdpArea
            value={source}
            onChange={(e: 'odp' | 'building') => {
              setSource(e);
              handleShowData(e)
            }}
            options={[
              { label: "Lihat ODP", value: 'odp' },
              { label: "Lihat Building", value: 'building' },
            ]}
          />
          <Button
            disabled={statusPolygon != 'resolve'}
            onClick={() => handleExport()}
            variant='filled'
            className="w-full mt-2">
            Dapatkan Laporan
          </Button>
        </div>
      </When>
    </Card>
  )
}

export default FilterCard