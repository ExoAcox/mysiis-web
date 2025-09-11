import { Button } from '@components/button'
import { Modal } from '@components/layout'
import { RadiusSlider } from '@components/maps'
import { ModalTitle } from '@components/text'
import { useSourceastore } from '@features/planning/mysiista/store/odp'
import useModal from '@hooks/useModal'
import React, { useState } from 'react'

const ModalFilter = ({ onChange, onClick }: { onChange: (e: number) => void; onClick: () => void }) => {

  const { modal, setModal } = useModal('moda-filter')
  const [radius] = useSourceastore((state) => [state.radius]);
  const [radiusState, setRadiusState] = useState(radius)


  return (
    <Modal
      visible={modal}
      className='w-[90%] mt-[90%]'
    >
      <ModalTitle onClose={() => setModal(false)}>Filter</ModalTitle>
      <div>
        <RadiusSlider
          value={radiusState}
          className="mt-3"
          min={50}
          max={300}
          step={25}
          onChange={e => {
            setRadiusState(e)
            onChange(e)
          }}
        />
      </div>
      <Button
        className='w-full mt-[21px]'
        onClick={() => onClick()}>Terapkan</Button>
    </Modal>
  )
}

export default ModalFilter