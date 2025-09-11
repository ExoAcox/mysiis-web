import React from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import LayoutItemFilter from '../LayoutItemFilter'

export default function SearchField() {
  return (
    <LayoutItemFilter>
      <AiOutlineSearch size={20} />
      <input type="text" placeholder='Masukkan nama atau telepon' className='w-full ml-2 h-full focus:outline-none' />
      <button>
        <AiOutlineClose />
      </button>
    </LayoutItemFilter>
  )
}
