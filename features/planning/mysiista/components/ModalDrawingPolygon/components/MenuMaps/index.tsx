import { handleDrawer } from '@features/planning/mysiista/function/drawing'
import React from 'react'
import { When } from 'react-if'
import CheckBoxMysiista from '../CheckBoxMysiista'
import DrawingTab from '../DrawingTab'
import MapType from '../MapType'

export default function MenuMaps({ device }: { device: Device }) {

  return (
    <div className='absolute top-3 px-3 w-full flex justify-between items-center '>
      <div className='flex items-center justify-center gap-3 bg-white h-[40px] w-[127px] rounded-lg shadow-md'>
        <CheckBoxMysiista onChange={() => {
          // 
        }} />
        <span>Edit existing</span>
      </div>
      <When condition={device != 'mobile'}>
        <DrawingTab
          onChange={handleDrawer}
        />
      </When>
      <div className='bg-white rounded-lg shadow-md h-[40px] w-[127px]'>
        <MapType />
      </div>
    </div>
  )
}
