import { useState } from "react";
import { When } from "react-if";
import { toast } from "react-toastify";

import { TestSentimentDataResponse, testSentiment } from "@api/multilayer/sentiment-feedback";

import useModal from "@hooks/useModal";

import { dummyText } from "@features/planning/sentiment-feedback/functions/table";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

import { IdleState, NegativePredictionState, NeutralPredictionState, PositivePredictionState } from "./components";

const TestModal = (): JSX.Element => {
    const { modal, setModal } = useModal("modal-sentiment-feedback-test");

    const [isLoading, setLoading] = useState(false);
    const [status, setStatus] = useState("idle");
    const [text, setText] = useState<string>(dummyText);
    const [response, setResponse] = useState<TestSentimentDataResponse[]>([]);

    const sendTestSentiment = () => {
        if (text) {
            setLoading(true);
            setResponse([]);
            testSentiment({ text: [text] })
                .then((result) => {
                    setResponse(result?.data);
                    if (result?.data?.[0]?.prediction === "positive") setStatus("positive-prediction");
                    else if (result?.data?.[0]?.prediction === "negative") setStatus("negative-prediction");
                    else setStatus("neutral-prediction");
                })
                .catch((error) => {
                    toast.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const onClose = () => {
        setModal(false);
        setStatus("idle");
        setText(dummyText);
        setResponse([]);
    };

    return (
        <Modal
            visible={modal}
            className="p-6 w-fit rounded-xl"
        >
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => onClose()} className="text-large">
                    {status === "idle" ? "Test API" : ""}
                </ModalTitle>
                <div className="flex flex-col items-center overflow-auto">
                    <When condition={status === "idle"}>
                        <IdleState
                            text={text}
                            setText={setText}
                            setResponse={setResponse}
                            isLoading={isLoading}
                            sendTestSentiment={sendTestSentiment}
                        />
                    </When>
                    <When condition={status === "negative-prediction"}>
                        <NegativePredictionState setStatus={setStatus} onClose={onClose} response={response} />
                    </When>
                    <When condition={status === "positive-prediction"}>
                        <PositivePredictionState setStatus={setStatus} onClose={onClose} response={response} />
                    </When>
                    <When condition={status === "neutral-prediction"}>
                        <NeutralPredictionState setStatus={setStatus} onClose={onClose} response={response} />
                    </When>
                </div>
            </div>
        </Modal>
    );
};

export default TestModal;
