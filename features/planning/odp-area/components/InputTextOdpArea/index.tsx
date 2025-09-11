import { tw } from '@functions/style'
import { AiOutlineSearch } from 'react-icons/ai'

interface InputTextOdpAreaProps {
  parentClassName?: string,
  className?: string,
  onChange: (e: string) => void,
  onKeyDown: (e: string) => void,
  value: string
}

export default function InputTextOdpArea({ parentClassName, className, onChange, value, onKeyDown }: InputTextOdpAreaProps) {
  return (
    <div className={tw('border-2 border-[#C8CACD] rounded-lg h-[48px] flex items-center px-2', parentClassName)} >
      <AiOutlineSearch size={25} />
      <input
        value={value}
        className={tw('w-full h-full pl-2 focus:outline-none text-[14px]', className)}
        placeholder='Masukkan ODP yang Anda cari'
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => onKeyDown(e.key)}
      />
    </div>
  )
}
