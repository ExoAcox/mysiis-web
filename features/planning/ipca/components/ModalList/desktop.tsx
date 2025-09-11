import React, { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { MdSearch } from "react-icons/md";
import { parseFromWK } from "wkt-parser-helper";

import { Ipca } from "@api/addons/ipca";

import useModal from "@hooks/useModal";

import { googleMapsIpca } from "@pages/planning/ipca";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";
import { Modal } from "@components/layout";
import { Pagination } from "@components/navigation";
import { Table } from "@components/table";
import { ModalTitle, Subtitle, Title } from "@components/text";

import { fetchOdpUimIpca } from "../../queries/odpAddons";
import { useIpcaStore } from "../../store/cummon";

const Desktop = () => {
    const { modal, setModal } = useModal("modal-list-ipca");
    const [data] = useIpcaStore((state) => [state.data]);
    const [page, setPage] = useState(1);
    const [dataFilter, setDataFilter] = useState(data);
    const [filter, setFilter] = useState({
        segment: "all",
        search: "",
    });

    function area(poly: any) {
        let s = 0.0;
        const ring = poly.coordinates[0];
        for (let i = 0; i < ring.length - 1; i++) {
            s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
        }
        return 0.5 * s;
    }

    function centroid(poly: any): LatLng {
        const c = [0, 0];
        const ring = poly.coordinates[0];
        for (let i = 0; i < ring.length - 1; i++) {
            c[0] += (ring[i][0] + ring[i + 1][0]) * (ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]);
            c[1] += (ring[i][1] + ring[i + 1][1]) * (ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]);
        }
        const a = area(poly);
        c[0] /= a * 6;
        c[1] /= a * 6;
        return { lat: c[1], lng: c[0] };
    }

    const handleBtn = (cluster: Ipca) => {
        const geo = parseFromWK(cluster.geom!);
        googleMapsIpca.setCenter(centroid(geo));
        if (googleMapsIpca.getZoom()! < 18) googleMapsIpca.setZoom(18);
        setModal(false);
        fetchOdpUimIpca(cluster);
    };

    const handleFilterSegment = (segment: string) => {
        const findDataFilter = segment == "all" ? data : data.filter((e) => e.nama_segment == segment);
        setDataFilter(findDataFilter);
    };

    const handleKeyDown = (e: string) => {
        const dataCluster = data.filter((e) => e.cluster_id.toString() == filter.search);
        if (e == "Enter") {
            setDataFilter(dataCluster);
            setPage(1);
        } else if ((e == "Backspace" || e == "Delete") && filter.search.length <= 3) {
            setDataFilter(data);
            setPage(1);
        }
        setFilter({ ...filter, segment: "all" });
    };

    useEffect(() => {
        setDataFilter(data);
    }, [data]);

    return (
        <Modal
            onClose={() => {
                setDataFilter(data);
                setFilter({
                    segment: "all",
                    search: "",
                });
            }}
            className="min-w-[55rem]"
            visible={modal}
        >
            <ModalTitle onClose={() => setModal(false)}>List Item</ModalTitle>
            <div className="flex gap-3">
                <TextField
                    value={filter.search}
                    onChange={(value) => {
                        setFilter({ ...filter, search: value });
                    }}
                    placeholder="Masukkan cluster id yang Anda cari ..."
                    parentClassName="py-4 w-full"
                    prefix={<MdSearch size="1.25rem" />}
                    onkeyDown={(e) => handleKeyDown(e)}
                />
                <Dropdown
                    parentClassName="py-4"
                    id="filter-segment-ipca"
                    options={[
                        {
                            label: "Semua Segment",
                            value: "all",
                        },
                        {
                            label: "Apartment",
                            value: "Apartment",
                        },
                        {
                            label: "Premium Cluster",
                            value: "Premium Cluster",
                        },
                    ]}
                    value={filter.segment}
                    onChange={(e) => {
                        setFilter({ ...filter, segment: e });
                        handleFilterSegment(e);
                    }}
                />
            </div>
            <Table
                rows={dataFilter.filter((_, index) => (page - 1) * 10 <= index && page * 10 > index)}
                bodyClassName="py-2"
                parentClassName="shadow rounded-2xl"
                hideHeader={!dataFilter.length}
                notFoundComponent={
                    <div className="py-8 text-center">
                        <div className="bg-primary-20 w-[18rem] h-[12.5rem] rounded-lg mx-auto" />
                        <Title className="mt-4 mb-2">Data Tidak Ditemukan</Title>
                        <Subtitle size="subtitle" className="text-black-80">
                            Mohon cek keyword yang Anda masukkan dan coba lagi
                        </Subtitle>
                    </div>
                }
                columns={[
                    {
                        header: "No",
                        value: (_, index) => (page - 1) * 10 + index + 1,
                        className: "text-center",
                        headerClassName: "text-center",
                    },
                    {
                        header: "Cluster ID",
                        value: (value) => value.cluster_id,
                        className: "text-left",
                        headerClassName: "text-left",
                    },
                    {
                        header: "ID Project",
                        value: (value) => value.id_project,
                        className: "text-left",
                        headerClassName: "text-left",
                    },
                    {
                        header: "Nama Segment",
                        value: (value) => value.nama_segment,
                        className: "text-left",
                        headerClassName: "text-left",
                    },
                    {
                        header: "Potensi",
                        value: (value) => value.potensi_hh,
                        className: "text-left",
                        headerClassName: "text-left",
                    },
                    {
                        header: "Status Prioritas",
                        value: (value) => value.status_priority,
                        className: "text-left",
                        headerClassName: "text-left",
                    },
                    {
                        header: null,
                        value: (value) => (
                            <Button className="py-1.5 mx-auto" onClick={() => handleBtn(value)}>
                                <HiLocationMarker className="-translate-y-[1px]" />
                                <span>Lihat di Maps</span>
                            </Button>
                        ),
                    },
                ]}
            />
            <Pagination className="mx-auto mb-3 mt-7" page={page} onChange={(value) => setPage(value)} row={10} totalCount={dataFilter.length} />
        </Modal>
    );
};

export default Desktop;
