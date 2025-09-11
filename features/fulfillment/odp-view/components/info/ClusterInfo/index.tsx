import { tw } from "@functions/style";

const ClusterInfo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={tw("flex items-center justify-between gap-4 p-4 bg-white rounded-xl", className)}>
            <label className="font-bold text-h5 whitespace-nowrap">Cluster Priority</label>
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 bg-blue-400 rounded-sm"></div>
                    <span className="text-secondary-50 text-small">Reguler</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 bg-red-400 rounded-sm"></div>
                    <span className="text-secondary-50 text-small">Prioritas</span>
                </div>
            </div>
        </div>
    );
};

export default ClusterInfo;
