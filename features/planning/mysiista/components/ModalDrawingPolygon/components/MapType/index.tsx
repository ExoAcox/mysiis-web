import { tw } from '@functions/style'
import React, { useState } from 'react'

type StateMapType = 'roadmap' | 'hybrid'

export default function MapType() {

  const [type, setType] = useState<StateMapType>('roadmap')

  const handleBtn = (value: StateMapType) => {
    setType(value)
    const element = document.getElementById('maps-type')
    element!.dataset.type = value
    element!.click();
  }

  return (
    <div className='flex w-full h-full rounded-lg overflow-hidden'>
      <button className='absolute' id="maps-type"></button>
      <button
        onClick={() => handleBtn('roadmap')}
        className={tw('w-full h-full flex items-center justify-center font-bold rounded-tl-lg rounded-bl-lg border-y-2 border-l-2 border-primary-40 text-primary-40 p-0 m-0', type == 'roadmap' && 'border-primary-60 bg-primary-20 text-primary-60')}>Peta</button>
      <div className='h-full w-1 bg-primary-40'></div>
      <button
        onClick={() => handleBtn('hybrid')}
        className={tw('w-full h-full flex items-center justify-center rounded-tr-lg rounded-br-lg font-bold border-y-2 border-r-2 border-primary-40 text-primary-40 p-0 m-o', type == 'hybrid' && 'border-primary-60 bg-primary-20 text-primary-60')}>Satelit</button>
    </div>
  )
}
