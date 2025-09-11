import { useEffect } from "react";
import { IoIosListBox, IoMdPin } from "react-icons/io";
import { Case, Default, Switch, When } from "react-if";

import useModal from "@hooks/useModal";

import { markersSpeedtests, polygonsSpeedtests } from "@pages/planning/speedtest-ookla/speedtest-ookla";

import { getColor, showMarkers } from "@features/planning/speedtest-ookla/functions/speedtest";
import {
    DataLists,
    SpeedtestCardFilter,
    useFilterSpeedtestStore,
    useSpeedtestCardStore,
    useSpeedtestStore,
} from "@features/planning/speedtest-ookla/store/ookla";

import { TabButton } from "@components/button";
import { Spinner } from "@components/loader";
import { Card, WarningCard } from "@components/maps";

const ListOokla: React.FC<{ access: Access }> = ({ access }) => {
    const cardStore = useSpeedtestCardStore();
    const filterStore = useFilterSpeedtestStore();
    const speedtestStore = useSpeedtestStore();
    const { setData } = useModal<DataLists>("ookla-modal");

    useEffect(() => {
        if (speedtestStore.status !== "resolve" || filterStore.source === "kelurahan") return;

        if (filterStore.filter === "operator") {
            cardStore.dataOperator.forEach((speedtest) => {
                const label = speedtest.label;
                const speedtests = cardStore.operatorPolygonLabel[label];
                showMarkers(label, speedtests);
            });
        } else {
            cardStore.dataIsp.forEach((speedtest) => {
                const label = speedtest.label;
                const speedtests = cardStore.ispPolygonLabel[label];
                showMarkers(label, speedtests);
            });
        }
    }, [filterStore.filter, speedtestStore.status]);

    if (speedtestStore.status === "idle") return null;

    const { filter } = filterStore;

    return (
        <Card>
            <When condition={speedtestStore.status === "pending"}>
                <Spinner />
            </When>
            <When condition={speedtestStore.status === "reject"}>
                <Switch>
                    <Case condition={speedtestStore.error?.code === 404}>
                        <WarningCard title="Data Speedtest Tidak Ditemukan">
                            Mohon cek radius yang Anda masukkan atau coba lagi di tempat lainnya.
                        </WarningCard>
                    </Case>
                    <Case condition={speedtestStore.error?.code === 471}>
                        <WarningCard title="Tidak Diijinkan Melihat Data">
                            Anda hanya dapat melihat data sesuai dengan daftar peran/tugas Anda.
                        </WarningCard>
                    </Case>
                    <Default>
                        <WarningCard title="Terjadi Kesalahan">
                            Terjadi kesalahan, hubungi customer service terkait masalah berikut atau coba lagi nanti.
                        </WarningCard>
                    </Default>
                </Switch>
            </When>
            <When condition={speedtestStore.status === "resolve"}>
                <Switch>
                    <Case condition={access === "unauthorized"}>
                        <WarningCard title="Anda Belum Login">Silahkan login untuk dapat mengakses semua fitur.</WarningCard>
                    </Case>
                    <Default>
                        {[cardStore.dataIsp, cardStore.dataOperator].map((list, index) => {
                            if (index === 0 && filterStore.filter === "operator") return null;
                            if (index === 1 && filterStore.filter === "isp") return null;

                            return (
                                <div className="flex flex-col gap-2" key={`${index.toString()}`}>
                                    {list.map((list) => {
                                        return (
                                            <div
                                                key={`${index.toString()}`}
                                                className="flex items-center justify-between p-2 rounded bg-secondary-20"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-[1.25rem] h-[1.25rem] rounded-[50%]"
                                                        style={{ background: getColor(list.label) }}
                                                    ></div>
                                                    <span className="w-[6.7rem]">{list.label}</span>
                                                    <span>: {list.list.length}</span>
                                                </div>
                                                <div className="flex gap-2 text-lg text-primary-40">
                                                    <IoMdPin
                                                        title="speedtest-pin"
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            const label = list.label;
                                                            const speedtests =
                                                                filterStore.filter === "isp"
                                                                    ? cardStore.ispPolygonLabel[label]
                                                                    : cardStore.operatorPolygonLabel[label];

                                                            markersSpeedtests.forEach((marker) => marker.setMap(null));
                                                            polygonsSpeedtests.forEach((polygon) => polygon.setMap(null));
                                                            showMarkers(label, speedtests);
                                                        }}
                                                    />
                                                    <IoIosListBox title="speedtest-modal" className="cursor-pointer" onClick={() => setData(list)} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </Default>
                </Switch>
            </When>
        </Card>
    );
};

export default ListOokla;
