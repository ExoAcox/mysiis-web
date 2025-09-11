import dayjs from "dayjs";
import { Case, Switch, When } from "react-if";

import { User } from "@api/account/user";

import useModal from "@hooks/useModal";

import { tw } from "@functions/style";

import { Tab } from "@features/support/supervisor-menu/store";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Image, Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

const ActionButton: React.FC<{ user: User; tab: Tab }> = ({ user, tab }) => {
    const approveModal = useModal("supervisor-approve");
    const rejectModal = useModal("supervisor-reject");
    const blockModal = useModal("supervisor-block");
    const unblockModal = useModal("supervisor-unblock");

    return (
        <div className="flex gap-4 mt-6 empty:mt-1">
            <When condition={tab === "verified"}>
                <Dropdown
                    id="supervisor-action"
                    placeholder="Aksi Lainnya"
                    value=""
                    options={[{ label: "Blokir User", value: "block" }]}
                    onChange={(value) => {
                        if (value === "block") {
                            blockModal.setData(user);
                        }
                    }}
                    parentClassName={["verified", "reject"].includes(tab) ? "ml-auto" : ""}
                />
            </When>

            <Switch>
                <Case condition={tab === "pending"}>
                    <Button variant="ghost" className="w-24 ml-auto" onClick={() => rejectModal.setData(user)}>
                        Tolak
                    </Button>
                    <Button className="w-24" onClick={() => approveModal.setData(user)}>
                        Verifikasi
                    </Button>
                </Case>
                <Case condition={tab === "block"}>
                    <Button className="ml-auto" onClick={() => unblockModal.setData(user)}>
                        Terima
                    </Button>
                </Case>
            </Switch>
        </div>
    );
};

const Row: React.FC<{ label: string; value?: string | number; isOdd?: boolean }> = ({ label, value, isOdd }) => {
    return (
        <tr className={tw(isOdd && "bg-secondary-20")}>
            <td className="px-3 py-1">{label}</td>
            <td className="px-3 py-1">{value ?? "-"}</td>
        </tr>
    );
};

const DetailModal: React.FC<{ tab: Tab }> = ({ tab }) => {
    const { modal, setModal, data } = useModal<User>("supervisor-detail");

    return (
        <Modal visible={modal} className="w-[34.375rem]">
            <ModalTitle onClose={() => setModal(false)}>Data Pengguna</ModalTitle>
            <div className="flex gap-4">
                {data.fotoKTP && <Image src={data.fotoKTP} fill className="object-contain rounded" parentClassName="w-[252px] h-[153px] mt-6" />}
                {data.fotoWajah && <Image src={data.fotoWajah} fill className="object-contain rounded" parentClassName="w-[252px] h-[153px] mt-6" />}
            </div>
            <table className="w-full mt-6 overflow-hidden rounded-lg">
                <Row label="Nama" value={data.fullname} isOdd />
                <Row label="No. HP" value={data.mobile} />
                <Row label="Email" value={data.email} isOdd />
                <Row label="Role" value="Agus" />
                <Row label="Regional" value={data.customdata?.regional} isOdd />
                <Row label="Witel" value={data.customdata?.witel} />
                <Row
                    label="Tanggal Registrasi"
                    value={dayjs(data.verifiedData?.verifiedAt || data.verifiedData?.requestAt).format("DD-MM-YYYY • HH:mm")}
                    isOdd
                />
            </table>
            <ActionButton tab={tab} user={data} />
        </Modal>
    );
};

export default DetailModal;
