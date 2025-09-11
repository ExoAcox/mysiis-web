import { Case, Default, Switch, When } from "react-if";

import { useSelectedKelurahanStore } from "@features/planning/speedtest-ookla/store/agregat";

import { Spinner } from "@components/loader";
import { WarningCard } from "@components/maps";
import { Subtitle } from "@components/text";

const SpeedtestKelurahan = () => {
    const selectedKelurahanStore = useSelectedKelurahanStore();
    return (
        <div className="pt-2 mt-2 border-t">
            <When condition={selectedKelurahanStore.status === "idle"}>
                <Spinner />
            </When>
            <When condition={selectedKelurahanStore.status === "reject"}>
                <Switch>
                    <Case condition={selectedKelurahanStore.error?.code === 404}>
                        <WarningCard title="Data Speedtest Tidak Ditemukan">
                            Mohon cek radius yang Anda masukkan atau coba lagi di tempat lainnya.
                        </WarningCard>
                    </Case>
                    <Case condition={selectedKelurahanStore.error?.code === 471}>
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
            <When condition={selectedKelurahanStore.status === "resolve"}>
                <div>
                    <List label="Min Download">{(selectedKelurahanStore.data.min_dl / 1000).toFixed(2) || "-"}mbps</List>
                    <List label="Max Download">{(selectedKelurahanStore.data.max_dl / 1000).toFixed(2) || "-"}mbps</List>
                    <List label="Top ISP">{selectedKelurahanStore.data.top_isp || "-"}</List>
                    <List label="Top Operator">{selectedKelurahanStore.data.top_network_operator || "-"}</List>
                </div>
            </When>
        </div>
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

export default SpeedtestKelurahan;
