import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { TextField } from "@components/input";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";

export type FormValues = { mobile: string };

const MobileChangeModal = (): JSX.Element => {
    const { modal, setModal, data } = useModal<string>("modal-profile-mobile-change");
    const modalVerificationPassword = useModal<string>("modal-profile-verification-password");

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isDisabledButton, setDisabledButton] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ shouldFocusError: true, mode: "onChange" });

    const onSubmit: SubmitHandler<FormValues> = (input, e) => {
        e?.preventDefault();

        setLoading(true);
        setTimeout(() => {
            modalVerificationPassword.setModal(true);
            modalVerificationPassword.setData(input?.mobile?.replace(/\D/g, ""));
            setLoading(false);
            setModal(false);
            reset({ mobile: "08" });
        }, 1000);
    };

    useEffect(() => {
        reset({ mobile: "08" });
    }, []);

    useEffect(() => {
        const values = getValues();
        if (!!values.mobile && values.mobile !== data) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [watch("mobile")]);

    return (
        <Modal visible={modal} className="w-[30rem] p-6 rounded-xl sm:w-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close
                        className="cursor-pointer"
                        onClick={() => {
                            setModal(false);
                            reset();
                        }}
                        title="mobile-change-modal"
                    />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <Title className="text-2xl font-extrabold text-black-100 text-center">Masukkan Nomor Handphone Terbaru Anda</Title>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <TextField
                            label="Nomor Handphone"
                            placeholder="Masukkan Nomor Handphone"
                            controller={register("mobile", {
                                required: "Nomor handphone tidak boleh kosong.",
                                pattern: {
                                    value: /\(?(?:\+62|62|0)(?:\d{2,3})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}/,
                                    message: "Masukan nomor handphone yang valid.",
                                },
                                validate: {
                                    min_length: (value) => value.length >= 8,
                                },
                            })}
                            error={errors.mobile}
                            className="overflow-hidden"
                        />
                        <div className="flex gap-4 mt-4">
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => {
                                    setModal(false);
                                    reset();
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" className="w-full" loading={isLoading} disabled={!!errors.mobile || isDisabledButton}>
                                Ubah
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default MobileChangeModal;
