import { useQuery } from "@tanstack/react-query";

import {
    GetFaq,
    getFaqAllCategoryActive,
    getFaqByCategory,
    getFaqByPopularity,
    getFaqBySearch,
    getPointDescription,
    getTermsCondition,
} from "@api/content";
import { Kelurahan as Kelurahan_, getKelurahanByLocation } from "@api/district/metadata";
import { GetMyVoucher, GetVoucher, getMyVoucher, getMyWallet, getTask, getVoucher } from "@api/point";

import { errorHelper } from "@functions/common";
import { convertAddressToString, getStreetName } from "@functions/maps";

export interface Kelurahan extends Kelurahan_ {
    formattedAddress?: string;
}

export const kelurahanDefaultValue: Kelurahan = {
    st_name: "",
    kode_desa_dagri: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    regional: "",
    witel: "",
    geom: "",
    formattedAddress: "",
    lat: 0,
    long: 0,
};

export const useKelurahan = (latLng?: LatLng) => {
    return useQuery({
        queryKey: ["/maps/kelurahan", latLng],
        queryFn: async () => {
            try {
                const location = await getKelurahanByLocation({ lat: latLng!.lat, long: latLng!.lng });
                const st_name = await getStreetName(latLng!);

                return { ...location, formattedAddress: convertAddressToString({ st_name, ...location }) };
            } catch (error) {
                throw new Error(errorHelper(error)?.message);
            }
        },
        enabled: !!latLng,
    });
};

export const useTermsCondition = () => {
    return useQuery({
        queryKey: ["/content/getTermsCondition"],
        queryFn: () => getTermsCondition(),
    });
};

export const useFaqAllCategoryActive = () => {
    return useQuery({
        queryKey: ["/content/getFaqAllCategoryActive"],
        queryFn: () => getFaqAllCategoryActive(),
    });
};

export const useFaqByCategory = ({ categoryKey, status }: GetFaq) => {
    return useQuery({
        queryKey: ["/content/getFaqByCategory", { categoryKey, status }],
        queryFn: () => getFaqByCategory({ categoryKey, status }),
        enabled: !!categoryKey,
    });
};

export const useFaqByPopularity = () => {
    return useQuery({
        queryKey: ["/content/getFaqByPopularity"],
        queryFn: () => getFaqByPopularity({ page: 1, row: 3, status: "active" }),
    });
};

export const useFaqBySearch = ({ keyword }: { keyword: string }) => {
    return useQuery({
        queryKey: ["/content/getFaqBySearch", keyword],
        queryFn: () => getFaqBySearch({ page: 1, row: 99, keyword }),
        enabled: !!keyword,
    });
};

export const usePointDescription = () => {
    return useQuery({
        queryKey: ["/content/getPointDescription"],
        queryFn: () => getPointDescription({ categoryKey: "mysiis-point", status: "active" }),
    });
};

export const usePointTask = () => {
    return useQuery({
        queryKey: ["/point/getTask"],
        queryFn: () => getTask(),
    });
};

export const usePointMyWallet = () => {
    return useQuery({
        queryKey: ["/point/getMyWallet"],
        queryFn: () => getMyWallet(),
    });
};

export const usePointVoucher = ({ page, row, isExpired, isAvailable }: GetVoucher) => {
    return useQuery({
        queryKey: ["/point/getVoucher", { page, row, isExpired, isAvailable }],
        queryFn: () => getVoucher({ page, row, isExpired, isAvailable }),
    });
};

export const usePointMyVoucher = ({ page, row }: GetMyVoucher) => {
    return useQuery({
        queryKey: ["/point/getMyVoucher", { page, row }],
        queryFn: () => getMyVoucher({ page, row }),
    });
};
