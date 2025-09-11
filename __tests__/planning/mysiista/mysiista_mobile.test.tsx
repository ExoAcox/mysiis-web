import { fireEvent, render, screen, user } from "@functions/test";
import { describe, vi } from "vitest";
import MySissta from '@pages/planning/mysiista';
import { googleMaps } from "@exoacox/google-maps-vitest-mocks";

googleMaps()

describe('mysiita mobile version', () => {
  test('should mysiista mobile version', () => {
    vi.useFakeTimers();
    render(<MySissta user={user} device={'mobile'} access={'allowed'} />).asFragment()
    vi.advanceTimersByTime(1000);

    const tabbar = screen.getByText('Valins')
    vi.useFakeTimers();
    fireEvent.click(tabbar)
    vi.advanceTimersByTime(1000);
  })
})