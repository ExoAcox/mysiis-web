import { tw } from '@functions/style'
import React from 'react'

interface LayoutItemFilterProps {
  children: React.ReactNode,
  className?: string,
  onClick?: () => void
}

export default function LayoutItemFilter(props: LayoutItemFilterProps) {

  const { children, className, onClick } = props

  return (
    <div onClick={onClick} className={tw('flex items-center w-full h-[48px] border-[#C8CACD] border-[1px] rounded-lg p-3', className)}>{children}</div>
  )
}
