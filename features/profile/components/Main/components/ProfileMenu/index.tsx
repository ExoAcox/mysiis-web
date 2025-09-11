import { When } from "react-if";

import useModal from "@hooks/useModal";

import AccountIcon from "@images/vector/profile/account.svg";
import ChevronIcon from "@images/vector/profile/chevron_right.svg";
import HomeIcon from "@images/vector/profile/home.svg";
import InfoIcon from "@images/vector/profile/info.svg";
import PasswordIcon from "@images/vector/profile/password.svg";

import { Link } from "@components/navigation";
import { Subtitle } from "@components/text";

interface ProfileMenuProps {
    isEmptyAddress: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isEmptyAddress }) => {
    const modalProfileEditAccount = useModal("modal-profile-edit-account");

    return (
        <div className="flex flex-col gap-4">
            <div className="hidden md:block" onClick={() => modalProfileEditAccount.setModal(true)}>
                <List icon={<AccountIcon />} path="">
                    Akun
                </List>
            </div>
            <List icon={<PasswordIcon />} path="profile/change-password">
                Ubah Password
            </List>
            <List icon={<HomeIcon />} path="profile/address" isEmpty={isEmptyAddress}>
                Alamat
            </List>
            <List icon={<InfoIcon />} path="profile/terms-condition">
                Syarat & Ketentuan
            </List>
        </div>
    );
};

const List: React.FC<{ children: React.ReactNode; icon: React.ReactNode; path?: string; isEmpty?: boolean }> = ({
    children,
    icon,
    path,
    isEmpty,
}) => {
    return (
        <Link href={path!}>
            <div className="flex items-center justify-between gap-4 p-4 overflow-hidden font-bold bg-white rounded-md shadow text-black-100">
                <div className="flex items-center gap-4">
                    <When condition={!!icon}>{icon}</When>
                    <Subtitle size="large" className="">
                        {children}
                    </Subtitle>
                </div>
                <div className="flex items-center gap-4">
                    <When condition={isEmpty}>
                        <span className="text-sm text-primary-40">Belum lengkap</span>
                    </When>
                    <ChevronIcon />
                </div>
            </div>
        </Link>
    );
};

export default ProfileMenu;
