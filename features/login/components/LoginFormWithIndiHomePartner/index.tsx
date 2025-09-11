import { useRouter } from "next/router";

import { useProfileStore } from "@libs/store";

import LoginWithCaptcha, { FormValues, HandleSubmitForm } from "@features/login/components/LoginWithCaptcha";
import { LoginType, saveData } from "@features/login/queries/save";

const LoginFormWithIndiHomePartner: React.FC = () => {
    const setProfile = useProfileStore((state) => state.set);

    const router = useRouter();

    const handleSubmit = ({ input, setLoading, setError, isRememberMe, recaptchaToken }: HandleSubmitForm) => {
        saveData({
            type: LoginType.INDIHOME_PARTNER,
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
            type={LoginType.INDIHOME_PARTNER}
            onSubmitForm={handleSubmit}
            inputField={{
                label: "NIK Indihome Partner",
                placeholder: "Masukkan NIK Anda",
                validate: {
                    required: "NIK harus diisi",
                },
            }}
        />
    );
};

export default LoginFormWithIndiHomePartner;
