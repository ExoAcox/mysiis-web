import { Dropdown } from '@components/dropdown'
import { TextField } from '@components/input'
import { Spinner } from '@components/loader'
import { Title } from '@components/text'
import { useBodyStore, useListSurveyor } from '@features/planning/mysiista/store/drawing'
import { tw } from '@functions/style'
import { When } from 'react-if'

export default function FormInput({ device }: { device?: Device }) {

  const [listSurveyor] = useListSurveyor(state => [state.list])
  const [body, setData, statusData] = useBodyStore(state => [state.body, state.set, state.status])

  return (
    <div className={tw('w-[30%] mt-5 overflow-hidden pr-5 relative', statusData == 'resolve' && 'overflow-auto', device == 'mobile' && 'w-full p-0 overflow-y-scroll h-full')}>
      <When condition={statusData == 'idle'}>
        <div className='absolute top-0 left-0 bottom-0 right-0 opacity-70 z-10'></div>
      </When>
      <When condition={statusData != 'reject'}>
        <div className='z-0 flex flex-col gap-[19px] '>
          <TextField label='Name' className='w-full' value={body.name} onChange={(e) => setData({ name: e })} placeholder='Masukan nama' />
          <TextField label='Tahap Survey' className='w-full' disabled value={body.tahap_survey} placeholder='Pilih tahap survey' />
          <Dropdown
            placeholder='Pilih Surveyor'
            options={listSurveyor}
            label='Surveyor' className='w-full' id='Surveyor'
            value={body.surveyor}
            onChange={(e) => {
              setData({ surveyor: e })
            }} />
          <TextField label='Prioritas' className='w-full' disabled value={String(body.prioritas)} placeholder='Pilih prioritas' />
          <TextField label='Keterangan' className='w-full' value={String(body.keterangan)} onChange={(e) => setData({ keterangan: e })} placeholder='Masukan keterangan' />
          <TextField label='Target Houshold' className='w-full' value={String(body.target_household)} onChange={(e) => setData({ target_household: e })} placeholder='masukan target houshold' />
          <div className='flex gap-[18px] '>
            <TextField label='Treg' className='w-full' disabled value={body.treg} placeholder='pilih treg' />
            <TextField label='Witel' className='w-full' disabled value={body.witel} placeholder='pilih witel' />
          </div>
          <TextField label='Street' className='w-full' disabled value={body.street} placeholder='masukan street' />
          <TextField label='Alamat' className='w-full' disabled value={body.address} placeholder='masukan alamat' />
          <TextField label='Kode Pos' className='w-full' disabled value={body.postal} placeholder='masukan kode pos' />
          <TextField label='Id Desa' className='w-full' disabled value={body.id_desa} placeholder='masukan id desa' />
          <TextField label='Kecamatan' className='w-full' disabled value={body.kecamatan} placeholder='masukan kecamatan' />
          <TextField label='Kabupaten' className='w-full' disabled value={body.kabupaten} placeholder='masukan kabupaten' />
          <TextField label='Provinsi' className='w-full' disabled value={body.provinsi} placeholder='masukan provinsi' />
          <TextField label='Lat' className='w-full' disabled value={String(body.lat)} placeholder='masukan lat' />
          <TextField label='Long' className='w-full' disabled value={String(body.lon)} placeholder='masukan long' />
        </div>
      </When>
      <When condition={statusData == 'pending'}>
        <div className='absolute top-0 left-0 bottom-0 right-0 z-10 flex items-center justify-center'>
          <Spinner size={40} />
        </div>
      </When>
      <When condition={statusData == 'reject'}>
        <div className='absolute top-0 left-0 bottom-0 right-0 z-10 flex items-center justify-center bg-black/5'>
          <Title>Terjadi Kesalahan</Title>
        </div>
      </When>
    </div>
  )
}
