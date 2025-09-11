import MapsIcon from "@public/images/vector/profile/maps.svg";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { When } from "react-if";
import { toast } from "react-toastify";

import { useProfileStore } from "@libs/store";

import { editProfile } from "@api/account/user";
import { getKabupaten, getKecamatan, getProvinsi } from "@api/district/metadata";

import useModal from "@hooks/useModal";

import { AddressMapsModal, AddressSuccessModal } from "@features/profile/components/Address/components/modal";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { TextArea, TextField } from "@components/input";
import { Spinner } from "@components/loader";

interface FormValues {
    addressPostalCode: string;
    addressDetail: string;
}

export interface InputProps {
    addressProvince?: string;
    addressCity?: string;
    addressSubDistrict?: string;
}

const AddressForm = ({ access }: { access: Access }) => {
    const modalAddressMaps = useModal("modal-profile-address-maps");
    const modalAddressSuccess = useModal("modal-profile-address-success");

    const setProfile = useProfileStore((state) => state.set);
    const profileStore = useProfileStore((state) => state.data);

    const [loading, setLoading] = useState<boolean>(false);
    const [listRegional, setListRegional] = useState<Option<string>[]>([]);
    const [listKota, setListKota] = useState<Option<string>[]>([]);
    const [listKecamatan, setListKecamatan] = useState<Option<string>[]>([]);
    const [isDisabledButton, setDisabledButton] = useState<boolean>(true);
    const [locationData, setLocationData] = useState<string>("");
    const [input, setInput] = useState<InputProps>({
        addressProvince: profileStore?.addressProvince || "",
        addressCity: profileStore?.addressCity || "",
        addressSubDistrict: profileStore?.addressSubDistrict || "",
    });

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ shouldFocusError: true, mode: "onChange" });

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();

        setLoading(true);

        const formData = new FormData();
        formData.append("addressProvince", input.addressProvince!);
        formData.append("addressPostalCode", data.addressPostalCode);
        formData.append("addressCity", input.addressCity!);
        formData.append("addressSubDistrict", input.addressSubDistrict!);
        formData.append("addressDetail", data.addressDetail);

        editProfile(formData)
            .then((result) => {
                setProfile({
                    ready: true,
                    data: {
                        ...profileStore,
                        addressProvince: result.addressProvince,
                        addressCity: result.addressCity,
                        addressSubDistrict: result.addressSubDistrict,
                        addressDetail: result.addressDetail,
                        addressPostalCode: result.addressPostalCode,
                    },
                });

                modalAddressSuccess.setModal(true);
            })
            .catch((error) => {
                toast.error(error?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchProvinsi = () => {
        setListRegional([]);
        getProvinsi()
            .then((resolve) => {
                setListRegional(
                    resolve.map((list) => ({
                        label: list.provinsi,
                        value: list.provinsi,
                    }))
                );
            })
            .catch((error) => {
                toast.error(error?.message);
            });
    };

    const fetchKota = (provinsi: string) => {
        setListKota([]);
        getKabupaten({ provinsi })
            .then((resolve) => {
                setListKota(
                    resolve.map((list) => ({
                        label: list.kota,
                        value: list.kota,
                        ...list,
                    }))
                );
            })
            .catch((error) => {
                toast.error(error?.message);
            });
    };

    const fetchKecamatan = (provinsi: string, kabupaten: string) => {
        setListKecamatan([]);
        getKecamatan({ provinsi, kabupaten })
            .then((resolve) => {
                setListKecamatan(
                    resolve.map((list) => ({
                        label: list.kecamatan,
                        value: list.kecamatan,
                    }))
                );
            })
            .catch((error) => {
                toast.error(error?.message);
            });
    };

    useEffect(() => {
        fetchProvinsi();
    }, []);

    useEffect(() => {
        reset({
            addressDetail: profileStore?.addressDetail || "",
            addressPostalCode: isNaN(Number(profileStore?.addressPostalCode)) ? "" : profileStore?.addressPostalCode,
        });

        setInput({
            addressProvince: profileStore?.addressProvince?.toUpperCase() === profileStore?.addressProvince ? profileStore?.addressProvince : "",
            addressCity: profileStore?.addressCity?.toUpperCase() === profileStore?.addressCity ? profileStore?.addressCity : "",
            addressSubDistrict:
                profileStore?.addressSubDistrict?.toUpperCase() === profileStore?.addressSubDistrict ? profileStore?.addressSubDistrict : "",
        });

        if (profileStore.addressProvince && profileStore.addressProvince?.toUpperCase() === profileStore.addressProvince) {
            fetchKota(profileStore.addressProvince);

            if (profileStore.addressCity && profileStore.addressCity?.toUpperCase() === profileStore.addressCity) {
                fetchKecamatan(profileStore.addressProvince, profileStore.addressCity);
            }
        }
    }, [profileStore]);

    useEffect(() => {
        const values = getValues();
        if (values.addressPostalCode && values.addressDetail) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [watch("addressPostalCode"), watch("addressDetail")]);

    return (
        <div>
            <When condition={loading}>
                <Spinner className="fixed inset-0 z-10 bg-white" size={70} />
            </When>
            <When condition={!loading}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Button variant="ghost" className="w-full mx-auto" labelClassName="flex gap-4" onClick={() => modalAddressMaps.setModal(true)}>
                        <MapsIcon />
                        Pilih di Maps
                    </Button>
                    <When condition={!!locationData}>
                        <div className="flex flex-col gap-2 text-sm text-black-80">
                            <span>Info alamat:</span>
                            <span>{locationData}</span>
                        </div>
                    </When>
                    <div className="h-0.5 w-full bg-black-40 my-4"></div>

                    <Dropdown
                        id="filter-profile-address-regional"
                        label="Provinsi"
                        placeholder="Pilih Provinsi"
                        value={input.addressProvince || ""}
                        options={listRegional}
                        onChange={(value) => {
                            if (value) {
                                fetchKota(value);

                                setInput({
                                    ...input,
                                    addressProvince: value,
                                    addressCity: "",
                                    addressSubDistrict: "",
                                });
                            }
                        }}
                        className="w-full"
                        disabled={!input.addressProvince && listRegional?.length < 1}
                    />
                    <Dropdown
                        id="filter-profile-address-kota"
                        label="Kota"
                        placeholder="Pilih Kota"
                        value={input.addressCity || ""}
                        options={listKota}
                        onChange={(value) => {
                            if (value) {
                                fetchKecamatan(input.addressProvince!, value);

                                setInput({
                                    ...input,
                                    addressCity: value,
                                    addressSubDistrict: "",
                                });
                            }
                        }}
                        className="w-full"
                        disabled={!input.addressCity && listKota?.length < 1}
                    />
                    <Dropdown
                        id="filter-profile-address-kecamatan"
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan"
                        value={input.addressSubDistrict || ""}
                        options={listKecamatan}
                        onChange={(value) => {
                            if (value) {
                                setInput({
                                    ...input,
                                    addressSubDistrict: value,
                                });
                            }
                        }}
                        className="w-full"
                        disabled={!input.addressSubDistrict && listKecamatan?.length < 1}
                    />
                    <TextField
                        label="Kode Pos"
                        placeholder="Masukkan Kode Pos"
                        controller={register("addressPostalCode", {
                            required: "Kode pos tidak boleh kosong.",
                            validate: {
                                length: (value) => (value.length === 5 && Number(value) > 0) || "Kode pos harus berisi 5 digit angka.",
                            },
                        })}
                        error={errors.addressPostalCode}
                        className="w-full"
                        type="number"
                    />
                    <TextArea
                        label="Detail Alamat"
                        placeholder="Masukkan Detail Alamat"
                        controller={register("addressDetail", {
                            required: "Detail alamat tidak boleh kosong.",
                            pattern: {
                                value: /^[ A-Za-z0-9_@.,/#&+-]*$/,
                                message: "Detail alamat tidak boleh mengandung nilai apa pun kecuali alfanumerik dan simbol ( , . & / - _ @ ).",
                            },
                        })}
                        error={errors.addressDetail}
                        rows={2}
                        className="w-full"
                    />
                    <Button
                        type="submit"
                        className="w-full mx-auto mt-8"
                        disabled={
                            (input.addressProvince === profileStore?.addressProvince &&
                                input.addressCity === profileStore?.addressCity &&
                                input.addressSubDistrict === profileStore?.addressSubDistrict &&
                                watch("addressPostalCode") === profileStore?.addressPostalCode &&
                                watch("addressDetail") === profileStore?.addressDetail) ||
                            !input.addressProvince ||
                            !input.addressCity ||
                            !input.addressSubDistrict ||
                            isDisabledButton ||
                            !!errors.addressPostalCode ||
                            !!errors.addressDetail
                        }
                    >
                        Simpan
                    </Button>
                </form>
            </When>
            <AddressMapsModal
                access={access}
                setLocationData={setLocationData}
                input={input}
                setInput={setInput}
                fetchKota={fetchKota}
                fetchKecamatan={fetchKecamatan}
                setLoading={setLoading}
            />
            <AddressSuccessModal />
        </div>
    );
};

export default AddressForm;
