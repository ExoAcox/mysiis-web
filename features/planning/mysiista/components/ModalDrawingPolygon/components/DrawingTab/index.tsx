import { tw } from '@functions/style'
import Hand from '@public/images/vector/hand.svg'
import Draw from '@public/images/vector/icon-draw.svg'
import Trash from '@public/images/vector/trash.svg'
import { useState } from 'react'

export type StateDrawingTab = 'hand' | 'polygon' | 'delete'

export default function DrawingTab({ onChange }: { onChange: (e: StateDrawingTab) => void }) {

  const [check, setCheck] = useState<StateDrawingTab>('hand')

  const handleCheck = (value: StateDrawingTab) => {
    onChange(value)
    if (value == 'hand' || value == 'polygon') setCheck(value)
  }

  return (
    <div className='flex items-center justify-center gap-3 bg-white h-[40px] w-[127px] rounded-lg shadow-md'>
      <button data-testid='btn-hand' onClick={() => handleCheck('hand')} className='p-0 w-full flex items-center justify-center'>
        <Hand className={tw('text-[18px]', check == 'hand' && 'text-primary-40')} />
      </button>
      <button data-testid='btn-polygon' onClick={() => handleCheck('polygon')} className='p-0 w-full flex items-center justify-center'>
        <Draw className={tw('text-[18px]', check == 'polygon' && 'text-primary-40')} />
      </button>
      <button data-testid='btn-delete' onClick={() => handleCheck('delete')} className='p-0 w-full flex items-center justify-center'>
        <Trash className='text-[18px]' />
      </button>
    </div>
  )
}
