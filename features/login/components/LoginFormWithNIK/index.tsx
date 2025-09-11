import { useRouter } from "next/router";

import { useProfileStore } from "@libs/store";

import LoginWithCaptcha, { FormValues, HandleSubmitForm } from "@features/login/components/LoginWithCaptcha";
import { LoginType, saveData } from "@features/login/queries/save";

const LoginFormWithNIK: React.FC = () => {
    const setProfile = useProfileStore((state) => state.set);

    const router = useRouter();

    const handleSubmit = ({ input, setLoading, setError, isRememberMe, recaptchaToken }: HandleSubmitForm) => {
        saveData({
            type: LoginType.NIK,
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
            type={LoginType.NIK}
            onSubmitForm={handleSubmit}
            inputField={{
                label: "NIK Telkom",
                placeholder: "Masukkan NIK Telkom Anda",
                validate: {
                    required: "NIK Telkom harus diisi",
                    minLength: {
                        value: 6,
                        message: "NIK Telkom minimal harus berisi 6 karakter",
                    },
                    maxLength: {
                        value: 8,
                        message: "NIK Telkom maksimal harus berisi 8 karakter",
                    },
                },
            }}
        />
    );
};

export default LoginFormWithNIK;
