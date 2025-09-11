import { Case, Default, Switch, When } from "react-if";

import { useLocationStore, useNcxStore } from "@features/planning/district-validation/store";

import { Spinner } from "@components/loader";
import { Card, WarningCard } from "@components/maps";

import { KelurahanCard, NcxCard } from "./components";

const TopCard: React.FC<{ access: Access }> = ({ access }) => {
    const locationStore = useLocationStore();
    const ncxStore = useNcxStore();

    if (locationStore.status === "idle") return null;

    return (
        <Card>
            <When condition={locationStore.status === "pending"}>
                <Spinner />
            </When>
            <When condition={locationStore.status === "reject"}>
                <Switch>
                    <Case condition={locationStore.error?.code === 404}>
                        <WarningCard title="Data Tidak Ditemukan">Data tidak ditemukan, silahkan coba kembali di tempat lainnya.</WarningCard>
                    </Case>
                    <Default>
                        <WarningCard title="Terjadi Kesalahan">
                            Terjadi kesalahan, hubungi customer service terkait masalah berikut atau coba lagi nanti.
                        </WarningCard>
                    </Default>
                </Switch>
            </When>
            <When condition={locationStore.status === "resolve"}>
                <div className="flex flex-col gap-2">
                    <KelurahanCard />

                    {ncxStore.status === "idle" ? (
                        <div className="pt-2 border-t">
                            <Spinner />
                        </div>
                    ) : ncxStore.status === "reject" ? (
                        <Switch>
                            <Case condition={locationStore.error?.code === 404}>
                                <WarningCard title="Data Tidak Ditemukan">
                                    Data NCX tidak ditemukan, silahkan coba kembali di tempat lainnya.
                                </WarningCard>
                            </Case>
                            <Default>
                                <WarningCard title="Terjadi Kesalahan">
                                    Terjadi kesalahan, hubungi customer service terkait masalah berikut atau coba lagi nanti.
                                </WarningCard>
                            </Default>
                        </Switch>
                    ) : (
                        <>
                            <NcxCard cardData={ncxStore.data.addressNcx} label="NCX" />
                            <NcxCard cardData={ncxStore.data.ncx_pendekatan} label="NCX Pendekatan" />
                            <NcxCard cardData={ncxStore.data.googleAddress} label="Google" />
                        </>
                    )}
                </div>
            </When>
        </Card>
    );
};

export default TopCard;
