import { Case, Default, Switch, When } from "react-if";

import useModal from "@hooks/useModal";

import { tw } from "@functions/style";

import ArrowRight from "@images/vector/arrow_right.svg";

import { useKelurahanStore, useRespondentStore } from "@features/planning/data-demand/store/maps";

import { Button } from "@components/button";
import { Spinner } from "@components/loader";
import { Card, WarningCard } from "@components/maps";
import { Subtitle, Title } from "@components/text";

const InformationCard = () => {
    const kelurahan = useKelurahanStore();
    const respondent = useRespondentStore();

    if (kelurahan.status !== "resolve") return null;

    return (
        <Card>
            <Title size="subtitle" className="text-black-100 mb-2.5">
                Informasi
            </Title>
            <Subtitle>{kelurahan.data.formattedAddress}</Subtitle>
            <div className="pt-3 mt-3 border-t border-secondary-20 text-medium">
                <When condition={respondent.status === "pending"}>
                    <Spinner className="py-4" />
                </When>
                <When condition={respondent.status === "reject"}>
                    <Switch>
                        <Case condition={respondent.error?.code === 404}>
                            <WarningCard title="Data Tidak Ditemukan">
                                Mohon cek lokasi yang Anda masukkan atau coba lagi di tempat lainnya.
                            </WarningCard>
                        </Case>
                        <Case condition={respondent.error?.code === 471}>
                            <WarningCard title="Tidak Diijinkan untuk Melihat Data">
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
                <When condition={respondent.status === "resolve"}>
                    <div className="w-full flex items-center justify-start text-black gap-2">
                        <span className="min-w-[13rem]">Total Responden</span>
                        <span>
                            : <b>{respondent.data[10] + respondent.data[11] + respondent.data[12]}</b>
                        </span>
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                        <List label="Cenderung membutuhkan" dataNumber={10} color="bg-success-50">
                            {respondent.data[10] || 0}
                        </List>
                        <List label="Membutuhkan" dataNumber={11} color="bg-warning-60">
                            {respondent.data[11] || 0}
                        </List>
                        <List label="Sangat membutuhkan" dataNumber={12} color="bg-primary-40">
                            {respondent.data[12] || 0}
                        </List>
                    </div>
                </When>
            </div>
        </Card>
    );
};

export interface DataRespondentMapsModalType {
    totalData: string;
    label: string;
    dataNumber: number;
}

const List: React.FC<{ children: React.ReactNode; label: string; dataNumber: number; color: string }> = ({ children, label, dataNumber, color }) => {
    const { setData } = useModal<DataRespondentMapsModalType>("data-respondent-maps-modal");

    return (
        <Button
            className="w-full shadow"
            labelClassName="w-full flex justify-between font-semibold text-black-90 text-start gap-2"
            variant="nude"
            onClick={() => {
                if (children) setData({ totalData: String(children), label, dataNumber });
            }}
        >
            <div className="flex items-center justify-start gap-2">
                <div className={tw("w-4 h-4 rounded-full bg-black-20", color)} />
                <span className="w-fit min-w-[10.75rem]">{label}</span>
                <span className="w-fit">: {children}</span>
            </div>
            <ArrowRight />
        </Button>
    );
};

export default InformationCard;
