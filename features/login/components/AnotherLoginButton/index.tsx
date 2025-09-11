import IndihomeLogo from "@public/images/bitmap/IndihomeLogo.svg";
import LoginIcon from "@public/images/bitmap/login_icon.svg";
import UserLoginIcon from "@public/images/bitmap/user_login_icon.svg";
import TelkomIcon from "@public/images/vector/telkom.svg";
import React from "react";

import { LoginType } from "@features/login/queries/save";

import { Button } from "@components/button";

interface LoginButton {
    label: string;
    onClick: () => void;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    name: LoginType;
}

type AnotherLoginButtonProps = {
    currentType: LoginType;
    onChangeType: (type: LoginType) => void;
};

const AnotherLoginButton: React.FC<AnotherLoginButtonProps> = ({ currentType, onChangeType }) => {
    const handleLoginWithEmail = () => {
        onChangeType(LoginType.EMAIL_OR_PHONE_NUMBER);
    };

    const handleLoginWithNIK = () => {
        onChangeType(LoginType.NIK);
    };

    const handleLoginWithIndiHomePartner = () => {
        onChangeType(LoginType.INDIHOME_PARTNER);
    };

    const handleLoginAccessTelkom = () => {
        onChangeType(LoginType.TELKOM_ACCESS);
    };

    const logins: LoginButton[] = [
        {
            label: "Masuk dengan Email atau Nomor Handphone",
            onClick: handleLoginWithEmail,
            icon: UserLoginIcon,
            name: LoginType.EMAIL_OR_PHONE_NUMBER,
        },
        {
            label: "Masuk dengan IndiHome Partner",
            onClick: handleLoginWithIndiHomePartner,
            icon: IndihomeLogo,
            name: LoginType.INDIHOME_PARTNER,
        },
        {
            label: "Masuk dengan Telkom Akses",
            onClick: handleLoginAccessTelkom,
            icon: LoginIcon,
            name: LoginType.TELKOM_ACCESS,
        },
        {
            label: "Masuk dengan NIK Telkom",
            onClick: handleLoginWithNIK,
            icon: TelkomIcon,
            name: LoginType.NIK,
        },
    ];

    return (
        <div className="flex flex-col gap-4 mt-6">
            {logins.map((login) => (
                <React.Fragment key={login.name}>
                    {currentType !== login.name && (
                        <Button
                            className="justify-start w-full border-secondary-30"
                            labelClassName="gap-4 text-secondary-60"
                            variant="ghost"
                            onClick={login.onClick}
                        >
                            {login.icon && <login.icon />}
                            <div className="h-6 w-[1px] bg-black-50" />
                            {login.label}
                        </Button>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default AnotherLoginButton;
