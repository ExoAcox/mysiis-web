import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getKabupaten, getProvinsi } from "@api/district/metadata";

import { TabBar } from "@features/planning/speedtest-ookla/components/card";
import { tabOptions } from "@features/planning/speedtest-ookla/functions/common";
import { fetchKelurahan } from "@features/planning/speedtest-ookla/queries/agregat";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { LabelInput } from "@components/text";

import { Props, Value } from "../../filter/FilterCardAgregat";

const prov = [{ label: "Semua Provinsi", value: "" }];
const kab = [{ label: "Semua Kabupaten", value: "" }];

const FilterAgregat: React.FC<Props> = ({ input, setInput }) => {
    const router = useRouter();

    const [regional, setRegional] = useState(prov);
    const [listKota, setListKota] = useState(kab);

    const fetchProvinsi = () => {
        getProvinsi()
            .then((resolve) => {
                setRegional([
                    ...prov,
                    ...resolve.map((list) => ({
                        label: list.provinsi,
                        value: list.provinsi,
                    })),
                ]);
            })
            .catch();
    };

    const fetchKota = (provinsi: string) => {
        setListKota([]);
        getKabupaten({ provinsi })
            .then((resolve) => {
                setListKota([
                    ...kab,
                    ...resolve.map((list) => ({
                        label: list.kota,
                        value: list.kota,
                        ...list,
                    })),
                ]);
            })
            .catch();
    };

    useEffect(() => {
        fetchProvinsi();
    }, []);

    return (
        <div className="z-40 flex flex-col gap-4" data-testid="filter-agregat-mobile-modal">
            <TabBar
                tab={{
                    value: "agregat-speedtest",
                    options: tabOptions,
                    onChange: (value) => {
                        router.push(`/planning/speedtest-ookla/${value}`);
                    },
                }}
            />

            <div>
                <LabelInput>Pilih Provinsi</LabelInput>
                <Dropdown
                    id="filter-missing-street-table"
                    placeholder="Semua Provinsi"
                    value={input?.provinsi}
                    options={regional}
                    onChange={(value) => {
                        setInput({
                            ...input,
                            provinsi: value,
                        });

                        if (value) {
                            fetchKota(value);
                        } else {
                            setListKota(kab);
                        }
                    }}
                />
            </div>

            <div>
                <LabelInput>Pilih Kabupaten</LabelInput>
                <Dropdown
                    id="filter-missing-street-table"
                    placeholder="Semua Kabupaten"
                    value={input?.kota?.value}
                    options={listKota}
                    onChange={(_, value) => {
                        const data = value as Value;
                        setInput({
                            ...input,
                            kota: data,
                        });
                    }}
                />
            </div>

            <Button
                className="w-full"
                onClick={() => {
                    fetchKelurahan({
                        latLng: { lat: input.kota!.lat!, lng: input.kota!.long! },
                    });
                }}
            >
                Terapkan
            </Button>
        </div>
    );
};

export default FilterAgregat;
