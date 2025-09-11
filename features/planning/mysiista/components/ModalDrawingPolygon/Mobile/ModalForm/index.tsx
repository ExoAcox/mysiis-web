import { Button } from '@components/button'
import { Modal } from '@components/layout'
import { ModalTitle } from '@components/text'
import React from 'react'
import FormInput from '../../components/FormInput'

const ModalForm = ({ device }: { device: Device }) => {
  return (
    <Modal
      visible={true}
      className='w-[90%] h-[80%] relative overflow-auto'
    >
      <ModalTitle >Gambar Polygon</ModalTitle>
      <FormInput device={device} />
      <div>
        <Button>Sebelumnya</Button>
      </div>
    </Modal>
  )
}

export default ModalForm