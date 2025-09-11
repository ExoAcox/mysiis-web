import { useEffect, useMemo, useState } from "react";

import { Polygon, addAssignment, getPolygonTsel, updateStatusPolygons } from "@api/survey-demand/mysiista";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

import { PolygonPicker } from "./components";
import { toast } from "react-toastify";
import { statusOptions } from "../../CardSection";
import Tabs from "../../Tabs";
import { Else, If, Then, When } from "react-if";

interface Form {
    status: string;
    polygon: Polygon[];
}

const formDefaultValue: Form = {
    status: "",
    polygon: [],
};

interface PolygonUpdate {
    status: string;
}

const PolygonUpdateStatusModal: React.FC<{ user: User; refresh: () => void }> = ({ user, refresh }) => {
    const { modal, setModal, data } = useModal<PolygonUpdate>("polygon-update-status");
    const [form, setForm] = useState<Form>(formDefaultValue);
    const [polygons, setPolygons] = useState<Polygon[]>([]);
    const [currentTab, setCurrentTab] = useState<string>("update_status");

    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => {
        setModal(false);
        setCurrentTab("update_status");
    };

    useEffect(() => {
        if (modal) {
            setForm({ ...formDefaultValue });
            getPolygonTsel({
                page: 1,
                row: 5000,
                status: data.status.replace("_", "-"),
            }).then((response) => {
                setPolygons(response.data);
            });
            
        }
    }, [modal]);

    const handleSubmit = () => {
        const polygon_ids: string[] = form.polygon.map((polygon) => polygon.objectid.toString());
        submit.fetch(updateStatusPolygons({ id: polygon_ids, status: form.status }), {
            onResolve: () => {
                toast.success("Berhasil mengubah status polygon");
                closeModal();
                refresh();
            },
        });
    };

    const options = statusOptions.find((item) => item.value === data.status)?.options;

    const submitDisabled = useMemo(() => {
        if(currentTab === "update_status") {
            return !form.status || !form.polygon.length;
        }
        
        if(currentTab === "calculate_cpp") {
            return !form.polygon.length
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
                <ModalTitle onClose={closeModal}>&nbsp;</ModalTitle>
                <When condition={["draft"].includes(data.status)}>
                    <Tabs 
                        tabs={[
                            { label: "Update Status", value: "update_status" },
                            { label: "Hitung CPP", value: "calculate_cpp" },
                        ]} 
                        onChange={(status) => {
                            setCurrentTab(status);
                            setForm(formDefaultValue);
                        }} 
                    />
                </When>
                <div className="flex gap-4 mt-4 w-[24rem] flex-col">
                    <When condition={currentTab === "update_status"}>
                        <Dropdown
                            id="select-status"
                            label="Status"
                            placeholder="Pilih Status"
                            value={form.status}
                            options={options!}
                            onChange={(status) => setForm({ ...form, status })}
                        />
                    </When>

                    <PolygonPicker
                        polygons={polygons}
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
                    <If condition={currentTab === "calculate_cpp"}>
                        <Then>
                            <Button className="flex-1" loading={loading} disabled={submitDisabled}>
                                Hitung
                            </Button>
                        </Then>
                        <Else>
                            <Button onClick={handleSubmit} className="flex-1" loading={loading} disabled={submitDisabled}>
                                Kirim
                            </Button>
                        </Else>
                    </If>
                    
                </div>
            </Modal>
        </>
    );
};

export default PolygonUpdateStatusModal;
