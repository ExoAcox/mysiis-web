import { Button } from "@components/button"
import { Modal } from "@components/layout"
import { ModalTitle } from "@components/text"
import { tw } from "@functions/style"
import useModal from "@hooks/useModal"
import { useEffect, useState } from "react"
import { Else, If, Then, When } from "react-if"
import { handleDelete } from "../../function/drawing"
import { handleSave } from "../../queries/drawing"
import { useBodyStore, useListSurveyor, usePredicBuildingStore, usePriority } from "../../store/drawing"
import DrawingPolygon from "./components/DrawingPolygon"
import FormInput from "./components/FormInput"
import ModalPredicBuilding from "./components/ModalPredicBuilding"

const ModalDrawingPolygon = ({ device }: { device: Device }) => {

  const { modal, setModal } = useModal('moda-drawing-polygon')
  const { setData: setSuccess } = useModal('modal-success')
  const [body] = useBodyStore(state => [state.body])
  const [disable, setDisable] = useState(true)
  const [loading, setLoading] = useState(false)
  const [statusPage, setStatusPage] = useState(true)
  const [building, statusBuilding] = usePredicBuildingStore(state => [state.building, state.status])

  useEffect(() => {
    const isEmpty = Object.values(body).some(e => e == null || e == '')
    setDisable(isEmpty)
  }, [body])

  const handleBntOk = () => {
    if (device == 'mobile') {
      if (statusPage) {
        setStatusPage(false)
      } else {
        handleSave(setModal, setSuccess, setLoading)
      }
    } else {
      handleSave(setModal, setSuccess, setLoading)
    }
  }

  const handleBack = () => {
    if (device == 'mobile') {
      if (statusPage) {
        setModal(false)
      } else {
        setStatusPage(true)
      }
    } else {
      setModal(false)
    }
  }

  return (
    <Modal
      loading={loading}
      visible={modal}
      className={tw(device == 'mobile' ? 'min-w-[90%] h-[83vh] overflow-hiden relative' : 'min-w-[80%] h-[83vh] overflow-hidden relative')}
      onClose={() => {
        handleDelete()
        useListSurveyor.getState().reset()
        usePredicBuildingStore.getState().reset()
        usePriority.getState().reset()
        setLoading(false)
      }}
    >
      <ModalTitle onClose={() => setModal(false)}>Gambar Polygon</ModalTitle>
      <If condition={statusPage}>
        <Then>
          <div className="flex gap-[5%] h-[90%] pb-10 relative">
            <DrawingPolygon
              device={device}
            />
            <When condition={device !== 'mobile'}>
              <FormInput />
            </When>
          </div>
        </Then>
        <Else>
          <div className="h-[90%] overflow-hidden pb-[10%]">
            <FormInput device={device} />
          </div>
        </Else>
      </If>
      <div className={tw(device == 'mobile' ? 'bg-white absolute bottom-0 left-0 w-full p-[13px] shadow flex gap-[5%] rounded-b-md z-10' : "h-[10%] flex justify-end gap-5")}>
        <Button
          onClick={() => handleBack()}
          className={tw(device == 'mobile' ? 'w-full' : "w-[14.3%] ")} variant="ghost">{statusPage ? 'Batal' : 'Kembali'}</Button>
        <Button
          disabled={device == 'mobile' ? statusPage ? false : disable : disable}
          onClick={() => handleBntOk()}
          className={tw(device == 'mobile' ? 'w-full' : "w-[14.3%] ")}>{device == 'mobile' ? statusPage ? 'Selanjutnya' : 'Simpan' : 'Simpan'}</Button>
      </div>
      <ModalPredicBuilding
        show={statusBuilding == 'resolve'}
        building={building}
        onClose={() => usePredicBuildingStore.getState().reset()}
      />
    </Modal>
  )
}

export default ModalDrawingPolygon;