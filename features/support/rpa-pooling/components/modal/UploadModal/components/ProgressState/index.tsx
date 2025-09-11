import { BsFillFileEarmarkFill } from "react-icons/bs";

const ProgressState: React.FC<{ progress: number; filename: string }> = ({ progress, filename }) => {
    return (
        <div className="w-[18.75rem] flex gap-2.5 items-center mt-4">
            <BsFillFileEarmarkFill className="w-5 h-5 fill-secondary-60" />
            <div className="flex flex-col flex-1 gap-1.5">
                <div className="flex justify-between">
                    <span className="text-black-90 line-clamp-1">{filename}</span>
                    <label className="font-bold text-black-100 text-large">{progress}%</label>
                </div>
                <div className="relative h-2 overflow-hidden rounded bg-secondary-20">
                    <div className="absolute inset-0 bg-primary-40" style={{ width: progress + "%" }} />
                </div>
            </div>
        </div>
    );
};

export default ProgressState;
