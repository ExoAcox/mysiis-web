import MySIISLogo from "@public/images/vector/mysiis.svg";

import ArrowBack from "@images/vector/arrow_back.svg";

import { LoginType } from "@features/login/queries/save";

import { Link } from "@components/navigation";
import { Subtitle, Title } from "@components/text";

interface LoginHeaderProps {
    type: LoginType;
}

const suffixLoginHeaderTitle = {
    [LoginType.EMAIL_OR_PHONE_NUMBER]: "",
    [LoginType.NIK]: " dengan NIK Telkom",
    [LoginType.INDIHOME_PARTNER]: " dengan IndiHome Partner",
    [LoginType.TELKOM_ACCESS]: " dengan Telkom Akses",
};

const LoginHeader: React.FC<LoginHeaderProps> = ({ type }) => {
    return (
        <header>
            <Link className="flex items-center gap-2 mb-2 font-bold text-black-90" href="/">
                <ArrowBack />
                <span>Kembali</span>
            </Link>
            <Link href="/" className="inline-block w-full">
                <MySIISLogo className="w-[9rem] h-[6rem]" />
            </Link>

            <Title size="h2">Masuk{suffixLoginHeaderTitle[type]}</Title>
            <Subtitle className="my-1 text-black-60" size="subtitle">
                Selamat datang di mySIIS
            </Subtitle>
        </header>
    );
};

export default LoginHeader;
