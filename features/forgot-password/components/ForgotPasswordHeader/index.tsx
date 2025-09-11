import MySIISLogo from "@public/images/bitmap/MySIISLogo.svg";
import { Subtitle, Title } from "@components/text";
import ArrowBackIcon from "@public/images/vector/arrow_back.svg";
import { Link } from '@components/navigation';

const ForgotPasswordHeader = () => {
    return (
        <header>
            <Link href="/login" className="inline-block mb-4">
                <ArrowBackIcon />
            </Link>

            <MySIISLogo className="w-[9.375rem] h-[4rem]" />

            <Title className="text-h2 mt-10">Lupa Password</Title>
            <Subtitle className="mt-2 text-black-70" size="large">
                Masukkan email untuk mendapatkan kode OTP
            </Subtitle>
        </header>
    );
};

export default ForgotPasswordHeader;
