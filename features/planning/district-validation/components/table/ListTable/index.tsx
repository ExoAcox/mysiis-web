import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { When } from "react-if";

import { MissingStreet, getNcxMiss } from "@api/district/metadata";

import FilterTable from "@features/planning/district-validation/components/table/FilterTable";

import { Spinner } from "@components/loader";
import { Link, Pagination, PaginationInfo } from "@components/navigation";
import { Table } from "@components/table";

interface Props {
    filter: MissingStreet;
    setFilter: Dispatch<SetStateAction<MissingStreet>>;
}

interface Lists {
    created_at: string;
    geom: string;
    id: number;
    lat: number;
    long: number;
    mysiis_kecamatan: string;
    mysiis_kelurahan: string;
    mysiis_kode_desa_dagri: string;
    mysiis_kota: string;
    mysiis_lat: string;
    mysiis_long: string;
    mysiis_provinsi: string;
    mysiis_st_name: string;
}

const inputStreet = { page: 1, row: 10, reson: "empty-street-mysiis" };

const ListTable = ({ filter, setFilter }: Props) => {
    const [list, setList] = useState<Lists[]>([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const fetchNcxMiss = () => {
        setLoading(true);
        setList([]);
        setTotalData(0);
        getNcxMiss(filter)
            .then((resolve) => {
                setList(resolve.lists);
                setTotalData(Number(resolve.filteredCount));
            })
            .catch(() => {
                return;
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchNcxMiss();
    }, [filter]);

    return (
        <div className="py-4">
            <div className="flex items-center justify-between my-4">
                <h1 className="font-extrabold">Daftar Missing Street Data</h1>
                <div className="flex justify-between">
                    <FilterTable filter={filter} setFilter={setFilter} />
                </div>
            </div>
            <When condition={isLoading === true}>
                <Spinner className="py-12" size={100} />
            </When>
            <When condition={isLoading === false}>
                <Table
                    rows={list}
                    columns={[
                        { header: "No", value: (_, index) => inputStreet.page * inputStreet.row - inputStreet.row + (index + 1) },
                        { header: "Kode Desa", value: (listData) => listData.mysiis_kode_desa_dagri || "-" },
                        { header: "Kelurahan", value: (listData) => listData.mysiis_kelurahan || "-" },
                        { header: "Kecamatan", value: (listData) => listData.mysiis_kecamatan || "-" },
                        { header: "Kota", value: (listData) => listData.mysiis_kota || "-" },
                        { header: "Provinsi", value: (listData) => listData.mysiis_provinsi || "-" },
                        { header: "Tanggal", value: (listData) => dayjs(listData.created_at).format("DD-MM-YYYY") || "-" },
                        { header: "Koordinat", value: (listData) => listData.mysiis_lat + ", " + listData.mysiis_long || "-" },
                        {
                            header: "Aksi",
                            value: (listData) => {
                                const link = new URLSearchParams({
                                    lat: `${Number(listData.mysiis_lat)}`,
                                    lng: `${Number(listData.mysiis_long)}`,
                                }).toString();

                                return (
                                    <Link href={`/planning/district-validation/maps-summary?${link}`} className="text-primary-40">
                                        Lihat Map
                                    </Link>
                                );
                            },
                        },
                    ]}
                />
            </When>
            <div className="flex items-center justify-between px-4 my-8">
                <PaginationInfo row={inputStreet.row} totalCount={totalData} page={inputStreet.page} />
                <Pagination
                    page={inputStreet.page}
                    row={inputStreet.row}
                    onChange={(e) => setFilter({ ...filter, page: e })}
                    totalCount={totalData}
                />
            </div>
        </div>
    );
};

export default ListTable;
