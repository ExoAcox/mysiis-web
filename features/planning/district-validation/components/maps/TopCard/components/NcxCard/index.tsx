import { Ncx } from "@api/district/metadata";

import { Subtitle } from "@components/text";

interface Props {
    cardData: Ncx["addressNcx"];
    label: string;
}

const NcxCard: React.FC<Props> = ({ cardData, label }: Props) => {
    return (
        <div className="pt-2 border-t">
            <Subtitle size="medium" className="mb-1 font-bold">
                {label} address data
            </Subtitle>
            <List label="Kelurahan">{cardData.kelurahan}</List>
            <List label="Kecamatan">{cardData.kecamatan}</List>
            <List label="Kabupaten">{cardData.kota}</List>
            <List label="Provinsi">{cardData.provinsi ?? "-"}</List>
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

export default NcxCard;
