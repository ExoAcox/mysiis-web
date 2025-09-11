import csvDownload from "json-to-csv-export";
import { useState } from "react";
import { Else, If, Then, When } from "react-if";

import { tw } from "@functions/style";

import EmptyState from "@images/bitmap/empty_state.png";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Image } from "@components/layout";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Table } from "@components/table";
import { Subtitle, Title } from "@components/text";

import { formatDataList, sortingOption } from "../../Functions";
import { useSummaryTable } from "../../store";

export default function TableDistrictSummary({ device }: { device?: Device }) {
    const [listData, setList, statusData] = useSummaryTable((state) => [state.data, state.set, state.status]);
    const [page, setPage] = useState(1);
    const [sortKecamatan, setSortKecamatan] = useState("kecamatan");
    const [detailCard, setDetailCard] = useState("hidden");

    const handleSort = (option: string) => {
        if (statusData == "resolve") {
            setSortKecamatan(option);
            switch (option) {
                case "kecamatan":
                    setList(listData.sort((a, b) => a.kecamatan?.localeCompare(b.kecamatan)));
                    break;
                case "kelurahan":
                    setList(listData.sort((a, b) => a.kelurahan?.localeCompare(b.kelurahan)));
                    break;
                case "building":
                    setList(listData.sort((a, b) => b.building_count - a.building_count));
                    break;
                case "odp":
                    setList(listData.sort((a, b) => b.odp_count - a.odp_count));
                    break;
                case "deviceport":
                    setList(listData.sort((a, b) => b.odp_deviceportnumber - a.odp_deviceportnumber));
                    break;
                case "usedport":
                    setList(listData.sort((a, b) => b.odp_deviceportnumber - b.odp_portidlenumber - (a.odp_deviceportnumber - a.odp_portidlenumber)));
                    break;
                case "portidle":
                    setList(listData.sort((a, b) => b.odp_portidlenumber - a.odp_portidlenumber));
                    break;
                case "penetration":
                    setList(
                        listData.sort((a, b) => {
                            const value_b = b.building_count
                                ? parseFloat((((b.odp_deviceportnumber - b.odp_portidlenumber) / b.building_count) * 100).toFixed(2))
                                : 0;
                            const value_a: number = a.building_count
                                ? parseFloat((((a.odp_deviceportnumber - a.odp_portidlenumber) / a.building_count) * 100).toFixed(2))
                                : 0;

                            return value_b - value_a;
                        })
                    );
                    break;
                case "readiness":
                    setList(listData.sort((a, b) => b.penetrasi_percent - a.penetrasi_percent));
                    break;
                default:
                    break;
            }
        }
    };

    const handleExport = () => {
        if (statusData == "resolve") {
            const dataToConvert = {
                data: listData,
                filename: `Odp_Uim_Valins_summary_${listData[0].provinsi}.csv`,
                delimiter: ",",
            };
            csvDownload(dataToConvert);
        }
    };

    return (
        <div className="mt-[24px]">
            <When condition={statusData == "resolve"}>
                <div className="flex gap-3 mb-5">
                    <Dropdown
                        disabled={listData.length == 0}
                        parentClassName={device == "mobile" ? "w-full" : ""}
                        className="text-[13px]"
                        id="dropdown-table-district-summary"
                        value={sortKecamatan}
                        options={sortingOption}
                        onChange={(e) => handleSort(e)}
                    />
                    <Button disabled={listData.length == 0} onClick={() => handleExport()} className="h-[48px] text-[13px]" variant="ghost">
                        Export CSV
                    </Button>
                </div>
            </When>
            <If condition={device == "mobile"}>
                <Then>
                    {listData.length > 0 || statusData == "resolve" ? (
                        formatDataList(listData)
                            .filter((_, index) => (page - 1) * 10 <= index && page * 10 > index)
                            .map((data, index) => {
                                return (
                                    <div
                                        key={`${index.toString()}`}
                                        className="border border-gray-200 rounded-md overflow-hidden text-[13px] mb-5 px-3 py-2 flex flex-col gap-1"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-[40%] font-bold">Last Update</div>
                                            <div> : {data.last_updated_at}</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-[40%] font-bold">Kecamatan</div>
                                            <div> : {data.kecamatan}</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-[40%] font-bold">Kelurahan</div>
                                            <div> : {data.kelurahan}</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-[40%] font-bold">Building</div>
                                            <div> : {data.building}</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-[40%] font-bold">ODP Count</div>
                                            <div> : {data.odp_count}</div>
                                        </div>
                                        <div className={detailCard}>
                                            <div className="flex items-center">
                                                <div className="w-[40%] font-bold">Device Port</div>
                                                <div> : {data.device_port}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-[40%] font-bold">Used Port</div>
                                                <div> : {data.used_port}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-[40%] font-bold">Idle Port</div>
                                                <div> : {data.idle_port}</div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setDetailCard((e) => (e == "hidden" ? "none" : "hidden"))}
                                            variant="nude"
                                            className="p-0 m-0"
                                        >
                                            {detailCard == "hidden" ? "Lihat semua" : " Sembunyikan"}
                                        </Button>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="py-8 text-center">
                            <Image src={EmptyState} width={288} />
                            <Title className="mt-4 mb-2">Data ODP Tidak Ditemukan</Title>
                            <Subtitle size="subtitle" className="text-black-80">
                                Silahkan pilih Provinsi dan Kabupaten
                            </Subtitle>
                        </div>
                    )}
                </Then>
                <Else>
                    <Table
                        parentClassName="mt-4"
                        className={`shadow-md`}
                        rows={listData.length > 0 ? formatDataList(listData).filter((_, index) => (page - 1) * 10 <= index && page * 10 > index) : []}
                        columns={[
                            {
                                header: "No",
                                value: (_, index) => (page - 1) * 10 + index + 1,
                                className: "text-right",
                                headerClassName: "text-right",
                            },
                            { header: "Last Update", value: (data) => data.last_updated_at },
                            { header: "Port Penetration", value: (data) => data.port_penetration },
                            { header: "Port Readiness", value: (data) => data.port_readiness },
                            { header: "Kecamatan", value: (data) => data.kecamatan },
                            { header: "Kelurahan", value: (data) => data.kelurahan },
                            { header: "Building", value: (data) => data.building },
                            { header: "ODP Count", value: (data) => data.odp_count },
                            { header: "Device Port", value: (data) => data.device_port },
                            { header: "Used Port", value: (data) => data.used_port },
                            { header: "Idle Port", value: (data) => data.idle_port },
                        ]}
                        notFoundComponent={
                            <div className="py-8 text-center">
                                <Image src={EmptyState} width={288} />
                                <Title className="mt-4 mb-2">Data ODP Tidak Ditemukan</Title>
                                <Subtitle size="subtitle" className="text-black-80">
                                    Silahkan pilih Provinsi dan Kabupaten
                                </Subtitle>
                            </div>
                        }
                    />
                </Else>
            </If>

            <When condition={listData.length > 0}>
                <div className={tw("flex justify-between items-center w-full mt-7", device == "mobile" ? "flex-col gap-5" : "")}>
                    <PaginationInfo page={page} totalCount={listData.length} row={10} />
                    <Pagination page={page} onChange={(value) => setPage(value)} row={10} totalCount={listData.length} />
                </div>
            </When>
        </div>
    );
}
