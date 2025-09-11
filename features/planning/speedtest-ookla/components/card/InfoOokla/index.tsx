import csvDownload from "json-to-csv-export";
import { Case, Default, Switch, When } from "react-if";
import { toast } from "react-toastify";

import { Ookla } from "@api/speedtest/ookla";

import { useKelurahanSpeedtestStore, useSpeedtestStore } from "@features/planning/speedtest-ookla/store/ookla";

import { Button } from "@components/button";
import { Spinner } from "@components/loader";
import { Card, WarningCard } from "@components/maps";
import { Subtitle } from "@components/text";

const InfoOokla: React.FC<{ access: Access }> = ({ access }) => {
    const kelurahanStore = useKelurahanSpeedtestStore();
    const speedtestStore = useSpeedtestStore();

    const exportCsv = (array: Ookla[]) => {
        const dataToConvert = {
            data: array,
            filename: `Speedtest Ookla.csv`,
            delimiter: ",",
        };
        csvDownload(dataToConvert);
    };

    if (kelurahanStore.status === "idle") return null;

    return (
        <Card>
            <When condition={kelurahanStore.status === "pending"}>
                <Spinner />
            </When>
            <When condition={kelurahanStore.status === "reject"}>
                <Switch>
                    <Case condition={kelurahanStore.error?.code === 404}>
                        <WarningCard title="Data Speedtest Tidak Ditemukan">
                            Mohon cek radius yang Anda masukkan atau coba lagi di tempat lainnya.
                        </WarningCard>
                    </Case>
                    <Case condition={kelurahanStore.error?.code === 471}>
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
            <When condition={kelurahanStore.status === "resolve"}>
                <Switch>
                    <Case condition={access === "unauthorized"}>
                        <WarningCard title="Anda Belum Login">Silahkan login untuk dapat mengakses semua fitur.</WarningCard>
                    </Case>
                    <Default>
                        <Subtitle size="medium" className="font-bold">
                            Informasi
                        </Subtitle>
                        <List label="Provinsi">{kelurahanStore.data.provinsi || "-"}</List>
                        <List label="Kota">{kelurahanStore.data.kota || "-"}</List>
                        <List label="Kecamatan">{kelurahanStore.data.kecamatan || "-"}</List>
                        <List label="Kelurahan">{kelurahanStore.data.kelurahan || "-"}</List>
                        <List label="Speedtest Count">{speedtestStore.data.total_count || "-"}</List>
                        <Button
                            className="w-full mt-4"
                            onClick={() => {
                                if (speedtestStore.status === "reject") {
                                    toast.error("Gagal Download Data, Silakan coba lagi untuk download");
                                } else {
                                    toast.success("Data speedtest Ookla telah di download, silakan cek file terbaru");
                                    exportCsv(speedtestStore.data.lists);
                                }
                            }}
                        >
                            Download
                        </Button>
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

export default InfoOokla;
