import { Modal } from '@components/layout'
import { ModalTitle } from '@components/text'
import { isDecimal } from '@features/planning/dashboard-microdemand/functions/report';
import useModal from '@hooks/useModal';
import React from 'react'

interface UseModal {
  userId: string;
  name: string | undefined;
  witel: string | undefined;
  mitra: string | undefined;
  valid: string;
  validMitra: number;
  invalid: number;
  unvalidated: string;
  target: string | number;
  objectid: number;
  total: number;
  status?: string;
  progress: string | number;
  source: string;
}

export default function ModalDetail() {

  const { modal, setModal, data } = useModal<UseModal>("modal-detail-report");

  return (
    <Modal
      visible={modal}
      className="w-screen mt-64"
    >
      <ModalTitle onClose={() => setModal(false)}>Detail</ModalTitle>
      <div className='w-full pb-4 pt-4 pl-4 pr-4'>
        <div className='w-full h-full'>
          <div className='flex'>
            <div className='w-1/2'><b >{data.source == 'surveyor' ? "Nama Surveyor" : 'Polygon'}</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.name}</div>
          </div>
          <div className='flex'>
            <div className='w-1/2'><b >Witel</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.witel}</div>
          </div>
          <div className='flex'>
            <div className='w-1/2'><b >Mitra</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.mitra}</div>
          </div>
          <div className='flex'>
            <div className='w-1/2'><b >Unvalidated</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.unvalidated}</div>
          </div>
          <div className='flex'>
            <div className='w-1/2'><b >Invalid</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.invalid}</div>
          </div>
          <div className='flex'>
            <div className='w-1/2'><b >Valid Mitra</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.validMitra}</div>
          </div>
          <div className='flex'>
            <div className='w-1/2'><b >Valid</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.valid}</div>
          </div>
          <div className='flex'>
            <div className='w-1/2'><b >Total</b></div>
            <div>:</div>
            <div className='ml-2 w-1/2'>{data.total}</div>
          </div>
          {
            data.source == 'polygon' &&
            <>
              <div className='flex'>
                <div className='w-1/2'><b >Target</b></div>
                <div>:</div>
                <div className='ml-2 w-1/2'>{data.target}</div>
              </div>
              <div className='flex'>
                <div className='w-1/2'><b >Progress</b></div>
                <div>:</div>
                <div className='ml-2 w-1/2'>{isDecimal(data.progress as number) + "%"}</div>
              </div>
            </>
          }
        </div>
      </div>
    </Modal>
  )
}
