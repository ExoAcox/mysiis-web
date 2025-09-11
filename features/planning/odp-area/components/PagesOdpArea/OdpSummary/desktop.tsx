import Info from "@public/images/vector/info_transparent.svg";
import csvDownload from "json-to-csv-export";
import { useEffect, useState } from "react";
import { When } from "react-if";
import ReactTooltip from "react-tooltip";

import { fetchKabupaten, fetchProvinsi } from "@features/planning/odp-area/queries/summary_table";
import { useListKota, useListProvinsi, useOdpSummaryStore, useOdpUimValinsStore } from "@features/planning/odp-area/store";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { FloatingMenu } from "@components/layout";
import { Title } from "@components/text";

import { OdpSummaryProps } from ".";
import CardInfo from "../../CardInfo";
import dayjs from "dayjs";
import useOverlay from "@hooks/useOverlay";
import useModal from "@hooks/useModal";

interface ParamsOdpSummary {
    provinsi: string;
    kota: string;
}

export default function OdpSummary({ onResultClick }: OdpSummaryProps) {
    const odpSummaryStore = useOdpSummaryStore((state) => state.data);
    const odpUimValinsStore = useOdpUimValinsStore((state) => state.data);
    const [statusInfo, setStatusInfo] = useState(false);
    const { modal, setModal } = useModal('filter-card')

    const listProvinsiStore = useListProvinsi((state) => state.data);
    const listKotaStore = useListKota((state) => state.data);
    const [params, setParams] = useState<ParamsOdpSummary>({
        provinsi: "",
        kota: "",
    });

    useEffect(() => {
        fetchProvinsi();
    }, []);

    useEffect(() => {
        if (params.provinsi != "") fetchKabupaten(params.provinsi);
    }, [params.provinsi]);

    const handleBtn = () => {
        const latLng = listKotaStore.find((e) => e.label == params.kota);
        latLng?.latLng && onResultClick(latLng?.latLng);
    };

    useEffect(() => {
        if (odpSummaryStore._id != "") {
            setStatusInfo(true);
        } else {
            setStatusInfo(false);
        }
    }, [odpSummaryStore]);

    useEffect(() => {
        if (odpUimValinsStore[0]._id) {
            setModal(true)
        }
    }, [odpUimValinsStore]);

    const handleExport = () => {
        if (odpUimValinsStore.length > 0) {
            const dataToConvert = {
                data: odpUimValinsStore,
                filename: `Odp_Uim_Valins_summary_${odpUimValinsStore[0].provinsi}.csv`,
                delimiter: ",",
            };
            csvDownload(dataToConvert);
        }
    };

    return (
        <FloatingMenu>
            <CardInfo id="filter-card" title="Filter" className="z-10">
                <div>
                    <div className="mb-2">Provinsi</div>
                    <Dropdown
                        id="filter-odp-area-odp-summary"
                        placeholder="Pilih Provinsi"
                        value={params.provinsi}
                        options={listProvinsiStore}
                        onChange={(value) => {
                            setParams({ ...params, provinsi: value });
                        }}
                        className="w-full md:w-[70vw] overflow-hidden"
                    />
                </div>
                <div>
                    <div className="mb-2">Kabupaten</div>
                    <Dropdown
                        disabled={params.provinsi == ""}
                        id="filter-odp-area-odp-summary"
                        placeholder="Pilih Kabupaten"
                        value={params.kota}
                        options={listKotaStore}
                        onChange={(value) => {
                            setParams({ ...params, kota: value });
                        }}
                        className="w-full md:w-[70vw] overflow-hidden"
                    />
                </div>
                <Button onClick={() => handleBtn()} disabled={params.provinsi == "" && params.kota == ""} className="w-full">
                    Set Filter
                </Button>
            </CardInfo>
            <When condition={odpUimValinsStore[0]._id != ""}>
                <CardInfo id="info-card" title="Informasi">
                    <div>
                        <div className="w-full h-[34px] bg-[#2B2A3A] text-[16px] text-white font-medium flex items-center justify-center">0%</div>
                        <div className="w-full h-[34px] bg-[#652794] text-[16px] text-white font-medium flex items-center justify-center">
                            {`<`} 10%
                        </div>
                        <div className="w-full h-[34px] bg-[#863C84] text-[16px] text-white font-medium flex items-center justify-center">
                            11% {"<"} 40%
                        </div>
                        <div className="w-full h-[34px] bg-[#B14C79] text-[16px] text-white font-medium flex items-center justify-center">
                            41% {"<"} 70%
                        </div>
                        <div className="w-full h-[34px] bg-[#D86161] text-[16px] text-white font-medium flex items-center justify-center">
                            71% {"<"} 99%
                        </div>
                        <div className="w-full h-[34px] bg-[#F38840] text-[16px] text-white font-medium flex items-center justify-center gap-2 relative">
                            <span>100%</span>
                            <div className="cursor-pointer" data-tip="Keterisian port dari ODP Valins">
                                <Info />
                            </div>
                            <ReactTooltip />
                        </div>
                    </div>
                    <Button disabled={odpUimValinsStore.length <= 0} onClick={() => handleExport()} variant="ghost" className="w-full">
                        Export CSV
                    </Button>
                </CardInfo>
            </When>
            <When condition={statusInfo}>
                <div className="w-[334px] rounded-md shadow-md bg-white p-[16px] flex flex-col gap-[16px]">
                    <Title size="large" className="text-center">
                        Perbandingan :{" "}
                        {odpSummaryStore.odp_uim_count ? ((odpSummaryStore.odp_valins_count / odpSummaryStore.odp_uim_count) * 100).toFixed(2) : 0}%
                    </Title>
                    <div className="border-b-[0.5px] border-b-black-80 flex items-center justify-between text-sm pb-[18px]">
                        <div>ODP UIM: {odpSummaryStore.odp_uim_count}</div>
                        <div className="border-[0.8px] border-black h-full"></div>
                        <div>ODP Valins : {odpSummaryStore.odp_valins_count}</div>
                    </div>
                    <div className="text-[14px]">
                        <div className="flex">
                            <div className="w-full">Kelurahan</div>
                            <div className="flex-wrap w-full">: {odpSummaryStore.kelurahan}</div>
                        </div>
                        <div className="flex">
                            <div className="w-full">Kecamatan</div>
                            <div className="flex-wrap w-full">: {odpSummaryStore.kecamatan}</div>
                        </div>
                        <div className="flex">
                            <div className="w-full">Kota</div>
                            <div className="flex-wrap w-full">: {odpSummaryStore.kota}</div>
                        </div>
                        <div className="flex">
                            <div className="w-full">Provinsi</div>
                            <div className="flex-wrap w-full">: {odpSummaryStore.provinsi}</div>
                        </div>
                        <div className="flex">
                            <div className="w-full">Inservice Port</div>
                            <div className="flex-wrap w-full">: {odpSummaryStore?.odp_uim_portinservicenumber || 0}</div>
                        </div>
                        <div className="flex">
                            <div className="w-full">Reserved Port</div>
                            <div className="flex-wrap w-full">: {odpSummaryStore?.odp_uim_portreservednumber || 0}</div>
                        </div>
                        <div className="flex">
                            <div className="w-full">Unknown Port</div>
                            <div className="flex-wrap w-full">: {odpSummaryStore?.odp_uim_unknownportnumber || 0}</div>
                        </div>
                        <div className="flex">
                            <div className="w-full">Last Update</div>
                            <div className="flex-wrap w-full">: {dayjs(odpSummaryStore?.last_updated_at).format('YYYY-MM-DD') || 0}</div>
                        </div>
                    </div>
                </div>
            </When>
        </FloatingMenu>
    );
}
