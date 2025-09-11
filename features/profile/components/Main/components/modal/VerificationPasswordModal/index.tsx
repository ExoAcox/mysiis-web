import VerificationPasswordImage from "@public/images/bitmap/verification_password.png";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { editEmailDirectProfile, editMobileDirectProfile } from "@api/account/user";

import useModal from "@hooks/useModal";

import { validationEmail, validationPhoneNumber } from "@functions/common";

import Close from "@images/vector/close.svg";

import { Button } from "@components/button";
import { PasswordField } from "@components/input";
import { Image, Modal } from "@components/layout";
import { Title } from "@components/text";

export type FormValues = { password: string };

const VerificationPasswordModal = (): JSX.Element => {
    const { modal, setModal, data } = useModal<string>("modal-profile-verification-password");
    const modalEmailSuccess = useModal("modal-profile-email-success");
    const modalMobileSuccess = useModal("modal-profile-mobile-success");

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

        if (validationPhoneNumber(data)) {
            const params = {
                mobile: data,
                password: input.password,
            };
            editMobileDirectProfile(params)
                .then(() => {
                    setModal(false);
                    setTimeout(() => {
                        modalMobileSuccess.setModal(true);
                    }, 1000);
                })
                .catch((error) => {
                    toast.error(error?.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (validationEmail(data)) {
            const params = {
                email: data,
                password: input.password,
            };
            editEmailDirectProfile(params)
                .then(() => {
                    setModal(false);
                    setTimeout(() => {
                        modalEmailSuccess.setModal(true);
                    }, 1000);
                })
                .catch((error) => {
                    toast.error(error?.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            toast.error("Profil gagal diubah");
        }
    };

    useEffect(() => {
        const values = getValues();
        if (values.password) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [watch("password")]);

    return (
        <Modal visible={modal} className="w-[30rem] p-6 rounded-xl sm:w-full" data-testid="verification">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close
                        className="cursor-pointer"
                        onClick={() => {
                            setModal(false);
                            reset();
                        }}
                        title="verification-password-modal"
                    />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <Image src={VerificationPasswordImage} alt="Verification state" />
                    <Title size="h4" className="font-extrabold text-black-100 text-center">
                        Masukkan Password
                    </Title>
                    <p className="text-black-100 text-center">Masukkan password mySIIS Anda</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <PasswordField
                            label="Password"
                            placeholder="Masukkan Password"
                            controller={register("password", {
                                required: "Password tidak boleh kosong.",
                                validate: {
                                    min_length: (value) => value.length >= 6 || "Password minimal 6 karakter",
                                },
                            })}
                            error={errors.password}
                            className="overflow-hidden"
                        />
                        <div className="mt-4">
                            <Button type="submit" className="w-full" loading={isLoading} disabled={!!errors.password || isDisabledButton}>
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default VerificationPasswordModal;
