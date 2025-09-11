import { useRef } from "react";

import usePortofolio from "@hooks/usePortofolio";

import { compareNumbers, intersection } from "@functions/common";

import MoreIcon from "@images/portofolio-icon/more.svg";

import { BottomSheet } from "@components/navigation";
import { SheetRef } from "@components/navigation/BottomSheet";

import { Drawer, GridCard } from "./components";

const Main: React.FC<{ user: User }> = ({ user }) => {
    const portofolios = usePortofolio();

    const sheetRef = useRef<SheetRef>(null);

    return (
        <>
            <div className="grid grid-cols-4 mt-5 gap-y-2.5">
                {portofolios
                    .map((portofolio) => {
                        const active = portofolio.guest || intersection(user.permission_keys, portofolio.permission).length;
                        return { ...portofolio, active: active ? 0 : 1 };
                    })
                    .sort((a, b) => compareNumbers(a.active, b.active))
                    .map((portofolio, index) => {
                        if (index > 6) return null;
                        return <GridCard portofolio={portofolio} key={`${index.toString()}`} device="mobile" user={user} />;
                    })}
                <div className="flex flex-col text-center gap-1.5 cursor-pointer" onClick={() => sheetRef.current?.snapTo("max")}>
                    <MoreIcon className="mx-auto w-[3.25rem] h-[3.25rem]" />
                    <label className="text-secondary-60 text-small">Lihat Semua</label>
                </div>
            </div>
            <BottomSheet ref={sheetRef}>
                <Drawer user={user} />
            </BottomSheet>
        </>
    );
};

export default Main;
