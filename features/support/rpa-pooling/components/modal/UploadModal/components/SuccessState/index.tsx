import SuccessStateImage from "@images/bitmap/success_state.png";

import { Image } from "@components/layout";
import { Button } from "@components/button";

const ProgressState: React.FC<{ close: () => void }> = ({ close }) => {
    return (
        <div className="w-[18.75rem] flex items-center mt-2 flex-col">
            <Image src={SuccessStateImage} />
            <label className="mt-3 font-bold text-subtitle">File Berhasil di Upload</label>
            <span className="text-medium">Silahkan lanjutkan Upload file-file lainnya</span>
            <Button className="w-full mt-3" onClick={close}>
                OKE
            </Button>
        </div>
    );
};

export default ProgressState;
