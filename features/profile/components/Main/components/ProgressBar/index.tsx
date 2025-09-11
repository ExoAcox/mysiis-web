import { When } from "react-if";

import { Button } from "@components/button";

import ChevronRightIcon from "@images/vector/chevron_right.svg";

interface ProgressBarProps {
    countProgress: number;
    handleMove: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ countProgress, handleMove }) => {
    return (
        <When condition={countProgress < 100}>
            <div className="flex items-center justify-between gap-4 p-4 rounded-md shadow bg-white">
                <div className="flex flex-col flex-1 gap-2">
                    <div className="flex gap-1 items-center text-xs font-semibold">
                        Anda sudah melengkapi <span className="text-sm font-bold">{countProgress}%</span> dari profil Anda!
                    </div>
                    <div className="w-full h-2 rounded bg-secondary-10">
                        <div className="w-0 h-2 rounded bg-primary-40" style={{ width: `${countProgress}%` }}></div>
                    </div>
                </div>
                <Button className="text-sm" labelClassName="flex gap-2" onClick={handleMove}>
                    Lengkapi Sekarang
                    <ChevronRightIcon />
                </Button>
            </div>
        </When>
    );
};

export default ProgressBar;
