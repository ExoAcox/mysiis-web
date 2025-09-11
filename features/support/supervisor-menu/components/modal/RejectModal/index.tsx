import useModal from "@hooks/useModal";
import useFetch from "@hooks/useFetch";

import { WarningModal, InfoModal } from "@features/planning/dashboard-microdemand/components/global";
import { Button } from "@components/button";

import { rejectUser, User } from "@api/account/user";

const RejectModal: React.FC<{ refresh: () => void }> = ({ refresh }) => {
    const { data, setModal } = useModal<User>("supervisor-reject");
    const { setModal: setModalDetail } = useModal("supervisor-detail");
    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => {
        setModalDetail(false);
        setModal(false);
    };
    const buttonClassName = "text-medium py-2 px-7";

    return (
        <>
            <WarningModal id="supervisor-reject" variant="reject" message="Yakin ingin tolak" name={data.fullname} loading={loading}>
                <Button variant="ghost" color="secondary" disabled={loading} onClick={closeModal} className={buttonClassName}>
                    Batal
                </Button>
                <Button
                    className={buttonClassName}
                    loading={loading}
                    onClick={() => {
                        submit.fetch(rejectUser(data.userId), {
                            onResolve: () => {
                                closeModal();
                                refresh();
                            },
                        });
                    }}
                >
                    Tolak
                </Button>
            </WarningModal>
            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil Menolak User
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal Menolak User
            </InfoModal>
        </>
    );
};

export default RejectModal;
