import { getNcx } from "@api/district/metadata";
import { useNcxStore } from "../store";
import { errorHelper } from "@functions/common";

interface GetNcx {
    latLng: LatLng;
}

const fetchNcx = async (args: GetNcx) => {
    const { latLng } = args;
    try {
        const ncxAddress = await getNcx(latLng);

        const filterGoogle = (field: string) => {
            const filterName = ncxAddress?.google?.address_components?.find((address) => {
                return address.types[0] === field;
            });
            if (!filterName) return "";
            return filterName.long_name;
        };

        useNcxStore.setState({
            data: {
                googleAddress: {
                    kelurahan: filterGoogle("administrative_area_level_4"),
                    kecamatan: filterGoogle("administrative_area_level_3").replaceAll("Kecamatan ", ""),
                    kota: filterGoogle("administrative_area_level_2"),
                    provinsi: filterGoogle("administrative_area_level_1"),
                },
                addressNcx: {
                    kelurahan: !ncxAddress?.ncx?.kelurahan?.is_alternative ? ncxAddress?.ncx?.kelurahan?.name : "",
                    kecamatan: !ncxAddress?.ncx?.kecamatan?.is_alternative ? ncxAddress?.ncx?.kecamatan?.name : "",
                    kota: !ncxAddress?.ncx?.kabupaten?.is_alternative ? ncxAddress?.ncx?.kabupaten?.name : "",
                    provinsi: !ncxAddress?.ncx?.provinsi?.is_alternative ? ncxAddress?.ncx?.provinsi?.name : "",
                },
                ncx_pendekatan: {
                    kelurahan: ncxAddress?.ncx?.kelurahan?.name,
                    kecamatan: ncxAddress?.ncx?.kecamatan?.name,
                    kota: ncxAddress?.ncx?.kabupaten?.name,
                    provinsi: ncxAddress?.ncx?.provinsi?.name,
                },
            },
            status: "resolve",
        });
    } catch (error) {
        useNcxStore.setState({
            data: {
                googleAddress: { kelurahan: "", kecamatan: "", kota: "", provinsi: "" },
                addressNcx: { kelurahan: "", kecamatan: "", kota: "", provinsi: "" },
                ncx_pendekatan: { kelurahan: "", kecamatan: "", kota: "", provinsi: "" },
            },
            error: errorHelper(error),
            status: "reject",
        });
    }
};

export default fetchNcx;
