import { tw } from "@functions/style";
import { When } from "react-if";

interface Props {
  title: string;
  value: string;
  color?: string
}

const ListItem: React.FC<Props> = (props) => {
  const { title, value, color } = props
  return (
    <div className='flex'>
      <div className={tw('w-full flex gap-2', color && 'items-center')}>
        <When condition={color == 'black_green'}>
          <div className="w-[16px] h-[16px] rounded-full border-4 border-green-600 bg-black"></div>
        </When>
        <When condition={color && color != 'black_green'}>
          <div className={tw('w-[16px] h-[16px] rounded-full', color && `bg-[${color}]`)}></div>
        </When>
        {title}</div>
      <div className='mx-2'>:</div>
      <div className='w-full'>{value}</div>
    </div>
  )
}

export default ListItem