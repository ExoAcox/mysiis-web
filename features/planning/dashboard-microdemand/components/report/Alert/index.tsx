import { Title } from '@components/text'
import React from 'react'

interface AlertProps {
  title: string
}

export default function Alert({ title }: AlertProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[200px] p-[24px]'>
      <div className='min-w-[288px] min-h-[200px] bg-[#FEDED8] rounded-lg'></div>
      <Title size='h3' className='mt-6 capitalize'>Data {title} Tidak Ditemukan</Title>
      <Title size='medium' className='text-gray-400 font-normal'>Gunakan kata kunci lain atau ubah filter & silakan coba lagi</Title>
    </div>
  )
}
