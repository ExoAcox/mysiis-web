import { tw } from "@functions/style";

const PortList: React.FC = () => {
    return (
        <div className="flex flex-col gap-4 mt-4.5">
            <label className="font-bold text-black-100 text-medium">Keterisian Port:</label>
            <div className="flex flex-wrap justify-between gap-2 text-small text-black-100">
                <div className="space-y-3.5">
                    <List color="bg-[#C00000]">{"100%"}</List>
                    <List color="bg-[#FCC000]">{">80%"}</List>
                </div>
                <div className="space-y-3.5">
                    <List color="bg-[#FFFF00]">{">40%"}</List>
                    <List color="bg-[#2FA52D]">{"1-40%"}</List>
                </div>
                <div className="space-y-3.5">
                    <List color="bg-black">{"0%, ready to connect"}</List>
                    <List color="bg-black border border-4 border-[#2FA52D]">{"0%, ready for sale"}</List>
                </div>
            </div>
        </div>
    );
};

const List: React.FC<{ color: string; children: string }> = ({ color, children }) => {
    return (
        <div className="flex gap-1.5 shrink-0 items-center">
            <div className={tw("w-4 h-4 rounded-full", color)} />
            <span>{children}</span>
        </div>
    );
};

export default PortList;
