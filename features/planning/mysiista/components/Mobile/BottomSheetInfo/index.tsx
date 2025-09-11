import { BottomSheet } from '@components/navigation';
import React, { RefObject } from 'react'
import { SheetRef } from "@components/navigation/BottomSheet"
import IconDraw from '@images/vector/icon-draw.svg'
import { Button } from '@components/button';
import { useOdpPercentStore } from '@features/planning/mysiista/store/odp';
import { Subtitle, Title } from '@components/text';
import { Else, If, Then, When } from 'react-if';
import { Spinner } from '@components/loader';
import useModal from '@hooks/useModal';
import { markerPinMysiista } from '@pages/planning/mysiista';

interface BottomSheetInfoProps {
  sheetRef?: RefObject<SheetRef>;
  device: Device
}

const BottomSheetInfo = (props: BottomSheetInfoProps) => {

  const [odp_info, statusOdpInfo] = useOdpPercentStore(state => [state.odp_precent, state.status])
  const { setData } = useModal('moda-drawing-polygon')

  if (props.device != 'mobile') return null

  const handleBtn = () => {
    setTimeout(() => {
      const postition = {
        lat: markerPinMysiista.getPosition()?.lat(),
        lng: markerPinMysiista.getPosition()?.lng()
      }
      setData(postition)
    }, 500);
  }

  return (
    <BottomSheet ref={props.sheetRef} defaultSnap="max" snapPoints={({ minHeight }) => [40, 100, minHeight]}>
      <Button
        onClick={() => handleBtn()}
        className="absolute top-0 -translate-y-[120%] w-[50%] ml-[24%]"
      ><IconDraw className='text-2xl text-white' />Gambar Polygon</Button>
      <If condition={statusOdpInfo == 'reject'}>
        <Then><Subtitle>Fethc data filed</Subtitle></Then>
        <Else>
          <When condition={statusOdpInfo == 'pending'}>
            <Spinner size={20} />
          </When>
          <When condition={statusOdpInfo == 'resolve'}>
            <Title size='medium' className='text-[16px] text-center'>Ditemukan {odp_info}</Title>
          </When>
        </Else>
      </If>
    </BottomSheet>
  )
}

export default BottomSheetInfo