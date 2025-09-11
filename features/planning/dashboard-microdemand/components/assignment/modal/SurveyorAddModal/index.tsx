import { useMemo, useState } from "react";

import { Polygon, addAssignment } from "@api/survey-demand/mysiista";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { useUserStore } from "@features/planning/dashboard-microdemand/store/global";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

import { InfoModal } from "../../../global";
import { PolygonPicker } from "./components";
import { When } from "react-if";

interface Form {
    type: "default" | "kelurahan";
    userId: string;
    polygon: Polygon[];
    userData: User[];
    vendor?: string;
    area?: string;
    regional?: string;
    witel?: string;
    telkom_treg?: string;
    telkom_witel?: string;
    kelurahan?: string;
}

const formDefaultValue: Form = {
    type: "default",
    userId: "",
    polygon: [],
    userData: [],
    vendor: "",
    area: "",
    regional: "",
    witel: "",
    telkom_treg: "",
    telkom_witel: "",
    kelurahan: "",
};

const SurveyorAssignmentModal: React.FC<{ user: User; refresh: () => void }> = ({ user, refresh }) => {
    const { modal, setModal } = useModal("assignment-surveyor-add");
    const [form, setForm] = useState<Form>(formDefaultValue);

    const userStore = useUserStore();

    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => setModal(false);

    const addUserData = (user: any) => {
        const currentUserData = form.userData;
        const filtered = currentUserData.filter((data) => data.userId === user.userId);
        if(filtered.length === 0) setForm({ ...form, userData: [...currentUserData, user] });
    }

    const removeUserData = (userId: string) => {
        const currentUserData = form.userData;
        const filtered = currentUserData.filter((data) => data.userId !== userId);
        setForm({ ...form, userData: filtered });
    }

    const handleSubmit = () => {
        const mysista_data = form.polygon.map((polygon) => ({
            tahapid: polygon.tahap_survey,
            sourcename: polygon.surveyor,
            area: polygon.area,
            treg: polygon.treg,
            witel: polygon.witel,
            telkom_treg: polygon.telkom_treg,
            telkom_witel: polygon.telkom_witel,
            mysistaid: polygon.objectid.toString(),
        }));     

        const user_data = form.userData.map((data) => data.userId);

        submit.fetch(addAssignment({ type: form.type, surveyid: 1, supervisorid: user.userId, user_data: user_data, mysista_data }), {
            onResolve: () => {
                closeModal();
                refresh();
            },
        });
    };

    const submitDisabled = useMemo(() => {
        if (!form.userData.length) return true;

        if (form.type === "default") {
            if (!form.polygon.length) return true;
        }

        return false;
    }, [form]);

    return (
        <>
            <Modal
                visible={modal}
                onClose={() => {
                    setForm(formDefaultValue);
                }}
                loading={loading}
            >
                <ModalTitle onClose={closeModal}>Tambah Assignment</ModalTitle>
                <div className="flex gap-4 mt-4 w-[24rem] flex-col">
                    <Dropdown
                        id="select-surveyor"
                        label="Surveyor"
                        placeholder="Pilih Surveyor"
                        value={form.userId}
                        options={userStore.data.map((data) => ({ label: data.fullname, value: data.userId }))}
                        loading={userStore.status === "pending"}
                        error={userStore.error}
                        onChange={(userId) => {
                            const user = userStore.data.find((data) => data.userId === userId);
                            if (user) addUserData(user);
                        }}
                        autocomplete
                    />
                    <When condition={form.userData.length}>
                        <div className="flex flex-col border rounded border-black-50 h-[12rem] mt-2">
                            <div className="flex-1 p-4 pb-0 overflow-auto">
                                <div className="flex flex-col gap-2">
                                    {form.userData.map((item) => {
                                        return (
                                            <ItemUser key={item.userId} user={item} onRemove={removeUserData} />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </When>

                    <PolygonPicker
                        selectedPolygon={form.polygon}
                        setPolygon={(polygon) => {
                            setForm({ ...form, polygon });
                        }}
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button color="secondary" variant="ghost" className="flex-1" onClick={closeModal} disabled={loading}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1" loading={loading} disabled={submitDisabled}>
                        Tambah
                    </Button>
                </div>
            </Modal>

            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil Menambahkan Assignment
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal Menambahkan Assignment
            </InfoModal>
        </>
    );
};

export default SurveyorAssignmentModal;

const ItemUser: React.FC<{ user: User; onRemove: (userId: string) => void }> = ({ user, onRemove }) => {
    return (
        <div className="w-full flex items-center justify-between">
            <span>{user.fullname}</span>
            <button className="border rounded-sm px-2 py-1" onClick={() => onRemove(user.userId)}>
                X
            </button>
        </div>
    );
};
