import { TestSentimentDataResponse } from "@api/multilayer/sentiment-feedback";

import { Button } from "@components/button";
import { TextArea } from "@components/input";

interface Props {
    text: string;
    setText: (value: string) => void;
    setResponse: (value: TestSentimentDataResponse[]) => void;
    isLoading: boolean;
    sendTestSentiment: () => void;
}

const IdleState: React.FC<Props> = ({ text, setText, setResponse, isLoading, sendTestSentiment }) => {
    return (
        <div className="flex flex-col items-center gap-4 w-full sm:items-start">
            <label className="font-bold text-small text-black-80 self-start">Komentar</label>
            <TextArea
                placeholder="Tulis komentar Anda disini"
                value={text}
                onChange={(value) => {
                    setText(value);
                    setResponse([]);
                }}
                rows={5}
                className="w-[23rem] sm:w-[16rem] xs:w-[12rem]"
            />
            <Button onClick={sendTestSentiment} className="w-full" disabled={!text} loading={isLoading}>
                Kirim
            </Button>
        </div>
    );
};

export default IdleState;
