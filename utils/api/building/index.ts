import { axios, catchHelper, header } from "@libs/axios";

let buildingKelurahanController: AbortController;

interface GetBuildingByKelurahan {
    kode_desa_dagri: string;
    page: number;
    row: number;
}

interface BuildingByKelurahan {
    lists: [
        {
            id: number;
            sumber: string;
            geom: string;
            kode_desa: string;
            provinsi: string;
            kota: string;
            kecamatan: string;
            kelurahan: string;
        }
    ];
    countTotal: number;
    countPage: number;
}

export const getBuildingByKelurahan = (params: GetBuildingByKelurahan): Promise<BuildingByKelurahan> => {
    if (buildingKelurahanController) buildingKelurahanController.abort();
    buildingKelurahanController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_BUILDING_URL + `/building/v1/get-by-kelurahan`, {
                params,
                headers: header(),
                signal: buildingKelurahanController.signal,
            })
            .then((result) => resolve(result.data.data))
            .catch((error) => catchHelper(reject, error));
    });
};
