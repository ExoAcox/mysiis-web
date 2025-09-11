import Papa from "papaparse";
import { useState } from "react";
import { When } from "react-if";

import { UploadSentiment, uploadSentiment } from "@api/multilayer/sentiment-feedback";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

import { FailedState, IdleState, ProgressState, SuccessState } from "./components";

interface Props {
    refresh: () => void;
    user: User;
}

const UploadModal = ({ refresh, user }: Props): JSX.Element => {
    const { modal, setModal } = useModal("modal-sentiment-feedback-upload");

    const [status, setStatus] = useState("idle");
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [dataMessage, setDataMessage] = useState<UploadSentiment | null>(null);

    const sendSentiment = async (data: UploadSentiment | null = dataMessage) => {
        if (data) {
            try {
                setStatus("progress");

                await uploadSentiment(data, (progressEvent) => {
                    setProgress((progressEvent.loaded * 100) / progressEvent.total!);
                });

                refresh();
                setProgress(100);
                setStatus("success");
            } catch (error) {
                setStatus("failed");
            }
        } else {
            setStatus("failed");
        }
    };

    const uploadCsv = (file: File) => {
        setFile(file);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: "|",
            quoteChar: '"',
            complete: function (results) {
                const data = results.data;
                if (data.length > 0) {
                    const list = data.map((e: any) => e.message);
                    const dataNew = {
                        message: list,
                        userId: user.userId,
                    };
                    setDataMessage(dataNew);
                    sendSentiment(dataNew);
                } else {
                    setStatus("failed");
                }
            },
        });
    };

    const onClose = () => {
        setModal(false);
        setStatus("idle");
        setProgress(0);
        setDataMessage(null);
    };

    return (
        <Modal visible={modal} className="p-6 w-fit rounded-xl">
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => onClose()} className="text-large">
                    {["idle", "progress"].includes(status) ? "Upload File" : ""}
                </ModalTitle>
                <div className="flex flex-col items-center overflow-auto">
                    <When condition={status === "idle"}>
                        <IdleState uploadCsv={uploadCsv} />
                    </When>
                    <When condition={status === "progress"}>
                        <ProgressState progress={progress} filename={file?.name || ""} />
                    </When>
                    <When condition={status === "failed"}>
                        <FailedState setStatus={setStatus} sendSentiment={sendSentiment} dataMessage={dataMessage} />
                    </When>
                    <When condition={status === "success"}>
                        <SuccessState setStatus={setStatus} />
                    </When>
                </div>
            </div>
        </Modal>
    );
};

export default UploadModal;
