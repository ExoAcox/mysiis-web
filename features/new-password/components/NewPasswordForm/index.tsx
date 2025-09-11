import enterNewPass from "@public/images/bitmap/enter_new_pass.png";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { When } from "react-if";
import { toast } from "react-toastify";

import { changePassword } from "@api/account/password";

import { Button } from "@components/button";
import { PasswordField } from "@components/input";
import { Image, Responsive } from "@components/layout";
import { Spinner } from "@components/loader";
import { Title } from "@components/text";

interface FormValues {
    newPassword: string;
    confirmNewPassword: string;
}

interface NewPasswordFormProps {
    token: string;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isDirty, isValid },
    } = useForm<FormValues>({ shouldFocusError: true, mode: "onChange" });

    const onSubmit: SubmitHandler<FormValues> = (input, e) => {
        e?.preventDefault();

        setLoading(true);

        changePassword({
            new_password: input.newPassword,
            confirm_new_password: input.confirmNewPassword,
            token_reset_password: token,
        })
            .then(() => {
                toast.success("Ganti Password Berhasil");
                router.push("/login");
            })
            .catch((error) => {
                toast.error(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Responsive className="flex justify-center py-20">
            <When condition={loading}>
                <Spinner className="fixed inset-0 z-10 bg-white/70" size={70} />
            </When>

            <div>
                <Image src={enterNewPass} alt="OTP verification" />

                <Title tag="h1" size="h2" className="mt-4 text-center">
                    Masukkan Password Baru
                </Title>
                <p className="text-center text-subtitle">Silahkan isi pasword baru di kolom yang tersedia</p>

                <form className="mt-9" onSubmit={handleSubmit(onSubmit)}>
                    <PasswordField
                        label="Password Baru"
                        placeholder="Masukkan password baru Anda"
                        controller={register("newPassword", {
                            required: "Password baru tidak boleh kosong.",
                            validate: {
                                min_length: (value) => value.length >= 6 || "Password minimal 6 karakter",
                            },
                        })}
                        error={errors.newPassword}
                        parentClassName="mt-3"
                    />

                    <PasswordField
                        label="Konfirmasi Password Baru"
                        placeholder="Konfirmasi password baru Anda"
                        controller={register("confirmNewPassword", {
                            required: "Konfirmasi password baru tidak boleh kosong.",
                            validate: {
                                min_length: (value) => value.length >= 6 || "Password minimal 6 karakter",
                                not_match: (value) => value === getValues("newPassword") || "Password tidak sama, cek kembali!",
                            },
                        })}
                        error={errors.confirmNewPassword}
                        parentClassName="mt-3"
                    />

                    <Button type="submit" className="w-full mx-auto mt-8" disabled={!isDirty || !isValid}>
                        Simpan Password Baru
                    </Button>
                </form>
            </div>
        </Responsive>
    );
};

export default NewPasswordForm;
