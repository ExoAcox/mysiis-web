import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { When } from "react-if";

import { Respondent } from "@api/survey-demand/respondent";

import useModal from "@hooks/useModal";

import { titleCase } from "@functions/common";

import EmptyState from "@images/bitmap/empty_state.png";
import Maps from "@images/vector/maps.svg";

import { googleMaps, markerDemands } from "@pages/planning/data-demand/maps-summary";

import { DataRespondentMapsModalType } from "@features/planning/data-demand/components/maps/InformationCard";
import { useDataRespondentStore } from "@features/planning/data-demand/store/maps";

import { Button } from "@components/button";
import { TextField } from "@components/input";
import { Image, Modal } from "@components/layout";
import { Pagination, PaginationInfo } from "@components/navigation";
import { ModalTitle, Subtitle, Title } from "@components/text";

const DataRespondentMapsModal = (): JSX.Element => {
    const [respondents, setRespondents] = useState<Respondent[]>([]);
    const [filteredRespondents, setFilteredRespondents] = useState<Respondent[]>([]);
    const [page, setPage] = useState(1);
    const [input, setInput] = useState("");

    const dataRespondentStore = useDataRespondentStore();

    const { modal, setModal, data } = useModal<DataRespondentMapsModalType>("data-respondent-maps-modal");

    const viewMaps = (id: number) => {
        markerDemands.forEach((marker) => marker.setOpacity(0));

        const marker = markerDemands.find((marker) => marker.get("data").id === id);
        if (!marker) return;

        googleMaps.panTo(marker.getPosition()!);
        if (googleMaps.getZoom()! < 18) googleMaps.setZoom(18);

        marker.setOpacity(1);

        markerDemands.forEach((marker) => marker.get("infoWindow").close());
        marker.get("infoWindow").open(googleMaps, marker);

        marker.addListener("click", async () => {
            markerDemands.forEach((marker) => marker.get("infoWindow").close());
            marker.get("infoWindow").open(googleMaps, marker);
        });

        setModal(false);
    };

    const onClose = () => {
        setModal(false);
        setRespondents([]);
        setPage(1);
        setInput("");
    };

    useEffect(() => {
        if (!modal) return;
        setRespondents(dataRespondentStore.data[data?.dataNumber]);
    }, [modal]);

    useEffect(() => {
        setPage(1);
        setFilteredRespondents(respondents.filter((respondent) => respondent.name?.toLowerCase().includes(input.toLowerCase())));
    }, [respondents, input]);

    return (
        <Modal visible={modal} className="w-fit">
            <ModalTitle onClose={() => onClose()} closeClassName="shrink-0">
                {data?.label && `Skala ${titleCase(data?.label)}: Terdapat ${data?.totalData} Responden`}
            </ModalTitle>
            <TextField
                value={input}
                onChange={(value) => setInput(value)}
                placeholder="Masukkan Nama yang Anda cari"
                parentClassName="py-4"
                suffix={<MdSearch size="1.25rem" />}
            />
            <Subtitle className="text-lg font-semibold text-black-100">Detail Responden</Subtitle>
            <div className="flex flex-col items-center justify-start gap-4 mt-4 w-full max-h-[40vh] overflow-auto">
                <When condition={!filteredRespondents.length}>
                    <NotFoundComponent input={input} />
                </When>
                <When condition={filteredRespondents.length}>
                    {filteredRespondents
                        ?.filter((_, index) => (page - 1) * 10 <= index && page * 10 > index)
                        .map((respondent) => (
                            <div key={respondent.id} className="flex flex-col justify-start w-full gap-2 p-6 border rounded border-secondary-30">
                                <List label="ID">{respondent?.id || "-"}</List>
                                <List label="Nama">{respondent?.name}</List>
                                <List label="No HP">{respondent?.phone || "-"}</List>
                                <List label="Alamat">{respondent?.address || "-"}</List>
                                <List label="Status Rumah">{respondent?.conf_kepemilikan_rumah_value || "-"}</List>
                                <List label="Pekerjaan">{respondent?.conf_pekerjaan_value || "-"}</List>
                                <List label="Biaya Komunikasi">{respondent?.conf_communication_expenses_value || "-"}</List>
                                <List label="Provider">{respondent?.conf_providers_value || "-"}</List>
                                <List label="Langganan">{respondent?.conf_subscribe_plans_value || "-"}</List>
                                <List label="Skala Kebutuhan">{respondent?.conf_scale_of_need_value || "-"}</List>
                                <List label="ID PLN">{respondent?.pln_id || "-"}</List>
                                <List label="KWH Meter">{respondent?.conf_pln_kwh_value || "-"}</List>
                                <List label="Keterangan">{respondent?.keterangan || "-"}</List>
                                <List label="Tanggal Survey">{respondent?.survey_at ? dayjs(respondent?.survey_at).format("DD-MM-YYYY") : "-"}</List>
                                <Button className="py-1.5 mt-2 ml-auto" labelClassName="gap-2" onClick={() => viewMaps(respondent?.id)}>
                                    <Maps className="-translate-y-[1px]" />
                                    <span>Lihat di Maps</span>
                                </Button>
                            </div>
                        ))}
                </When>
            </div>
            <When condition={filteredRespondents.length}>
                <div className="flex items-center justify-between gap-4 mt-6 mb-2 overflow-hidden md:flex-col md:justify-center">
                    <div className="flex justify-start w-full md:justify-center">
                        <PaginationInfo row={10} page={page} totalCount={filteredRespondents.length} />
                    </div>
                    <div className="flex justify-end w-full overflow-auto md:justify-center xs:justify-start">
                        <Pagination row={10} page={page} totalCount={filteredRespondents.length} onChange={(value) => setPage(value)} />
                    </div>
                </div>
            </When>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <span className="w-32 font-bold shrink-0 sm:w-20 xs:w-16">{label}</span>
            <span className="font-bold w-fit">:</span>
            <span className="w-80">{children}</span>
        </div>
    );
};

const NotFoundComponent: React.FC<{ input: string }> = ({ input }) => {
    return (
        <div className="py-8 text-center">
            <Image src={EmptyState} width={288} height={200} />
            <Title className="mt-4 mb-2">Responden {input && `‘${input}’`} Tidak Ditemukan</Title>
            <When condition={input}>
                <Subtitle size="subtitle" className="text-black-80">
                    Mohon cek nama yang Anda masukkan & coba lagi
                </Subtitle>
            </When>
        </div>
    );
};

export default DataRespondentMapsModal;
