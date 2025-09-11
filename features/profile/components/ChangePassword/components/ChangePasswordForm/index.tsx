import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";
import { When } from "react-if";
import { toast } from "react-toastify";

import { EditPassword, editPassword } from "@api/account/user";

import useModal from "@hooks/useModal";

import { PasswordSuccessModal } from "@features/profile/components/ChangePassword/components/modal";

import { Button } from "@components/button";
import { PasswordField } from "@components/input";
import { Spinner } from "@components/loader";

const ChangePasswordForm = () => {
    const modalPasswordSuccess = useModal("modal-profile-password-success");
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [isLoading, setLoading] = useState(false);
    const [isDisabledButton, setDisabledButton] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<EditPassword>({ shouldFocusError: true, mode: "onChange" });

    const onSubmit: SubmitHandler<EditPassword> = async (input, e) => {
        e?.preventDefault();

        if (!executeRecaptcha) {
            return toast.error("Gagal terhubung ke Google ReCAPTCHA, silahkan refresh ulang");
        }

        setLoading(true);
        const recaptchaToken = await executeRecaptcha();

        editPassword({ ...input, "g-recaptcha-response": recaptchaToken })
            .then(() => {
                modalPasswordSuccess.setModal(true);
            })
            .catch((error) => {
                toast.error(error?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const values = getValues();
        if (values.old_password && values.new_password && values.confirm_new_password) {
            if (values.new_password !== values.confirm_new_password) {
                setError("confirm_new_password", { type: "not_match", message: "Password tidak sama, cek kembali!" });
            } else {
                clearErrors("confirm_new_password");
            }
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [watch("old_password"), watch("new_password"), watch("confirm_new_password")]);

    return (
        <>
            <When condition={isLoading}>
                <Spinner className="fixed inset-0 z-10 bg-white/70" size={70} />
            </When>
            <When condition={!isLoading}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PasswordField
                        label="Password Lama"
                        placeholder="Masukkan password lama Anda"
                        controller={register("old_password", {
                            required: "Password lama tidak boleh kosong.",
                            validate: {
                                min_length: (value) => value.length >= 6 || "Password minimal 6 karakter",
                            },
                        })}
                        error={errors.old_password}
                        parentClassName="mt-3"
                    />
                    <PasswordField
                        label="Password Baru"
                        placeholder="Masukkan password baru Anda"
                        controller={register("new_password", {
                            required: "Password baru tidak boleh kosong.",
                            validate: {
                                min_length: (value) => value.length >= 6 || "Password minimal 6 karakter",
                            },
                        })}
                        error={errors.new_password}
                        parentClassName="mt-3"
                    />
                    <PasswordField
                        label="Konfirmasi Password Baru"
                        placeholder="Konfirmasi password baru Anda"
                        controller={register("confirm_new_password", {
                            required: "Konfirmasi password baru tidak boleh kosong.",
                            validate: {
                                min_length: (value) => value.length >= 6 || "Password minimal 6 karakter",
                                not_match: (value) => value === getValues("new_password") || "Password tidak sama, cek kembali!",
                            },
                        })}
                        error={errors.confirm_new_password}
                        parentClassName="mt-3"
                    />
                    <Button
                        type="submit"
                        className="w-full mx-auto mt-8"
                        disabled={!!errors.old_password || !!errors.new_password || !!errors.confirm_new_password || isDisabledButton}
                    >
                        Simpan
                    </Button>
                </form>
            </When>
            <PasswordSuccessModal />
        </>
    );
};

export default ChangePasswordForm;
