import { useEffect, useRef, useState } from "react";
import { Unless, When } from "react-if";

import { GetCompetitorSummary, getCompetitorSummary, getRegionalCompetitor, getSummaryByRegional } from "@api/odp/competitor";

import { errorHelper } from "@functions/common";
import { tw } from "@functions/style";

import { BarChart } from "@features/planning/data-competitor/components/chart";
import { stateRegional } from "@features/planning/data-competitor/functions/chart";

import { TabButton } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Spinner } from "@components/loader";

export interface ListDataResponses {
    datasets: { backgroundColor: string; data: number[]; label: string; status?: boolean }[] | [];
    labels?: string[];
}

interface Props {
    user: User;
}

const MainChart = ({ user }: Props) => {
    const chartRef = useRef(null);

    const [valuesTab, setValuesTab] = useState("regional");
    const [listRegional, setListRegional] = useState<Option<string>[]>(stateRegional);
    const [isLoading, setLoading] = useState(false);
    const [input, setInput] = useState<GetCompetitorSummary>({ regional: null });
    const [listData, setListData] = useState<ListDataResponses | null>(null);
    const [legend, setLegend] = useState<ListDataResponses | null>(null);
    const [chart, setChart] = useState<ListDataResponses | null>(null);

    const fetchRegional = () => {
        getRegionalCompetitor()
            .then((result) => {
                setListRegional([...stateRegional, ...result.map((item) => ({ label: item.regional, value: item.regional }))]);
            })
            .catch((error) => {
                errorHelper(error);
            });
    };

    const fetchSummaryCompetitor = (source: "regional" | "witel") => {
        setLoading(true);
        setListData(null);

        const selectedSource = source === "witel" ? getCompetitorSummary(input) : getSummaryByRegional();
        selectedSource
            .then((result) => {
                const resultData = result.data;
                const formattedData = [
                    {
                        id: 1,
                        labelMatch: "Rekomendasi",
                        resultMatch: resultData.map((data) => data.wins),
                        color: "rgba(102, 201, 91, 1)",
                        regional: resultData.map((data) => data.regional),
                        status: true,
                    },
                    {
                        id: 2,
                        labelMatch: "Belum Rekomendasi",
                        resultMatch: resultData.map((data) => data.losses),
                        color: "rgba(248, 109, 96, 1)",
                        regional: resultData.map((data) => data.wins),
                        status: true,
                    },
                ];
                const data = {
                    labels: resultData.map((data) => (source === "witel" ? data.witel : data.regional)),
                    datasets: formattedData.map((data) => {
                        return {
                            label: data.labelMatch,
                            data: data.resultMatch,
                            backgroundColor: data.color,
                            status: data.status,
                        };
                    }),
                };
                setListData(data);
            })
            .catch((error) => {
                errorHelper(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!user.regional || user.regional === "National" || Array.isArray(user.regional)) {
            fetchRegional();
            setTimeout(() => {
                fetchSummaryCompetitor("regional");
            }, 1500);
        }

        if (user.regional && user.regional !== "National" && !Array.isArray(user.regional)) {
            setValuesTab("witel");
            setListRegional([{ label: user.regional, value: user.regional }]);
            setTimeout(() => {
                setInput({ ...input, regional: user.regional });
            }, 1500);
        }
    }, [user]);

    useEffect(() => {
        fetchSummaryCompetitor("witel");
    }, [input]);

    useEffect(() => {
        setChart(listData);
        setLegend(listData);
    }, [listData]);

    return (
        <div className="w-full h-full my-8">
            <div className="flex flex-col gap-8 overflow-auto">
                <div className="flex flex-wrap items-center justify-start gap-4">
                    <When condition={!user.regional || user.regional === "National" || Array.isArray(user.regional)}>
                        <TabButton
                            value={valuesTab}
                            onChange={(value) => {
                                setValuesTab(value);
                                if (value === "regional") fetchSummaryCompetitor("regional");
                                if (value === "witel") fetchSummaryCompetitor("witel");
                            }}
                            options={[
                                { label: "Regional", value: "regional" },
                                { label: "Witel", value: "witel" },
                            ]}
                            parentClassName="h-12 self-end md:flex-1"
                            className="w-32"
                        />
                    </When>
                    <When condition={valuesTab === "witel"}>
                        <Dropdown
                            id="filter-data-competitor-chart-regional"
                            placeholder="Pilih Regional"
                            value={input.regional || ""}
                            options={listRegional}
                            onChange={(value) => {
                                setInput({ ...input, regional: value ? value : null });
                            }}
                            parentClassName="md:flex-1"
                            className="w-full"
                            disabled={listRegional?.length === 1}
                        />
                    </When>
                </div>
                <When condition={isLoading}>
                    <div className="flex items-center justify-center mt-8 overflow-auto">
                        <Spinner size={"8rem"} />
                    </div>
                </When>
                <Unless condition={isLoading}>
                    <div className="flex flex-col items-center justify-center gap-8 px-4 py-8 border border-secondary-30 rounded-2xl overflow-hidden">
                        <div className="flex flex-col gap-2 w-full h-fit pb-4 overflow-auto md:scrollbar-hidden">
                            <div className={tw("w-full h-[40vh] md:w-[250%]", valuesTab === "witel" && !input?.regional && "md:w-[500%]")}>
                                <BarChart listData={chart!} chartRef={chartRef} />
                            </div>
                        </div>
                        <When condition={!!listData}>
                            <When condition={legend?.datasets?.length}>
                                <div className="flex items-center justify-center gap-4 w-full pb-4 overflow-auto md:scrollbar-hidden sm:justify-start">
                                    {legend?.datasets?.map((item, index) => {
                                        return (
                                            <div
                                                onClick={() => {
                                                    const newData = [...legend.datasets];
                                                    newData[index].status = !newData[index].status;
                                                    setLegend({ ...legend, datasets: newData });
                                                    const dataFilter = newData.filter((e) => e.status);
                                                    setChart({ ...chart, datasets: dataFilter });
                                                }}
                                                key={`${index.toString()}`}
                                                className="flex items-center justify-center gap-2 p-2 text-sm border border-solid cursor-pointer rounded-2xl text-black-100"
                                                style={{
                                                    borderColor: item?.status ? item?.backgroundColor : "#E2E2E2",
                                                    color: item?.status ? "inherit" : "#808285",
                                                }}
                                            >
                                                <div
                                                    className="w-5 h-5 rounded-full shrink-0"
                                                    style={{
                                                        backgroundColor: item?.status ? item?.backgroundColor : "gray",
                                                    }}
                                                />
                                                <span className="whitespace-nowrap">{item?.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </When>
                        </When>
                    </div>
                </Unless>
            </div>
        </div>
    );
};

export default MainChart;
