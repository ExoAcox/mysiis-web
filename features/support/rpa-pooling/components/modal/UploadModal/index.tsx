import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { When } from "react-if";
import { toast } from "react-toastify";

import { uploadPooling } from "@api/rpa/pooling";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

import { FailedState, IdleState, ProgressState, SuccessState } from "./components";

const UploadModal: React.FC<{ refresh: () => void }> = ({ refresh }) => {
    const [status, setStatus] = useState("idle");
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    const { modal, setModal } = useModal("rpa-pooling-upload");

    const submit = useMutation({
        mutationFn: (file: File) =>
            uploadPooling(file, (progressEvent) => {
                setProgress((progressEvent.loaded * 100) / progressEvent.total!);
            }),
        onSuccess: () => {
            refresh();
            setProgress(100);
        },
        onError: (error) => {
            toast.error((error as DataError)?.message);
        },
    });

    return (
        <Modal
            visible={modal}
            onClose={() => {
                setProgress(0);
                setFile(null);
                submit.reset();
            }}
            className={["success", "failed"].includes(status) ? "py-4 px-5" : ""}
        >
            <ModalTitle onClose={() => setModal(false)} className="text-large">
                {["idle", "progress"].includes(status) ? "Upload File" : ""}
            </ModalTitle>
            <When condition={submit.isIdle}>
                <IdleState
                    submit={(file) => {
                        setFile(file);
                        submit.mutate(file);
                    }}
                />
            </When>
            <When condition={submit.isPending}>
                <ProgressState progress={progress} filename={file?.name || ""} />
            </When>
            <When condition={submit.isError}>
                <FailedState setStatus={setStatus} resubmit={() => submit.mutate(file!)} />
            </When>
            <When condition={submit.isSuccess}>
                <SuccessState close={() => setModal(false)} />
            </When>
        </Modal>
    );
};

export default UploadModal;
