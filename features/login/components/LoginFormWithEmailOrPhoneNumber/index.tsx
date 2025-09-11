import { useRouter } from "next/router";

import { useProfileStore } from "@libs/store";

import LoginWithCaptcha, { FormValues, HandleSubmitForm } from "@features/login/components/LoginWithCaptcha";
import { LoginType, saveData } from "@features/login/queries/save";

export const PHONE_NUMBER_REGEX = /\(?(?:\+62|62|0)(?:\d{2,3})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const LoginFormWithEmailOrPhoneNumber: React.FC = () => {
    const setProfile = useProfileStore((state) => state.set);

    const router = useRouter();

    const handleSubmit = ({ input, setLoading, setError, isRememberMe, recaptchaToken }: HandleSubmitForm) => {
        saveData({
            type: LoginType.EMAIL_OR_PHONE_NUMBER,
            input: input as FormValues,
            setLoading,
            setError,
            isRememberMe,
            recaptchaToken,
            onSuccess: (profile) => {
                setProfile({ ready: true, data: profile });
                router.replace("/");
            },
        });
    };

    return (
        <LoginWithCaptcha
            type={LoginType.EMAIL_OR_PHONE_NUMBER}
            onSubmitForm={handleSubmit}
            inputField={{
                label: "Email atau Nomor Handphone",
                placeholder: "Masukkan email atau nomor handphone Anda",
                validate: {
                    required: "Email atau nomor handphone harus diisi",
                    pattern: {
                        value: new RegExp(`(${PHONE_NUMBER_REGEX.source})|(${EMAIL_REGEX.source})`),
                        message: "Masukan email atau nomor handphone yang valid",
                    },
                },
            }}
        />
    );
};

export default LoginFormWithEmailOrPhoneNumber;
