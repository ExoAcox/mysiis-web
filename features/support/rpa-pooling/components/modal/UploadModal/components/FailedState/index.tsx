import ErrorStateImage from "@images/bitmap/error_state_2.png";

import { Image } from "@components/layout";
import { Button } from "@components/button";

const ProgressState: React.FC<{ resubmit: () => void; setStatus: (status: string) => void }> = ({ resubmit, setStatus }) => {
    return (
        <div className="w-[18.75rem] flex gap-2.5 items-center mt-4  flex-col">
            <Image src={ErrorStateImage} />
            <label className="mt-1 mb-2 font-bold text-h5">Maaf file gagal di upload</label>
            <div className="flex w-full gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setStatus("idle")}>
                    Pilih File Baru
                </Button>
                <Button className="flex-1" onClick={resubmit}>
                    Upload Ulang
                </Button>
            </div>
        </div>
    );
};

export default ProgressState;
