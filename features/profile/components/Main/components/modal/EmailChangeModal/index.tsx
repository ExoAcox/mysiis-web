import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { TextField } from "@components/input";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";

export type FormValues = { email: string };

const EmailChangeModal = (): JSX.Element => {
    const { modal, setModal, data } = useModal<string>("modal-profile-email-change");
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
            modalVerificationPassword.setData(input?.email);
            setLoading(false);
            setModal(false);
            reset();
        }, 1000);
    };

    useEffect(() => {
        const values = getValues();
        if (!!values.email && values.email !== data) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [watch("email")]);

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
                        title="email-change-modal"
                    />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <Title className="text-2xl font-extrabold text-black-100 text-center">Masukkan Email Terbaru</Title>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <TextField
                            label="Email"
                            placeholder="Masukkan Email"
                            controller={register("email", {
                                required: "Email tidak boleh kosong.",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Masukkan email yang valid.",
                                },
                            })}
                            error={errors.email}
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
                            <Button type="submit" className="w-full" loading={isLoading} disabled={!!errors.email || isDisabledButton}>
                                Ubah
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EmailChangeModal;
