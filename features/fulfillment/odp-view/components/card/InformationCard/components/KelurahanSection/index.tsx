import { Case, Default, Switch, When } from "react-if";

import { useKelurahanStore } from "@features/fulfillment/odp-view/store";

import { Spinner } from "@components/loader";
import { WarningCard } from "@components/maps";
import { Subtitle } from "@components/text";

const KelurahanSection: React.FC<{ access: Access }> = ({ access }) => {
    const kelurahanStore = useKelurahanStore();

    return (
        <>
            <When condition={kelurahanStore.status === "pending"}>
                <Spinner />
            </When>
            <When condition={kelurahanStore.status === "reject"}>
                <Switch>
                    <Case condition={kelurahanStore.error?.code === 404}>
                        <WarningCard title="Data Tidak Ditemukan">Data tidak ditemukan, silahkan coba kembali di tempat lainnya.</WarningCard>
                    </Case>
                    <Default>
                        <WarningCard title="Terjadi Kesalahan">Hubungi customer service terkait masalah berikut atau coba lagi nanti.</WarningCard>
                    </Default>
                </Switch>
            </When>
            <When condition={kelurahanStore.status === "resolve"}>
                <Switch>
                    {/* <Case condition={access === "unauthorized"}>
                        <WarningCard title="Anda Belum Login">
                            Data yang tampil hanya data dummy, silahkan login untuk dapat mengakses semua fitur.
                        </WarningCard>
                    </Case>  */}
                    <Case condition={access === "forbidden"}>
                        <WarningCard title="Anda Tidak Punya Akses">
                            Data yang tampil hanya data dummy, silahkan ganti akun untuk dapat mengakses semua fitur.
                        </WarningCard>
                    </Case>
                    <Default>
                        <Subtitle>{kelurahanStore.data.formattedAddress}</Subtitle>
                    </Default>
                </Switch>
            </When>
        </>
    );
};

export default KelurahanSection;
