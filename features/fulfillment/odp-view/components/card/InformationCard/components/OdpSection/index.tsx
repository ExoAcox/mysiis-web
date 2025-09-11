import { HiInformationCircle } from "react-icons/hi";
import { Case, Default, Switch, When } from "react-if";
import ReactTooltip from "react-tooltip";

import useModal from "@hooks/useModal";

import { getPercent } from "@functions/common";

import { markerOdps } from "@pages/fulfillment/odp-view";

import { getOdpName } from "@features/fulfillment/odp-view/functions/odp";
import { useFilterStore, useOdpStore, useSecondOdpStore } from "@features/fulfillment/odp-view/store";

import { Button } from "@components/button";
import { Spinner } from "@components/loader";
import { WarningCard } from "@components/maps";

const OdpSection = () => {
    const odpStore = useOdpStore();
    const secondOdpStore = useSecondOdpStore();
    const source = useFilterStore((store) => store.source);
    const { setModal } = useModal("odp-view/odp");

    if (odpStore.status === "idle") return null;

    const odp = getOdpName(source);

    return (
        <div className="pt-3 mt-3 border-t border-secondary-20">
            <When condition={odpStore.status === "pending"}>
                <Spinner className="my-3" />
            </When>
            <When condition={odpStore.status === "reject"}>
                <Switch>
                    <Case condition={odpStore.error?.code === 404}>
                        <WarningCard title="ODP Tidak Ditemukan">Mohon cek radius yang Anda masukkan atau coba lagi di tempat lainnya.</WarningCard>
                    </Case>
                    <Case condition={odpStore.error?.code === 471}>
                        <WarningCard title="Tidak Diijinkan Melihat Data">
                            Anda hanya dapat melihat data sesuai dengan daftar peran/tugas Anda.
                        </WarningCard>
                    </Case>
                    <Default>
                        <WarningCard title="Terjadi Kesalahan">Hubungi customer service terkait masalah berikut atau coba lagi nanti.</WarningCard>
                    </Default>
                </Switch>
            </When>
            <When condition={odpStore.status === "resolve"}>
                <div className="flex flex-col text-medium">
                    <label className="font-bold text-subtitle font-black-100">
                        Ditemukan {odpStore.data.value} ODP {odp.name}
                    </label>
                    <span>Port tersedia {odpStore.data.percent}%</span>

                    <When condition={["pending", "resolve"].includes(secondOdpStore.status) && source !== "underspec"}>
                        <When condition={secondOdpStore.status === "pending"}>
                            <Spinner className="mt-5 mb-2.5" />
                        </When>
                        <When condition={secondOdpStore.status === "resolve"}>
                            <span className="mt-4 font-bold">
                                {secondOdpStore.data.value} ODP {odp.reverseName}
                            </span>
                            <span>Port tersedia {secondOdpStore.data.percent}%</span>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span>Perbandingan {getPercent({ total: odpStore.data.value, partial: secondOdpStore.data.value })}%</span>
                                <HiInformationCircle
                                    className="w-4.5 h-4.5 fill-secondary-40 cursor-pointer"
                                    data-tip="Perbandingan jumlah ODP UIM dengan Valins"
                                />
                                <ReactTooltip className="w-[150px]" />
                            </div>
                        </When>
                    </When>
                </div>

                <Button
                    className="w-full mt-3 max-w-[400px]"
                    onClick={() => {
                        markerOdps.forEach((marker) => marker.get("infoWindow").close());
                        setModal(true);
                    }}
                >
                    Lihat Daftar ODP
                </Button>
            </When>
        </div>
    );
};

export default OdpSection;
