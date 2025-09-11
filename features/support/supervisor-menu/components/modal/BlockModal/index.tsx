import useModal from "@hooks/useModal";
import useFetch from "@hooks/useFetch";

import { WarningModal, InfoModal } from "@features/planning/dashboard-microdemand/components/global";
import { Button } from "@components/button";

import { blockUser, User } from "@api/account/user";

const BlockModal: React.FC<{ refresh: () => void }> = ({ refresh }) => {
    const { data, setModal } = useModal<User>("supervisor-block");
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
            <WarningModal id="supervisor-block" variant="reject" message="Yakin ingin blokir" name={data.fullname} loading={loading}>
                <Button variant="ghost" color="secondary" disabled={loading} onClick={closeModal} className={buttonClassName}>
                    Batal
                </Button>
                <Button
                    loading={loading}
                    className={buttonClassName}
                    onClick={() => {
                        submit.fetch(blockUser(data.userId), {
                            onResolve: () => {
                                closeModal();
                                refresh();
                            },
                        });
                    }}
                >
                    Blokir
                </Button>
            </WarningModal>

            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil Memblokir User
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal Memblokir User
            </InfoModal>
        </>
    );
};

export default BlockModal;
