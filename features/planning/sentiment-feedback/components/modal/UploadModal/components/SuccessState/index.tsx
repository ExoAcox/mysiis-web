import { Image } from "@components/layout";
import { Button } from "@components/button";

import SuccessStateImage from "@images/bitmap/success_state.png";

interface Props {
    setStatus: (value: string) => void;
}

const SuccessState: React.FC<Props> = ({ setStatus }) => {
    return (
        <div className="flex flex-col items-center gap-4 w-full text-center">
            <Image src={SuccessStateImage} width={467} />
            <div className="flex flex-col gap-0">
                <label className="font-bold text-h5">File Berhasil di Upload</label>
                <label className="text-large">Silahkan lanjutkan Upload file-file lain</label>
            </div>
            <Button className="w-full" onClick={() => setStatus("idle")}>
                Oke
            </Button>
        </div>
    );
};

export default SuccessState;
