import { When } from "react-if";

import { titleCase } from "@functions/common";
import { tw } from "@functions/style";

import AdministrativeIcon from "@images/bitmap/administrative_icon.png";
import NotFoundImage from "@images/bitmap/empty_state.png";
import PoiIcon from "@images/bitmap/poi_icon.png";
import StreetIcon from "@images/bitmap/street_icon.png";

import { Image } from "@components/layout";
import { Spinner } from "@components/loader";

interface Props {
    results: Data<AutocompletePrediction[]>;
    source: string;
    isFocus: boolean;
    access?: Access;
}

const getIcon = (type: string) => {
    if (type === "poi") {
        return PoiIcon;
    } else if (type === "jalan") {
        return StreetIcon;
    } else {
        return AdministrativeIcon;
    }
};

const ResultList: React.FC<Props> = ({ results, isFocus, access }) => {
    const { data, status } = results;

    return (
        <div id="maps-searchbox-result" className="absolute mt-0.5 rounded left-0 right-0 z-[2]">
            <When condition={isFocus}>
                <div className="flex flex-col bg-white rounded shadow">
                    <When condition={access === "unauthorized"}>
                        <span className="px-4 py-8 font-bold text-center text-subtitle">{`Silahkan login untuk menggunakan fitur search :)`}</span>
                    </When>
                    <When condition={status === "pending"}>
                        <Spinner className="py-12" size={100} />
                    </When>
                    <When condition={status === "reject"}>
                        <div className="flex flex-col px-4 py-8 text-center">
                            <Image src={NotFoundImage} width={200} height={200} />
                            <label className="mt-4 mb-1 font-bold">Lokasi Tidak Ditemukan</label>
                            <span className="text-medium text-secondary-50">Gunakan lokasi lain & silahkan coba lagi</span>
                        </div>
                    </When>
                    <When condition={status === "resolve"}>
                        {data.map((result) => {
                            const key = result.lat + result.long;
                            const name = result.name ? titleCase(result.name) : "";
                            const kelurahan = result.kelurahan ? titleCase(result.kelurahan) + ", " : "";
                            const kecamatan = result.kecamatan ? titleCase(result.kecamatan) + ", " : "";
                            const kota = result.kota ? titleCase(result.kota) + ", " : "";
                            const provinsi = titleCase(result.provinsi)?.replace("Dki", "DKI");
                            const label = `${kelurahan}${kecamatan}${kota}${provinsi}`;

                            return (
                                <div
                                    key={key}
                                    className="maps-searchbox-result-list flex items-center gap-2 w-full p-2.5 border-b cursor-pointer first:rounded-t last:rounded-b md:text-medium"
                                    data-place_id={result.place_id}
                                    data-lat={result.lat}
                                    data-lng={result.long}
                                >
                                    <Image src={getIcon(result.type)} />
                                    <div className="flex flex-col">
                                        <When condition={!!name}>
                                            <label className="text-sm font-bold">{name}</label>
                                        </When>

                                        <span className={tw(name ? "text-xs" : "text-sm font-bold")}>{label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </When>
                </div>
            </When>
        </div>
    );
};

export default ResultList;
