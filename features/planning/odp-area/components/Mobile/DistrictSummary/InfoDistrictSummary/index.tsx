import { FloatingMenu } from '@components/layout'
import useModal from '@hooks/useModal';
import { CiCircleAlert } from "react-icons/ci";

const InfoDistrictSummaryMobile = () => {

  const { setModal } = useModal('modal-detail-info')

  return (
    <FloatingMenu>
      <div
        data-testid="info-port"
        onClick={() => setModal(true)}
        className='bg-white rounded-lg border border-primary-40 flex items-center py-[8px] px-[12px] gap-1 cursor-pointer'>
        <CiCircleAlert size={20} className='rotate-180' />
        <span className='text-primary-40 font-bold'>Informasi Port Penetration</span>
      </div>
    </FloatingMenu>
  )
}

export default InfoDistrictSummaryMobile