import { tw } from "@functions/style";

import SmartPhoneIcon from "@images/vector/smartphone.svg";

import { Responsive } from "@components/layout";
import { Link } from "@components/navigation";

interface Props {
    screenMax?: boolean;
    setDownloadAppOpen: (value: boolean) => void;
}

const TopBar: React.FC<Props> = ({ screenMax, setDownloadAppOpen }) => {
    return (
        <Responsive
            className={tw("flex items-center w-screen gap-8 mx-auto font-semibold text-white text-medium", screenMax && "max-w-none")}
            parentClassName="flex items-center h-8 bg-black-90"
        >
            <div
                className="flex items-center gap-2 mr-auto cursor-pointer md:justify-center md:flex-1"
                onClick={() => setDownloadAppOpen(true)}
                onMouseOver={() => setDownloadAppOpen(true)}
                onMouseOut={() => setDownloadAppOpen(false)}
            >
                <SmartPhoneIcon />
                <span>Unduh aplikasi mobile mySIIS</span>
            </div>
            <Link href="https://mysiis.io/about" className="md:hidden">
                Tentang mySIIS
            </Link>
            <Link href="/profile/faq" className="md:hidden">
                FAQ
            </Link>
        </Responsive>
    );
};

export default TopBar;
