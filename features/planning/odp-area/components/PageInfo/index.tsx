import { tw } from '@functions/style'
import React from 'react'

interface PageInfoProps {
  children: React.ReactNode,
  className?: string
}

export default function PageInfo({ children, className }: PageInfoProps) {
  return (
    <div className={tw("mx-auto px-[135px] sm:px-4 md:px-6 h-[4vh] bg-[#DEEBFF] border-y-[1px] border-y-[#2684FF] flex items-center text-[14px]", className)}>
      {children}
    </div>
  )
}
