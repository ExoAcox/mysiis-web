import React, { useState } from "react";
import { Else, If, Then } from "react-if";

import { Ipca } from "@api/addons/ipca";

import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

const ClusterModal = () => {
    const [isShowAll, setShowAll] = useState(false);
    const { modal, setModal, data } = useModal<Ipca>("odp-view/cluster");

    return (
        <Modal
            visible={modal}
            onClose={() => {
                setShowAll(false);
            }}
        >
            <ModalTitle onClose={() => setModal(false)}>Detail Cluster</ModalTitle>
            <div className="mt-4">
                <List label="Cluster ID">{data.cluster_id}</List>
                <List label="Nama Cluster">{data.nama_lop}</List>
                <List label="Nama Segment">{data.nama_segment}</List>
                <List label="Jumlah Huni">{data.jumlah_huni}</List>
                <List label="Potensi HH">{data.potensi_hh}</List>
                <List label="Status Priority">{data.status_priority}</List>
            </div>
            <If condition={!isShowAll}>
                <Then>
                    <Button variant="ghost" onClick={() => setShowAll(true)} className="w-full mt-8">
                        Lihat Selengkapnya
                    </Button>
                </Then>
                <Else>
                    <List label="Regional">{data.regional}</List>
                    <List label="Witel">{data.witel}</List>
                    <List label="Provinsi">{data.provinsi}</List>
                    <List label="Kota">{data.kabupaten}</List>
                    <List label="Kelurahan">{data.kelurahan}</List>
                    <List label="Kecamatan">{data.kecamatan}</List>
                </Else>
            </If>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-4 text-medium text-black-90">
            <span className="min-w-[6.5rem]">{label}</span>
            <span>:</span>
            <span className="font-bold">{children}</span>
        </div>
    );
};

export default ClusterModal;
