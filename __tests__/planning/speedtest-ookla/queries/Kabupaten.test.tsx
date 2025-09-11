import { describe } from "vitest";

import { axios } from "@functions/test";

import { googleMaps, Polygon } from '@exoacox/google-maps-vitest-mocks';
import fetchKabupatenDetail from "@features/planning/speedtest-ookla/queries/agregat/kabupaten";

googleMaps();
Polygon();

describe("Kabupaten Detail Test", () => {
    test("Fetch kabupaten detail resolved", () => {
        axios.get.mockResolvedValue({
            data: {
                data: {
                    id_kab: 0,
                    kode_desa_dagri: "string",
                    provinsi: "JAWA BARAT",
                    kota: "string",
                    kecamatan: "string",
                    kelurahan: "string",
                    polygon_kel: "string",
                }
            }
        });

        const code = 40 
        fetchKabupatenDetail({code});
    });
});