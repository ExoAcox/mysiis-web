import { Button } from '@components/button'
import { Dropdown } from '@components/dropdown'
import { Modal } from '@components/layout'
import { ModalTitle } from '@components/text'
import { fetchDataOdpSummary } from '@features/planning/odp-area/queries/OdpSummary'
import { fetchKabupaten, fetchProvinsi } from '@features/planning/odp-area/queries/summary_table'
import { useListKota, useListProvinsi, useSource } from '@features/planning/odp-area/store'
import useModal from '@hooks/useModal'
import React, { useEffect, useState } from 'react'

const ModalInfo = () => {

  const { modal, setModal } = useModal('modal-info-odp-summary')
  const listProvinsiStore = useListProvinsi(state => state.data)
  const listKotaStore = useListKota(state => state.data)
  const [sourceStore] = useSource(state => [state.source])

  const [params, setParams] = useState({
    provinsi: '',
    kota: ''
  })

  useEffect(() => {
    if (modal) {
      fetchProvinsi()
    }
  }, [modal])

  useEffect(() => {
    if (params.provinsi != '')
      fetchKabupaten(params.provinsi)
  }, [params.provinsi])

  const handleBtn = () => {
    const latLng = listKotaStore.find(e => e.label == params.kota)
    latLng?.latLng && fetchDataOdpSummary(latLng?.latLng, sourceStore)
    setModal(false)
  }

  return (
    <Modal
      visible={modal}
      className='min-w-[90vw] mt-[70%] flex flex-col gap-5'
    >
      <ModalTitle onClose={() => setModal(false)}>Filter</ModalTitle>
      <Dropdown
        id="filter-odp-area-odp-summary"
        placeholder="Pilih Provinsi"
        value={params.provinsi}
        options={listProvinsiStore}
        onChange={(value) => {
          setParams({ ...params, provinsi: value });
        }}
        className="w-full overflow-hidden"
        label='Provinsi'
      />

      <Dropdown
        disabled={params.provinsi == ''}
        id="filter-odp-area-odp-summary"
        placeholder="Pilih Kabupaten"
        value={params.kota}
        options={listKotaStore}
        onChange={(value) => {
          setParams({ ...params, kota: value });
        }}
        className="w-full overflow-hidden"
        label='Kabupaten'
      />
      <Button
        onClick={() => handleBtn()}
        disabled={params.provinsi == '' && params.kota == ''}
        className="w-full">Set Filter</Button>
    </Modal>
  )
}

export default ModalInfo