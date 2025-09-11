import dayjs from "dayjs";
import csvDownload from "json-to-csv-export";
import { useEffect, useMemo } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { When } from "react-if";

import { tw } from "@functions/style";

import ArrowDown from "@images/vector/arrow_down.svg";

import { districtSummaryInfoWindows, districtSummaryPolygons } from "@pages/planning/odp-area/district-summary";

import { Button } from "@components/button";
import { FloatingMenu } from "@components/layout";
import { Title } from "@components/text";

import { handleMode } from "../../queries/summary_penetration_odp_building";
import { useDistrictSummaryStore, useSummaryPenetrasiOdpBuildingStore } from "../../store";
import ListItem from "../ListItem";

interface InfoDistrictSummaryProps {
    isOpen: boolean;
    setOpen: (e: boolean) => void;
    mode: string;
    setMode: (e: string) => void;
}

export default function InfoDistrictSummary({ isOpen, setOpen, mode, setMode }: InfoDistrictSummaryProps) {
    const [summary, statusSummary] = useSummaryPenetrasiOdpBuildingStore((state) => [state.data, state.status]);
    const [infoSummary, statusInfoSummary] = useDistrictSummaryStore((state) => [state.data, state.status]);

    const arrowClassName = useMemo(() => {
        if (isOpen) {
            return "rotate-180 min-w-[.75rem]";
        } else {
            return "translate-y-[1px] min-w-[.75rem]";
        }
    }, [isOpen]);

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

    useEffect(() => {
        if (statusSummary === "resolve") {
            setOpen(true);
        } else if (statusSummary === "reject") {
            // Add the operation you want to perform here
        }
    }, [statusSummary]);

    return (
        <>
            <When condition={statusSummary == "resolve"}>
                <FloatingMenu className="w-[334px]">
                    <div className="p-[16px] bg-white rounded-lg">
                        <button
                            className="flex items-center justify-between h-[20px] p-0 bg-transparent w-full"
                            onClick={() => statusSummary == "resolve" && setOpen(!isOpen)}
                        >
                            <Title size="large">Informasi Port Penetration</Title>
                            <ArrowDown className={arrowClassName} />
                        </button>
                        <When condition={isOpen && statusSummary == "resolve"}>
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
                                <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2D5877]">
                                    0%
                                </div>
                                <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2D7AB2]">
                                    {"<"} 10%
                                </div>
                                <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2DA2B2]">
                                    11% {"<"} 40%
                                </div>
                                <div className="w-full h-[34px] flex items-center justify-center text-white text-[16px] font-bold bg-[#2DB262]">
                                    41% {"<"} 70%
                                </div>
                                <div className="w-full h-[34px] flex items-center justify-center text-[16px] font-bold bg-[#D8CC61]">
                                    101% {"<"} 150%
                                </div>
                                <div className="w-full h-[34px] flex items-center justify-center text-[16px] font-bold bg-[#F3EB9C]">{">"} 150%</div>
                            </section>
                            <div className="mt-[22px] mb-[18px] text-[12px] text-center">
                                Semakin tinggi persentase port maka jumlah pelanggan semakin melebihi jumlah building
                            </div>
                            <Button onClick={() => handleExport()} variant="ghost" className="w-full">
                                Export CSV
                            </Button>
                        </When>
                    </div>
                    <When condition={isOpen && statusInfoSummary == "resolve"}>
                        <div className="p-[16px] bg-white rounded-lg">
                            <ListItem
                                parentClassName="text-[16px]"
                                titleClassname="font-bold"
                                subtitleClassName="font-bold"
                                title={`Port ${mode == "penetration" ? "Penetration" : "Readiness"}`}
                                subTitle={
                                    mode == "penetration"
                                        ? (
                                              ((infoSummary.odp_deviceportnumber - infoSummary.odp_portidlenumber) / infoSummary.building_count) *
                                              100
                                          ).toFixed(2)
                                        : infoSummary.building_count
                                        ? infoSummary.penetrasi_percent.toFixed(2)
                                        : 0
                                }
                            />
                            <div className="mt-3">
                                <ListItem title="Building Count" subTitle={infoSummary.building_count} />
                                <ListItem title="Device Port" subTitle={infoSummary.odp_deviceportnumber} />
                                <ListItem title="Idle Port" subTitle={infoSummary.odp_portidlenumber} />
                                <ListItem title="Used Port" subTitle={infoSummary.odp_deviceportnumber - infoSummary.odp_portidlenumber} />
                                <ListItem title="ODP Count" subTitle={infoSummary.odp_count} />
                                <ListItem title="Last Update" subTitle={dayjs(infoSummary.last_updated_at).format("YYYY-MM-DD")} />
                            </div>
                            <div className="mt-3">
                                <ListItem title="Kelurahan" subTitle={infoSummary.kelurahan} />
                                <ListItem title="Kecamatan" subTitle={infoSummary.kecamatan} />
                                <ListItem title="Kota" subTitle={infoSummary.kota} />
                                <ListItem title="Provinsi" subTitle={infoSummary.provinsi} />
                            </div>
                        </div>
                    </When>
                </FloatingMenu>
            </When>
            <When condition={statusSummary == "reject"}>
                <FloatingMenu className="w-[334px]">
                    <div className="p-[16px] bg-white rounded-lg flex items-center gap-2">
                        <IoAlertCircleOutline className="text-2xl text-primary-40" />
                        <Title className="text-[14px] font-medium">Terjadi kesalahan saat mengambil data</Title>
                    </div>
                </FloatingMenu>
            </When>
        </>
    );
}
