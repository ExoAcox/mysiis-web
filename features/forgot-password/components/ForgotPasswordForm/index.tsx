import WhatsAppIcon from "@public/images/bitmap/whatsapp.svg";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";
import { When } from "react-if";
import { toast } from "react-toastify";

import { forgotPassword } from "@api/account/password";

import { Button } from "@components/button";
import { TextField } from "@components/input";
import { Spinner } from "@components/loader";

interface FormValues {
    email: string;
}

const ForgotPassowrdForm = () => {
    const [loading, setLoading] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ mode: "onChange", shouldFocusError: true });

    const onSubmit: SubmitHandler<FormValues> = async (input, e) => {
        e!.preventDefault();

        if (!executeRecaptcha) {
            return toast.error("Gagal terhubung ke Google ReCAPTCHA, silahkan refresh ulang");
        }

        setLoading(true);
        const recaptchaToken = await executeRecaptcha();

        forgotPassword({
            forgot_field_key: "email",
            forgot_field_value: input.email,
            forgot_channel: "email",
            recaptchaToken,
        }).finally(() => {
            setLoading(false);
            toast.success("Kode OTP terkirim, jika anda tidak menerima kode silahkan periksa kembali email yang anda masukkan");
            router.push(
                {
                    pathname: "/otp-verification",
                    query: { email: input.email },
                },
                "/otp-verification"
            );
        });
    };

    return (
        <>
            <When condition={loading}>
                <Spinner className="fixed inset-0 z-10 bg-white/70" size={70} />
            </When>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Email"
                    placeholder="Masukkan Email Anda"
                    controller={register("email", {
                        required: "Email tidak boleh kosong.",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            // value: /\(?(?:\+62|62|0)(?:\d{2,3})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}/,
                            message: "Masukan Email yang valid.",
                        },
                    })}
                    error={errors.email}
                />

                <Button type="submit" className="w-full mt-8" >
                    Kirim ke Email
                </Button>
            </form>
        </>
    );
};

export default ForgotPassowrdForm;
