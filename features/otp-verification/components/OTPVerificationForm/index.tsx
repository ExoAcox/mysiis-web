import verificationOTPImage from "@public/images/bitmap/verification_otp.png";
import WhatsAppIcon from "@public/images/bitmap/whatsapp.svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Else, If, Then, When } from "react-if";
import { toast } from "react-toastify";

import { forgotPassword, verifyForgotPassword } from "@api/account/password";

import { formatTimer, getPrivatePhoneNumber } from "@features/otp-verification/functions/common";

import { Button } from "@components/button";
import { Image, Responsive } from "@components/layout";
import { Spinner } from "@components/loader";
import { Title } from "@components/text";

interface OPTVerificationFormProps {
    email: string;
}

const OTPVerificationForm: React.FC<OPTVerificationFormProps> = ({ email }) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [timer, setTimer] = useState(180);
    const [loading, setLoading] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const router = useRouter();

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (timer > 0) {
            timerId = setInterval(() => setTimer(timer - 1), 1000);
        }
        return () => clearInterval(timerId);
    }, [timer]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;

        if (isNaN(Number(value))) return;

        const newOTP = [...otp];

        newOTP[index] = value;

        setOtp(newOTP);

        if (index < otp.length - 1 && value !== "") {
            const nextSibling = (e.target as HTMLInputElement).nextSibling;

            if (nextSibling) {
                (nextSibling as HTMLInputElement).focus();
            }
        }
    };

    const handleResendOTP = async (channel: "email" | "sms" | "whatsapp") => {
        if (!executeRecaptcha) {
            return toast.error("Gagal terhubung ke Google ReCAPTCHA, silahkan refresh ulang");
        }

        setLoading(true);
        const recaptchaToken = await executeRecaptcha();

        forgotPassword({
            forgot_field_key: "email",
            forgot_field_value: email,
            forgot_channel: channel,
            recaptchaToken,
        })
            .then(() => {
                toast.success("Kirim ulang kode OTP berhasil!");
                setOtp(new Array(6).fill(""));
                setTimer(180);
            })
            .catch((error) => {
                toast.error(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        verifyForgotPassword({
            forgot_field_key: "email",
            forgot_field_value: email,
            otp_code: otp.join(""),
            expired_in: 360,
        })
            .then((res) => {
                toast.success("Verifikasi OTP berhasil");
                router.push(
                    {
                        pathname: "/new-password",
                        query: { resetPasswordToken: res.reset_password_token },
                    },
                    "/new-password"
                );
            })
            .catch((error) => {
                toast.error(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Responsive className="flex justify-center py-20 text-center">
            <When condition={loading}>
                <Spinner className="fixed inset-0 z-10 bg-white/70" size={70} />
            </When>

            <div>
                <Image src={verificationOTPImage} alt="OTP verification" />

                <Title tag="h1" size="h2" className="mt-4">
                    Verifikasi Kode OTP
                </Title>
                <p className="text-subtitle">Silakan cek & masukkan Kode OTP yang telah dikirimkan ke {email}</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-3 my-8">
                        {otp.map((data, index) => (
                            <input
                                key={`${index.toString()}`}
                                type="text"
                                className="w-20 py-5 border rounded-md outline-none px-7 border-secondary-30 focus:border-primary-40 valid:border-primary-40 text-primary-40 placeholder:text-black-60 text-h1"
                                maxLength={1}
                                value={data}
                                placeholder="•"
                                required
                                onChange={(e) => handleChangeInput(e, index)}
                            />
                        ))}
                    </div>

                    <div className="text-subtitle">
                        <span>Belum menerima kode OTP ?</span>
                        <If condition={timer !== 0}>
                            <Then>
                                <span className="ml-2 text-secondary-40">Kirim kode ({formatTimer(timer)})</span>
                            </Then>

                            <Else>
                                <span className="ml-2 cursor-pointer text-primary-40" onClick={() => handleResendOTP("email")}>
                                    Kirim kode baru ke SMS
                                </span>
                            </Else>
                        </If>
                    </div>

                    <Button type="submit" className="w-10/12 mx-auto mt-8 sm:w-full" disabled={otp.join("").length !== otp.length}>
                        Verifikasi OTP
                    </Button>

                    {/* <Button variant="nude" className="mx-auto mt-4" onClick={() => handleResendOTP("sms")} disabled={timer !== 0}>
                        Kirim kode baru ke SMS
                    </Button> */}
                </form>
            </div>
        </Responsive>
    );
};

export default OTPVerificationForm;
