import { Case, Default, Switch, When } from "react-if";

import { useLocationStore } from "@features/planning/speedtest-ookla/store/agregat";

import { Spinner } from "@components/loader";
import { Card, WarningCard } from "@components/maps";
import { Subtitle } from "@components/text";

import { SpeedtestKelurahan } from "./components";

const InfoAgregat: React.FC<{ access: Access }> = ({ access }) => {
    const locationStore = useLocationStore();

    if (locationStore.status === "idle") return null;

    return (
        <Card className="">
            <When condition={locationStore.status === "pending"}>
                <Spinner />
            </When>
            <When condition={locationStore.status === "reject"}>
                <Switch>
                    <Case condition={locationStore.error?.code === 404}>
                        <WarningCard title="Data Speedtest Tidak Ditemukan">
                            Mohon cek radius yang Anda masukkan atau coba lagi di tempat lainnya.
                        </WarningCard>
                    </Case>
                    <Case condition={locationStore.error?.code === 471}>
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
            <When condition={locationStore.status === "resolve"}>
                <Switch>
                    <Case condition={access === "unauthorized"}>
                        <WarningCard title="Anda Belum Login">Silahkan login untuk dapat mengakses semua fitur.</WarningCard>
                    </Case>
                    <Default>
                        <div>
                            <Subtitle size="medium" className="font-bold">
                                Informasi
                            </Subtitle>
                            <List label="Provinsi">{locationStore.data.provinsi || "-"}</List>
                            <List label="Kota">{locationStore.data.kota || "-"}</List>
                            <List label="Kecamatan">{locationStore.data.kecamatan || "-"}</List>
                            <List label="Kelurahan">{locationStore.data.kelurahan || "-"}</List>
                        </div>
                        <SpeedtestKelurahan />
                    </Default>
                </Switch>
            </When>
        </Card>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <Subtitle size="small" className="w-32">
                {label}
            </Subtitle>
            <Subtitle size="small" className="font-bold w-fit">
                :
            </Subtitle>
            <Subtitle size="small" className="font-bold w-fit">
                {children}
            </Subtitle>
        </div>
    );
};

export default InfoAgregat;
