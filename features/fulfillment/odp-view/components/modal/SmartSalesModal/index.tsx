import React, { useState } from "react";
import { Else, If, Then } from "react-if";

import { SmartSales } from "@api/odp/smartsales";

import useModal from "@hooks/useModal";

import { useKelurahanStore } from "@features/fulfillment/odp-view/store";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

const SmartSalesModal = () => {
    const kelurahan = useKelurahanStore((store) => store.data.kelurahan);
    const [isShowAll, setShowAll] = useState(false);
    const { modal, setModal, data } = useModal<SmartSales>("odp-view/smartsales");

    return (
        <Modal
            visible={modal}
            className="px-0 overflow-auto"
            onClose={() => {
                setShowAll(false);
            }}
        >
            <div className="sticky top-0 left-0 px-4">
                <ModalTitle onClose={() => setModal(false)}>Detail Smart Sales</ModalTitle>
            </div>
            <div className="px-4 w-fit">
                <div className="mt-4">
                    <List isOpen={isShowAll} label="Grid ID">
                        {data.grid_id}
                    </List>
                    <List isOpen={isShowAll} label="Last Updated">
                        {data.last_updated}
                    </List>
                    <List isOpen={isShowAll} label="Kode Desa">
                        {data.kode_desa || "-"}
                    </List>
                    <List isOpen={isShowAll} label="Nama Kelurahan">
                        {kelurahan}
                    </List>
                    <List isOpen={isShowAll} label="Jumlah KK Kelurahan">
                        {data.jumlah_kk_kelurahan}
                    </List>
                    <List isOpen={isShowAll} label="Jumlah KTP Kelurahan">
                        {data.jumlah_ktp_kelurahan}
                    </List>
                    <List isOpen={isShowAll} label="Jumlah Populasi OSM">
                        {data.jml_populasi_osm}
                    </List>
                    <List isOpen={isShowAll} label="Jumlah ARPU">
                        {data.total_arpu ?? 0}
                    </List>
                    <List isOpen={isShowAll} label="Jumlah Penduduk">
                        {data.jumlah_penduduk_kelurahan}
                    </List>
                </div>
                <If condition={!isShowAll}>
                    <Then>
                        <Button variant="ghost" onClick={() => setShowAll(true)} className="w-full mt-8">
                            Lihat Selengkapnya
                        </Button>
                    </Then>
                    <Else>
                        <div className="mb-4">
                            <List isOpen={isShowAll} label="Jumlah Pelanggan IndiHome">
                                {data.jml_cust_indihome ?? 0}
                            </List>
                            <List isOpen={isShowAll} label="Jumlah Pelanggan HVC">
                                {data.jml_plg_hvc ?? 0}
                            </List>
                            <List isOpen={isShowAll} label="Jumlah CHURN">
                                {data.jml_churn ?? 0}
                            </List>
                            <List isOpen={isShowAll} label="Jumlah CT0 Total">
                                {data.jml_ct0_total}
                            </List>
                            <List isOpen={isShowAll} label="Average ARPU">
                                {data.avg_arpu ? parseFloat(data.avg_arpu) : 0}
                            </List>
                            <List isOpen={isShowAll} label="Jumlah Microdemand">
                                {data.jml_mdemand}
                            </List>
                            <List isOpen={isShowAll} label="Jumlah Demand (prediksi)">
                                {data.jml_demand_prediksi}
                            </List>
                            <List isOpen={isShowAll} label="Jumlah ODP">
                                {data.jml_odp}
                            </List>
                            <List isOpen={isShowAll} label="Jumlah Port Idle">
                                {data.portidlenumber}
                            </List>
                        </div>
                    </Else>
                </If>
            </div>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string; isOpen: boolean }> = ({ children, label, isOpen }) => {
    return (
        <div className="flex gap-4 text-medium text-black-90">
            <span className={isOpen ? "min-w-[11.25rem]" : "min-w-[9.25rem]"}>{label}</span>
            <span>:</span>
            <span className="font-bold">{children}</span>
        </div>
    );
};

export default SmartSalesModal;
