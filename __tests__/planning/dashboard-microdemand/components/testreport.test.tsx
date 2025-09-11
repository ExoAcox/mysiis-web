import Alert from "@features/planning/dashboard-microdemand/components/report/Alert";
import CardTable from "@features/planning/dashboard-microdemand/components/report/CardTable";
import LayoutItemFilter from "@features/planning/dashboard-microdemand/components/report/Filters/LayoutItemFilter";
import SearchField from "@features/planning/dashboard-microdemand/components/report/Filters/SearchField";
import ModalConfirm from "@features/planning/dashboard-microdemand/components/report/ModalConfirm";
import { act, axios, fireEvent, render, renderHook, screen } from "@functions/test";
import useModal from "@hooks/useModal";
import { describe, test, vi } from "vitest";

describe('testing', () => {

  test('testing LayoutItemFilter', () => {
    render(
      <LayoutItemFilter>
        <div>test</div>
      </LayoutItemFilter>
    )
  })
  test('testing SearchField', () => {
    render(<SearchField />)
  })

  // test('testing ModalConfirm', () => {

  //   const { result } = renderHook(() => useModal("modal-confirm-report"))

  //   act(() => { result.current.setData({ status: 'active' }) })

  //   render(<ModalConfirm onSuccess={() => vi.fn()} />)

  //   axios.post.mockResolvedValueOnce({ data: { data: { status: 'success' } } })
  //   const btn = screen.getByText('Matikan')
  //   fireEvent.click(btn)

  // })
  test('testing Alert', () => {
    render(<Alert title={"alert"} />)
  })
  test('testing CardTable', () => {
    render(<CardTable rows={[
      {
        userId: 'string',
        name: 'string',
        witel: 'string',
        mitra: 'string',
        valid: 'string',
        validMitra: 3,
        invalid: 3,
        unvalidated: 'string',
        target: 3,
        total: 3,
        progress: 3,
      }
    ]} source={"polygon"} loading={false} />)
  })

})