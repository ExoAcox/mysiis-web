import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { MissingStreet, getKabupaten, getKecamatan, getKelurahan, getProvinsi } from "@api/district/metadata";

import { Dropdown } from "@components/dropdown";

interface Props {
    filter: MissingStreet;
    setFilter: Dispatch<SetStateAction<MissingStreet>>;
}

const prov = [{ label: "Semua Provinsi", value: "" }];
const kab = [{ label: "Semua Kota", value: "" }];
const kec = [{ label: "Semua Kecamatan", value: "" }];
const kel = [{ label: "Semua Kelurahan", value: "" }];

const FilterTable: React.FC<Props> = ({ filter, setFilter }: Props) => {
    const [regional, setRegional] = useState(prov);
    const [listKota, setListKota] = useState(kab);
    const [listKecamatan, setListKecamatan] = useState(kec);
    const [listKelurahan, setListKelurahan] = useState(kel);

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

    const fetchKecamatan = (provinsi: string, kabupaten: string) => {
        getKecamatan({ provinsi, kabupaten })
            .then((resolve) => {
                setListKecamatan([
                    ...kec,
                    ...resolve.map((list) => ({
                        label: list.kecamatan,
                        value: list.kecamatan,
                    })),
                ]);
            })
            .catch();
    };

    const fetchKelurahan = (provinsi: string, kabupaten: string, kecamatan: string) => {
        getKelurahan({ provinsi, kabupaten, kecamatan })
            .then((resolve) => {
                setListKelurahan([
                    ...kel,
                    ...resolve.map((list) => ({
                        label: list.kelurahan,
                        value: list.kelurahan,
                    })),
                ]);
            })
            .catch();
    };

    useEffect(() => {
        fetchProvinsi();
    }, []);

    return (
        <div className="flex gap-4">
            <Dropdown
                id="filter-missing-street-table"
                placeholder="Semua Provinsi"
                value={filter?.provinsi}
                options={regional}
                onChange={(value) => {
                    setFilter({
                        ...filter,
                        provinsi: value,
                        page: 1,
                        kota: "",
                        kecamatan: "",
                        kelurahan: "",
                    });
                    setListKecamatan(kec);
                    setListKelurahan(kel);

                    if (value) {
                        fetchKota(value);
                    } else {
                        setListKota(kab);
                    }
                }}
                className="w-full md:w-[90vw]"
            />
            <Dropdown
                id="filter-missing-street-table"
                placeholder="Semua Kota"
                value={filter?.kota}
                options={listKota}
                onChange={(value) => {
                    setFilter({
                        ...filter,
                        kota: value,
                        page: 1,
                        kecamatan: "",
                        kelurahan: "",
                    });
                    setListKelurahan(kel);

                    if (value) {
                        fetchKecamatan(filter.provinsi!, value);
                    } else {
                        setListKecamatan(kec);
                    }
                }}
                className="w-full md:w-[90vw]"
            />
            <Dropdown
                id="filter-missing-street-table"
                placeholder="Semua Kecamatan"
                value={filter?.kecamatan}
                options={listKecamatan}
                onChange={(value) => {
                    setFilter({
                        ...filter,
                        page: 1,
                        kecamatan: value,
                        kelurahan: "",
                    });
                    fetchKelurahan(filter.provinsi!, filter.kota!, value!);
                }}
                className="w-full md:w-[90vw]"
            />
            <Dropdown
                id="filter-missing-street-table"
                placeholder="Semua Kelurahan"
                value={filter?.kelurahan}
                options={listKelurahan}
                onChange={(value) => {
                    setFilter({
                        ...filter,
                        page: 1,
                        kelurahan: value,
                    });
                }}
                className="w-full md:w-[90vw]"
            />
        </div>
    );
};

export default FilterTable;
