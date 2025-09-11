import { tw } from '@functions/style'
import { useSourceastore } from '../../store/odp'

interface FloatingMenuProps {
  onChange: (e: string) => void
}

export default function FloatingTab({ onChange }: FloatingMenuProps) {

  const [active, setActive] = useSourceastore(state => [state.source, state.set])

  const handleBtn = (e: "uim" | "valins") => {
    setActive(e)
    onChange(e)
  }

  return (
    <div className='flex w-full h-[36px] rounded-lg overflow-hidden'>
      <button
        onClick={() => handleBtn('uim')}
        className={tw('w-full h-full flex items-center justify-center font-bold rounded-tl-lg rounded-bl-lg border-y-2 border-l-2 border-primary-40 text-primary-40 p-0 m-0', active == 'uim' && 'border-primary-60 bg-primary-20 text-primary-60')}>UIM</button>
      <div className='h-full w-1 bg-primary-40'></div>
      <button
        onClick={() => handleBtn('valins')}
        className={tw('w-full h-full flex items-center justify-center rounded-tr-lg rounded-br-lg font-bold border-y-2 border-r-2 border-primary-40 text-primary-40 p-0 m-o', active == 'valins' && 'border-primary-60 bg-primary-20 text-primary-60')}>Valins</button>
    </div>
  )
}
