import React from "react";
import { Else, If, Then } from "react-if";

import useModal from "@hooks/useModal";

import { tw } from "@functions/style";

import { isDecimal } from "@features/planning/dashboard-microdemand/functions/report";

import { Button } from "@components/button";
import { Spinner } from "@components/loader";
import { Title } from "@components/text";

interface Data {
    userId: string;
    name: string | undefined;
    witel: string | undefined;
    mitra: string | undefined;
    valid: string;
    validMitra: number;
    invalid: number;
    unvalidated: string;
    target: string | number;
    total: number;
    progress: string | number;
}

interface CardTableProps {
    rows: Data[];
    source: string;
    loading: boolean;
}

export default function CardTable({ rows = [], source, loading }: CardTableProps) {
    const { setData } = useModal("modal-detail-report");

    return (
        <div className={tw("rounded-md mt-4 sm:px-1 min-h-[200px]", !loading && "border-[0.7px] border-secondary-30")}>
            <If condition={loading}>
                <Then>
                    <Spinner size={60} />
                </Then>
                <Else>
                    <If condition={rows.length > 0}>
                        <Then>
                            {rows.map((item, index) => {
                                return (
                                    <div
                                        key={`${item.name}.${index.toString()}`}
                                        className="border-b-[0.7px] border-secondary-30 w-full pb-4 pt-4 pl-4 pr-4"
                                    >
                                        <div className="w-full">
                                            <div className="flex">
                                                <div className="w-1/2">
                                                    <b>{source == "surveyor" ? "Nama Surveyor" : "Polygon"}</b>
                                                </div>
                                                <div>:</div>
                                                <div className="w-1/2 ml-2">{item.name}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="w-1/2">
                                                    <b>Witel</b>
                                                </div>
                                                <div>:</div>
                                                <div className="w-1/2 ml-2">{item.witel}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="w-1/2">
                                                    <b>Total</b>
                                                </div>
                                                <div>:</div>
                                                <div className="w-1/2 ml-2">{item.total}</div>
                                            </div>
                                            {source == "polygon" && (
                                                <>
                                                    <div className="flex">
                                                        <div className="w-1/2">
                                                            <b>Target</b>
                                                        </div>
                                                        <div>:</div>
                                                        <div className="w-1/2 ml-2">{item.target}</div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="w-1/2">
                                                            <b>Progress</b>
                                                        </div>
                                                        <div>:</div>
                                                        <div className="w-1/2 ml-2">{isDecimal(item.progress as number) + "%"}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <Button onClick={() => setData({ ...item, source })} variant="nude" className="p-0 mt-3">
                                            Lihat Detail
                                        </Button>
                                    </div>
                                );
                            })}
                        </Then>
                        <Else>
                            <Title className="mt-20 text-center">Data Tidak ditemukan !</Title>
                        </Else>
                    </If>
                </Else>
            </If>
        </div>
    );
}
