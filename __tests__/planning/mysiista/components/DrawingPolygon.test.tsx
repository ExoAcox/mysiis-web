import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import { describe, test, vi } from "vitest";

import useModal from "@hooks/useModal";

import { act, axios, fireEvent, render, renderHook, screen, waitFor } from "@functions/test";

import DrawingPolygon from "@features/planning/mysiista/components/ModalDrawingPolygon/components/DrawingPolygon";

googleMaps();

describe("test drawingpolygon", () => {
    const getBatas = () =>
        axios.post.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        kecamatan: "string",
                        kelurahan: "string",
                        kode_desa_dagri: "string",
                        kota: "string",
                        provinsi: "string",
                        treg: "string",
                        witel: "string",
                    },
                ],
            },
        });
    const getTahap = () => axios.get.mockResolvedValueOnce({ data: { data: { tahap_survey: 3 } } });

    test("should drawing polygon", async () => {
        const { result } = renderHook(() => useModal("moda-drawing-polygon"));

        act(() => {
            result.current.setModal(true);
        });

        vi.useFakeTimers();
        render(<DrawingPolygon device={"desktop"} />).asFragment();
        vi.advanceTimersByTime(1000);
        getBatas();
        getTahap();

        const priority = screen.getAllByTestId("btn-priority")[0];
        fireEvent.click(priority);

        const btnHand = screen.getByTestId("btn-hand");
        fireEvent.click(btnHand);
        const btnPolygon = screen.getByTestId("btn-polygon");
        fireEvent.click(btnPolygon);
        const btnDelete = screen.getByTestId("btn-delete");
        fireEvent.click(btnDelete);
    });
});
