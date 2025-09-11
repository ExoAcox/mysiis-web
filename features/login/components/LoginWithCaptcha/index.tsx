import React, { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";
import { Unless, When } from "react-if";
import { toast } from "react-toastify";

import { LoginType } from "@features/login/queries/save";

import { Button } from "@components/button";
import { PasswordField, TextField } from "@components/input";
import { Link } from "@components/navigation";
import { CheckBox } from "@components/radio";

import { PHONE_NUMBER_REGEX } from "../LoginFormWithEmailOrPhoneNumber";

export type FormValues = { username: string; password: string };

export interface HandleSubmitForm {
    input: unknown;
    setLoading: (value: boolean) => void;
    setError: (error: DataError) => void;
    isRememberMe: boolean;
    recaptchaToken: string;
}

interface LoginWithCaptchaProps {
    type: LoginType;
    onSubmitForm: (args: HandleSubmitForm) => void;
    inputField: {
        label: string;
        placeholder?: string;
        validate?: object;
    };
}

const LoginWithCaptcha: React.FC<LoginWithCaptchaProps> = ({ type, onSubmitForm, inputField }) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setErrorMessage] = useState<DataError>(null);
    const [isRememberMe, setIsRememberMe] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const {
        register,
        handleSubmit,
        setError,
        getValues,
        formState: { errors },
    } = useForm<FormValues>({ shouldFocusError: true, mode: "onChange" });

    const onSubmit: SubmitHandler<FormValues> = async (input, e) => {
        e?.preventDefault();

        if (!executeRecaptcha) {
            return toast.error("Gagal terhubung ke Google ReCAPTCHA, silahkan refresh ulang");
        }

        setLoading(true);
        const recaptchaToken = await executeRecaptcha();
        onSubmitForm({ input, setLoading, setError: setErrorMessage, isRememberMe, recaptchaToken });

        if (isRememberMe) {
            window.localStorage.setItem("remember-me", ":)");
        } else {
            window.localStorage.removeItem("remember-me");
        }
    };

    useEffect(() => {
        if (!error) return;

        if (error.code === 4001) {
            setError("username", { message: "Gagal mendapatkan autentikasi ReCAPTCHA yang valid", type: "focus" });
        } else if (error.code === 404 || error.code === 401) {
            let message;

            const isMobile = PHONE_NUMBER_REGEX.test(getValues("username"));
            if (type === LoginType.EMAIL_OR_PHONE_NUMBER && !isMobile) {
                message = "Email atau password anda salah, silahkan periksa kembali";
            }
            if (type === LoginType.EMAIL_OR_PHONE_NUMBER && isMobile) {
                message = "No. Handphone atau password anda salah, silahkan periksa kembali";
            }
            if (type === LoginType.NIK) {
                message = "NIK atau password anda salah, silahkan periksa kembali akun Portal Telkom anda";
            }
            if (type === LoginType.INDIHOME_PARTNER) {
                message = "NIK atau password anda salah, silahkan menghubungi helpdesk login IndiHome Partner via telegram @wpi_support";
            }
            if (type === LoginType.TELKOM_ACCESS) {
                message = "NIK atau password anda salah, silahkan periksa kembali";
            }

            setError("username", { message, type: "focus" }, { shouldFocus: true });
        } else if (error.code === 423) {
            setError("username", { message: "Akun telah diblokir, silakan hubungi Supervisor Anda", type: "focus" }, { shouldFocus: true });
        } else if (error.code === 504) {
            setError("username", { message: "Gagal login, terjadi gangguan layanan pada sistem mySIIS sementara", type: "focus" });
        } else if (error.code) {
            setError("username", { message: error.message, type: "focus" });
        } else {
            setError("username", { message: "Gagal login, terjadi gangguan layanan pada sistem mySIIS sementara", type: "focus" });
        }
    }, [error]);

    useEffect(() => {
        const rememberMe = window.localStorage.getItem("remember-me");
        setIsRememberMe(rememberMe ? true : false);
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label={inputField.label}
                    placeholder={inputField.placeholder}
                    controller={register("username", { ...inputField.validate })}
                    error={errors.username}
                />

                <PasswordField
                    label="Password"
                    placeholder="Masukkan password Anda"
                    controller={register("password", {
                        required: "Password tidak boleh kosong.",
                    })}
                    error={errors.password}
                    parentClassName="mt-3"
                />

                <div className="flex items-center justify-between mt-2">
                    <CheckBox value={isRememberMe ? ["Ingat saya"] : []} options={["Ingat saya"]} onChange={() => setIsRememberMe(!isRememberMe)} />
                    <When condition={type === LoginType.EMAIL_OR_PHONE_NUMBER}>
                        <Link href="/forgot-password" className="font-bold">
                            Lupa password?
                        </Link>
                    </When>
                </div>

                <Button type="submit" className="w-full mt-6" loading={isLoading}>
                    Masuk
                </Button>
            </form>
        </div>
    );
};

export default LoginWithCaptcha;
