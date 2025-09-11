import { When } from "react-if";

import { tw } from "@functions/style";

import { useDataInternetStore } from "@features/planning/data-demand/store/internetMaps";

const LegendCard = () => {
    const dataInternet = useDataInternetStore();

    return (
        <When condition={dataInternet.status === "resolve"}>
            <div className="flex items-center gap-4 p-4 bg-white border shadow border-secondary-20 rounded-xl md:flex-col md:items-start">
                {/* <label className="font-bold text-h5 whitespace-nowrap md:text-base">Prioritas Prediksi</label> */}
                <div className="flex gap-4 text-center">
                    <List color="bg-primary-40">Very High Demand Internet</List>
                    <List color="bg-[#F96408]">High Demand Internet</List>
                    <List color="bg-[#C7920C]">Low Demand Internet</List>
                    <List color="bg-[#36A42B]">Very Low Demand Internet</List>
                </div>
            </div>
        </When>
    );
};

const List: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={tw("w-6 h-6 bg-secondary-50 rounded-sm", color)}></div>
            <span className="text-secondary-50 text-small">{children}</span>
        </div>
    );
};

export default LegendCard;
