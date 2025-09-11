import { useLocationStore } from "@features/planning/district-validation/store";

import { Subtitle } from "@components/text";

const KelurahanCard = () => {
    const locationStore = useLocationStore();
    return (
        <div>
            <Subtitle size="medium" className="mb-1 font-bold">
                SIIS address data
            </Subtitle>
            <List label="Kelurahan">{locationStore.data.kelurahan}</List>
            <List label="Kecamatan">{locationStore.data.kecamatan}</List>
            <List label="Kabupaten">{locationStore.data.kota}</List>
            <List label="Provinsi">{locationStore.data.provinsi}</List>
        </div>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <Subtitle size="small" className="w-20">
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

export default KelurahanCard;
