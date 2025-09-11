import { Case, Default, Switch, When } from "react-if";

import { useDataInternetStore } from "@features/planning/data-demand/store/internetMaps";
import { useKelurahanStore } from "@features/planning/data-demand/store/maps";

import { Spinner } from "@components/loader";
import { Card, WarningCard } from "@components/maps";
import { Subtitle, Title } from "@components/text";

const InformationCard = () => {
    const kelurahan = useKelurahanStore();
    const dataInternet = useDataInternetStore();

    if (kelurahan.status !== "resolve") return null;

    return (
        <Card>
            <Title size="subtitle" className="text-black-100 mb-2.5">
                Informasi
            </Title>
            <Subtitle>{kelurahan.data.formattedAddress}</Subtitle>
            <div className="pt-3 mt-3 border-t border-secondary-20 text-medium">
                <When condition={dataInternet.status === "pending"}>
                    <Spinner className="py-4" />
                </When>
                <When condition={dataInternet.status === "reject"}>
                    <Switch>
                        <Case condition={dataInternet.error?.code === 404}>
                            <WarningCard title="Data Tidak Ditemukan">
                                Mohon cek lokasi yang Anda masukkan atau coba lagi di tempat lainnya.
                            </WarningCard>
                        </Case>
                        <Case condition={dataInternet.error?.code === 471}>
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
                <When condition={dataInternet.status === "resolve"}>
                    <div className="w-full flex items-center justify-between text-black">
                        <span>Total internet demand</span>
                        <span className="mr-[3rem] md:mr-[7rem] sm:mr-[4.5rem]">
                            : <b>{dataInternet.totalData}</b>
                        </span>
                    </div>
                </When>
            </div>
        </Card>
    );
};

export default InformationCard;
