import { Image } from "@components/layout";
import { Button } from "@components/button";

import { UploadSentiment } from "@api/multilayer/sentiment-feedback";

import ErrorStateImage from "@images/bitmap/error_state_2.png";

interface Props {
    setStatus: (value: string) => void;
    sendSentiment: (value: UploadSentiment) => void;
    dataMessage: UploadSentiment | null;
}

const FailedState: React.FC<Props> = ({ setStatus, sendSentiment, dataMessage }) => {
    return (
        <div className="flex flex-col items-center gap-4 w-full text-center">
            <Image src={ErrorStateImage} width={467} />
            <div className="flex flex-col gap-0">
                <label className="font-bold text-h5">File Gagal di Upload</label>
                <label className="text-large">Silahkan Upload ulang file atau pilih file baru</label>
            </div>
            <div className="flex items-center gap-4 w-full md:flex-col">
                <Button variant="ghost" className="flex-1 w-full" onClick={() => setStatus("idle")}>
                    Pilih File
                </Button>
                <Button className="flex-1 w-full" onClick={() => sendSentiment(dataMessage!)}>
                    Upload Ulang
                </Button>
            </div>
        </div>
    );
};

export default FailedState;
