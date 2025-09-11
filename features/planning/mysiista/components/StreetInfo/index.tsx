import { Button } from '@components/button'
import { Spinner } from '@components/loader'
import { Subtitle, Title } from '@components/text'
import useModal from '@hooks/useModal'
import IconDraw from '@images/vector/icon-draw.svg'
import { markerPinMysiista } from '@pages/planning/mysiista'
import { Else, If, Then, When } from 'react-if'
import { useOdpPercentStore, useStreetStore } from '../../store/odp'

export default function StreetInfor() {

  const { setData } = useModal('moda-drawing-polygon')

  const [street, statusStreet] = useStreetStore(state => [state.street, state.status])
  const [odp_info, statusOdpInfo] = useOdpPercentStore(state => [state.odp_precent, state.status])

  const handleBtn = () => {
    const postition = {
      lat: markerPinMysiista.getPosition()?.lat(),
      lng: markerPinMysiista.getPosition()?.lng()
    }
    setData(postition)
  }

  if (statusOdpInfo == 'idle' && statusStreet == 'idle') return null
  return (
    <div className='rounded-lg shadow-lg p-[16px] bg-white text-center flex flex-col gap-5'>
      <If condition={statusOdpInfo == 'reject' || statusStreet == 'reject'}>
        <Then><Subtitle>Fethc data filed</Subtitle></Then>
        <Else>
          <When condition={statusOdpInfo == 'pending'}>
            <Spinner size={20} />
          </When>
          <When condition={statusOdpInfo == 'resolve'}>
            <Title size='medium' className='text-[16px]'>Ditemukan {odp_info}</Title>
            <Subtitle>{street}</Subtitle>
            <Button onClick={() => handleBtn()} disabled={statusOdpInfo != 'resolve'} className='w-full'><IconDraw className='text-2xl text-white' />Gambar Polygon</Button>
          </When>
        </Else>
      </If>
    </div>
  )
}
