import { tw } from "@functions/style";

import { getColor } from "@features/fulfillment/odp-view/functions/smartsales";

const isBlackIndex = [4, 5, 6, 7, 8, 9];

const SmartSalesInfo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={tw("flex items-center w-full p-4 bg-white gap-x-4 gap-y-2 rounded-xl sm:flex-col", className)}>
            <label className="font-bold whitespace-nowrap text-h5">Smart Sales</label>
            <div className="w-full">
                <div className="flex w-full mb-1 overflow-hidden font-bold rounded text-black-30">
                    {Array.from({ length: 10 }).map((_, index) => {
                        return (
                            <div
                                key={`${index.toString()}`}
                                className={tw("py-0.5 px-4 flex-1 text-center md:px-0", isBlackIndex.includes(index + 1) && "text-black-70")}
                                style={{ background: getColor(index + 1) }}
                            >
                                {index + 1}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between text-secondary-50 text-small">
                    <span>Tidak direkomendasikan</span>
                    <span>Sangat direkomendasikan</span>
                </div>
            </div>
        </div>
    );
};

export default SmartSalesInfo;
