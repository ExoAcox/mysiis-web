import { useEffect, useState } from "react";
import { When } from "react-if";

import { tw } from "@functions/style";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";

import { fetchKabupaten, fetchProvinsi } from "../../queries/summary_table";
import { useListKota, useListProvinsi } from "../../store";

interface ParamsDataSummary {
    provinsi: string;
    kota: string;
}

interface FilterDistrictSummaryProps {
    onResultClick: (latLng: LatLng) => void;
    device?: Device;
}

export default function FilterDistrictSummary({ onResultClick, device }: FilterDistrictSummaryProps) {
    const listProvinsi = useListProvinsi((state) => state.data);
    const listKota = useListKota((state) => state.data);
    const [params, setParams] = useState<ParamsDataSummary>({
        provinsi: "",
        kota: "",
    });

    useEffect(() => {
        fetchProvinsi();
    }, []);

    useEffect(() => {
        if (params.provinsi != "") {
            fetchKabupaten(params.provinsi);
        }
    }, [params.provinsi]);

    const handleBtn = () => {
        const latLng = listKota.find((e) => e.value == params.kota)?.latLng;
        latLng && onResultClick(latLng);
    };

    useEffect(() => {
        if (device == "mobile") handleBtn();
    }, [params.kota]);

    return (
        <div className={tw("my-[24px] bg-[#F9F9FA] flex p-[12px] justify-between gap-[24px] items-end")}>
            <Dropdown
                id="filter-ditrict-summary-provinsi"
                label="Provinsi"
                placeholder="Pilih Provinsi"
                value={params.provinsi}
                options={listProvinsi}
                onChange={(e: string) => setParams({ ...params, provinsi: e })}
                parentClassName="w-full"
                className={tw("h-[45px] text-[14px] w-full overflow-hidden", device == "mobile" && "w-[130px] text-[12px]")}
                position="bottom left"
            />
            <Dropdown
                disabled={params.provinsi == ""}
                id="filter-ditrict-summary-provinsi"
                label="Kabupaten"
                placeholder="Pilih Kabupaten"
                value={params.kota}
                options={listKota}
                onChange={(e: string) => {
                    setParams({ ...params, kota: e });
                }}
                parentClassName="w-full"
                className={tw("h-[45px] text-[14px] w-full overflow-hidden", device == "mobile" && "w-[130px] text-[12px] gap-0")}
                position="bottom right"
            />
            <When condition={device != "mobile"}>
                <Button
                    // disabled={params.kota == ''}
                    onClick={() => handleBtn()}
                    className="h-[45px] w-[250px] px-[12px] py-[16px] m-0 text-[14px] font-bold"
                >
                    Kirim
                </Button>
            </When>
        </div>
    );
}
