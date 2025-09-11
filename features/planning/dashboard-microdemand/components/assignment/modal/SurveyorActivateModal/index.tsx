import { SurveyorAssignment, activateAssignment } from "@api/survey-demand/mysiista";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { InfoModal, WarningModal } from "@features/planning/dashboard-microdemand/components/global";

import { Button } from "@components/button";

const ActivateModal: React.FC<{ refresh: () => void }> = ({ refresh }) => {
    const { data, setModal } = useModal<SurveyorAssignment>("assignment-surveyor-activate");
    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => setModal(false);
    const buttonClassName = "text-medium py-2 px-7";

    const isActive = data.status !== "inactive";
    let status: string;
    if(data.detail?.mysista?.status === "permits-approved"){
        status = "permit-active";
    } else if (data.detail?.mysista?.status === "done"){
        status = "permit-active";
    } else {
        status = "active"
    }

    return (
        <>
            <WarningModal
                id="assignment-surveyor-activate"
                message={`Yakin ingin ${isActive ? "menonaktifkan" : "mengaktifkan"}`}
                name={`${data.detail?.account.fullname} / ${data.detail?.mysista.name}`}
                variant={isActive ? "reject" : "accept"}
                loading={loading}
            >
                <Button variant="ghost" color="secondary" disabled={loading} onClick={closeModal} className={buttonClassName}>
                    Batal
                </Button>
                <Button
                    loading={loading}
                    className={buttonClassName}
                    onClick={() => {
                        submit.fetch(activateAssignment({ assignmentId: data.id, status: status, type: isActive ? "deactivate" : "activate" }), {
                            onResolve: () => {
                                closeModal();
                                refresh();
                            },
                        });
                    }}
                >
                    {isActive ? "Non-aktifkan" : "Aktifkan"}
                </Button>
            </WarningModal>

            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil {isActive ? "Menonaktifkan" : "Mengaktifkan"} Assignment
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal {isActive ? "Menonaktifkan" : "Mengaktifkan"} Assignment
            </InfoModal>
        </>
    );
};

export default ActivateModal;
