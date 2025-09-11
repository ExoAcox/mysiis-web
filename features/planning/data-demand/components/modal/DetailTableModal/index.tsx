import dayjs from "dayjs";
import { useState } from "react";
import { When } from "react-if";

import { Respondent } from "@api/survey-demand/respondent";

import useModal from "@hooks/useModal";

import Maps from "@images/vector/maps.svg";

import { Button } from "@components/button";
import { Image, Modal } from "@components/layout";
import { Spinner } from "@components/loader";
import { Link } from "@components/navigation";
import { ModalTitle } from "@components/text";

const DetailTableModal = (): JSX.Element => {
    const { modal, setModal, data } = useModal<Respondent>("modal-data-demand-table-detail");

    const [isLoading, setLoading] = useState(true);

    const onLoad = () => {
        setLoading(false);
    };

    return (
        <Modal visible={modal} centered className="p-6 w-fit rounded-xl">
            <div className="flex flex-col gap-4">
                <ModalTitle
                    onClose={() => {
                        setLoading(true);
                        setModal(false);
                    }}
                    className="text-large"
                >
                    Detail Responden
                </ModalTitle>
                <div className="flex gap-8 max-h-[62vh] px-4 overflow-auto md:gap-4 md:max-h-none md:flex-col">
                    <div className="relative flex flex-col items-center justify-center flex-1 gap-2 w-72 min-h-72 md:w-full md:min-h-[14rem]">
                        <When condition={isLoading}>
                            <div className="absolute flex items-center justify-center w-full h-full">
                                <Spinner size={"8rem"} />
                            </div>
                        </When>
                        <Image
                            src={data.photo}
                            fill
                            className="object-cover rounded-lg"
                            parentClassName="absolute w-full h-full"
                            alt="foto"
                            onLoad={onLoad}
                        />
                    </div>
                    <div className="flex flex-col flex-1 w-full gap-2 text-sm">
                        <List label="ID">{data?.id || "-"}</List>
                        <List label="Nama">{data?.name || "-"}</List>
                        <List label="No Hp">{data?.phone || "-"}</List>
                        <List label="Alamat">{data?.address || "-"}</List>
                        <List label="Status Rumah">{data?.conf_kepemilikan_rumah_value || "-"}</List>
                        <List label="Pekerjaan">{data?.conf_pekerjaan_value || "-"}</List>
                        <List label="Biaya Komunikasi">{data?.conf_communication_expenses_value || "-"}</List>
                        <List label="Provider">{data?.conf_providers_value || "-"}</List>
                        <List label="Subscriber">{data?.conf_subscribe_plans_value || "-"}</List>
                        <List label="Skala Kebutuhan">{data?.conf_scale_of_need_value || "-"}</List>
                        <List label="ID PLN">{data?.conf_pln_kwhid || "-"}</List>
                        <List label="KWH Meter">{data?.conf_pln_kwh_value || "-"}</List>
                        <List label="Keterangan">{data?.keterangan || "-"}</List>
                        <List label="Tanggal Survey">{dayjs(data?.survey_at).format("DD-MM-YYYY")}</List>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 md:flex-col">
                    <Link href={`/fulfillment/odp-view?lat=${data.latitude}&lng=${data.longitude}`} target="_blank" className="w-fit md:w-full">
                        <Button onClick={() => setModal(false)} className="w-fit md:w-full" labelClassName="gap-2">
                            <Maps />
                            Lihat di Maps
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2">
            <span className="shrink-0 w-32 font-bold xs:w-20">{label}</span>
            <span>:</span>
            <span className="w-72">{children}</span>
        </div>
    );
};

export default DetailTableModal;
