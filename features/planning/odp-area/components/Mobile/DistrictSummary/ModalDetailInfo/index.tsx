import csvDownload from "json-to-csv-export";
import React from "react";
import { When } from "react-if";

import useModal from "@hooks/useModal";

import { tw } from "@functions/style";

import { districtSummaryInfoWindows, districtSummaryPolygons } from "@pages/planning/odp-area/district-summary";

import { handleMode } from "@features/planning/odp-area/queries/summary_penetration_odp_building";
import { useDistrictSummaryStore, useSummaryPenetrasiOdpBuildingStore } from "@features/planning/odp-area/store";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

import ListItem from "../../../ListItem";

const ModalDetailInfo = ({ mode, setMode }: { mode: string; setMode: (e: string) => void }) => {
    const { modal, setModal } = useModal("modal-detail-info");
    const [summary, statusSummary] = useSummaryPenetrasiOdpBuildingStore((state) => [state.data, state.status]);
    const [infoSummary, statusInfoSummary] = useDistrictSummaryStore((state) => [state.data, state.status]);

    const handleBtnMode = (value: string) => {
        setMode(value);
        handleMode(value);
        districtSummaryInfoWindows.forEach((x) => x?.setMap && x.setMap(null));
        districtSummaryPolygons.forEach((x) => x?.setOptions && x.setOptions({ strokeColor: "#ff4400", zIndex: 1 }));
        useDistrictSummaryStore.setState({ status: "idle" });
    };

    const handleExport = () => {
        if (summary.length > 0) {
            const dataToConvert = {
                data: summary,
                filename: `District_summary_${summary[0].provinsi}.csv`,
                delimiter: ",",
            };
            csvDownload(dataToConvert);
        }
    };

    return (
        <Modal visible={modal}>
            <ModalTitle onClose={() => setModal(false)}>Informasi Port Penetrasi</ModalTitle>
            <div className="p-[16px] bg-white rounded-lg">
                <When condition={statusSummary == "resolve"}>
                    <section id="mode-district-summary" data-mode={mode} className="flex mt-4 h-[35px] rounded-lg overflow-hidden font-bold">
                        <button
                            onClick={() => handleBtnMode("penetration")}
                            className={tw(
                                " text-white w-full",
                                mode == "penetration" ? "bg-primary-40 text-white" : "bg-secondary-20 text-secondary-50"
                            )}
                        >
                            Penetrasi
                        </button>
                        <button
                            onClick={() => handleBtnMode("readiness")}
                            className={tw(" w-full", mode == "readiness" ? "bg-primary-40 text-white" : "bg-secondary-20 text-secondary-50")}
                        >
                            Readiness
                        </button>
                    </section>
                    <section className="mt-[18px]">
                        <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2D5877]">0%</div>
                        <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2D7AB2]">
                            {"<"} 10%
                        </div>
                        <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2DA2B2]">
                            11% {"<"} 40%
                        </div>
                        <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2DB262]">
                            41% {"<"} 70%
                        </div>
                        <div className="w-full h-[34px] flex items-center justify-center text-[16px] font-bold bg-[#D8CC61]">101% {"<"} 150%</div>
                        <div className="w-full h-[34px] flex items-center justify-center text-[16px] font-bold bg-[#F3EB9C]">{">"} 150%</div>
                    </section>
                    <div className="mt-[22px] mb-[18px] text-[12px] text-center">
                        Semakin tinggi persentase port maka jumlah pelanggan semakin melebihi jumlah building
                    </div>
                    <Button onClick={() => handleExport()} variant="ghost" className="w-full">
                        Export CSV
                    </Button>
                </When>
                <When condition={statusInfoSummary == "resolve"}>
                    <div className="p-[16px] bg-white rounded-lg text-[13px]">
                        <ListItem
                            parentClassName="text-[13px]"
                            titleClassname="font-bold"
                            subtitleClassName="font-bold"
                            title={`Port ${mode == "penetration" ? "Penetration" : "Readiness"}`}
                            subTitle={
                                mode == "penetration"
                                    ? (
                                          ((infoSummary.odp_deviceportnumber - infoSummary.odp_portidlenumber) / infoSummary.building_count) *
                                          100
                                      ).toFixed(2) + "%"
                                    : infoSummary.building_count
                                    ? infoSummary.penetrasi_percent.toFixed(2) + "%"
                                    : 0
                            }
                        />
                        <div className="mt-3">
                            <ListItem title="Building Count" subTitle={infoSummary.building_count} />
                            <ListItem title="Device Port" subTitle={infoSummary.odp_deviceportnumber} />
                            <ListItem title="Idle Port" subTitle={infoSummary.odp_portidlenumber} />
                            <ListItem title="Used Port" subTitle={infoSummary.odp_deviceportnumber - infoSummary.odp_portidlenumber} />
                            <ListItem title="ODP Count" subTitle={infoSummary.odp_count} />
                        </div>
                        <div className="mt-3">
                            <ListItem title="Kelurahan" subTitle={infoSummary.kelurahan} />
                            <ListItem title="Kecamatan" subTitle={infoSummary.kecamatan} />
                            <ListItem title="Kota" subTitle={infoSummary.kota} />
                            <ListItem title="Provinsi" subTitle={infoSummary.provinsi} />
                        </div>
                    </div>
                </When>
            </div>
        </Modal>
    );
};

export default ModalDetailInfo;
