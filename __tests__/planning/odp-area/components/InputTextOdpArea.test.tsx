import InputTextOdpArea from "@features/planning/odp-area/components/InputTextOdpArea";
import { fireEvent, render, screen } from "@functions/test";
import { describe, expect, vi } from "vitest";

describe('InputTextOdpArea', () => {

  test('should snapshoot InputTextOdpArea', () => {

    const testFunc = vi.fn()

    const container = render(<InputTextOdpArea onChange={testFunc} onKeyDown={testFunc} value={""} />).asFragment()
    expect(container).matchSnapshot()

    const input = screen.getByPlaceholderText('Masukkan ODP yang Anda cari')
    fireEvent.change(input, { target: { value: "name" } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 })
  })
})