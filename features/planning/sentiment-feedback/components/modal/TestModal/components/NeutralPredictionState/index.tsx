import { Else, If, Then } from "react-if";

import { TestSentimentDataResponse } from "@api/multilayer/sentiment-feedback";

import SuccessStateImage from "@images/bitmap/success_state.png";

import { Button } from "@components/button";
import { Image } from "@components/layout";

interface Props {
    setStatus: (value: string) => void;
    onClose: () => void;
    response: TestSentimentDataResponse[];
}

const NeutralPredictionState: React.FC<Props> = ({ setStatus, onClose, response }) => {
    return (
        <div className="flex flex-col items-center gap-4 w-full text-center" data-testid="neutral-prediction">
            <Image src={SuccessStateImage} width={467} />
            <div className="flex flex-col gap-0">
                <label className="font-bold text-h5">
                    <If condition={!!response?.[0]?.percentage_confident}>
                        <Then>{`Komentar Anda Diprediksikan Netral (${response?.[0]?.percentage_confident}%)`}</Then>
                        <Else>Komentar Anda Diprediksikan Netral</Else>
                    </If>
                </label>
                <label className="text-large">Silakan coba kata lain untuk melakukan testing ulang</label>
            </div>
            <div className="flex items-center gap-4 w-full md:flex-col">
                <Button variant="ghost" className="flex-1 w-full" onClick={() => setStatus("idle")}>
                    Test Ulang
                </Button>
                <Button className="flex-1 w-full" onClick={() => onClose()}>
                    Tutup
                </Button>
            </div>
        </div>
    );
};

export default NeutralPredictionState;
