import { Title } from '@components/text'
import { MdClose } from "react-icons/md";

interface PredicBuilding {
  show: boolean,
  building: string,
  onClose?: () => void;
}
const ModalPredicBuilding = ({
  show,
  building,
  onClose
}: PredicBuilding) => {

  if (!show) return null

  return (
    <div className='absolute left-0 top-0 bottom-0 right-0 flex justify-center items-center' >
      <div className='p-5 rounded-xl shadow-md bg-secondary-60 w-[300px] flex justify-center items-center relative'>
        <Title size='large' className='text-white'>Prediksi jumlah building total: {building}</Title>
        {onClose && <MdClose className="cursor-pointer hover:text-[20px] absolute right-2 top-2 " color={'white'} onClick={onClose} />}
      </div>
    </div>
  )
}

ModalPredicBuilding.defaultType = {
  show: false,
  building: 0
}

export default ModalPredicBuilding