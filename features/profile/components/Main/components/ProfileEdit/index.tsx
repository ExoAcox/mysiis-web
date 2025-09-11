import { Else, If, Then, When } from "react-if";

import { User } from "@api/account/user";

import useModal from "@hooks/useModal";

import { tw } from "@functions/style";

import AvatarProfile from "@images/bitmap/avatar_profile.png";
import CameraIcon from "@images/vector/camera.svg";

import { InputProps } from "@features/profile/components/Main";
import {
    EmailChangeModal,
    EmailSuccessModal,
    MobileChangeModal,
    MobileSuccessModal,
    VerificationPasswordModal,
} from "@features/profile/components/Main/components/modal";

import { Button } from "@components/button";
import { TextField } from "@components/input";
import { Image } from "@components/layout";
import { Subtitle, Title } from "@components/text";

export interface ProfileEditProps {
    profile: User;
    input: InputProps;
    handleInputImage: (value: React.ChangeEvent<HTMLInputElement>) => void;
    errorSize: boolean;
    handleUpdate: () => void;
    setInput: (value: InputProps) => void;
    isEmptyProfile: boolean;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profile, input, handleInputImage, errorSize, handleUpdate, setInput, isEmptyProfile }) => {
    const modalEmailChange = useModal<string>("modal-profile-email-change");
    const modalMobileChange = useModal<string>("modal-profile-mobile-change");

    return (
        <div
            className={tw(
                "flex flex-col gap-4 p-4 w-full rounded-md shadow bg-white overflow-hidden",
                isEmptyProfile && "bg-primary-20 border-2 border-primary-40"
            )}
        >
            <Subtitle size="large" className="font-bold text-black-100 md:hidden">
                Edit Profil
            </Subtitle>
            <div className="flex gap-8 md:flex-col md:items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32">
                        <Image
                            src={input?.imagePreview ? input?.imagePreview : profile?.profilePicture ? profile?.profilePicture : AvatarProfile}
                            fill
                            className="object-cover rounded-full"
                            parentClassName="absolute inset-0"
                        />
                        <div className="absolute bottom-0 right-0 p-2 bg-white border rounded-full border-secondary-40">
                            <input
                                id="upload"
                                type="file"
                                name="profile_picture"
                                accept="image/*"
                                onChange={(e) => handleInputImage(e)}
                                className="hidden"
                                data-testid="profile-picture"
                            />
                            <label htmlFor="upload" className="cursor-pointer">
                                <CameraIcon />
                            </label>
                        </div>
                    </div>
                    <If condition={errorSize}>
                        <Then>
                            <span className="text-xs text-error-50">Ukuran gambar terlalu besar, maksimal 500kb.</span>
                        </Then>
                        <Else>
                            <span className="text-xs text-black-80">Tipe file png atau jpg & maksimal 500kb.</span>
                        </Else>
                    </If>
                </div>
                <div className="hidden flex-col gap-2 text-center md:flex">
                    <Title className="text-xl text-black-100 font-bold">{profile?.fullname || ""}</Title>
                    <span className="text-sm text-black-80">{`${profile?.role_details?.name || ""} • Witel ${profile?.customdata?.witel || ""} • ${
                        profile?.customdata?.regional || ""
                    }`}</span>
                </div>
                <div className="flex flex-col w-full gap-4">
                    <TextField
                        label="Nama"
                        placeholder="Masukkan nama Anda"
                        value={input?.fullname}
                        onChange={(value) => setInput({ ...input, fullname: value })}
                    />
                    <TextField
                        label="Email"
                        placeholder="Masukkan email Anda"
                        inputClassName="text-secondary-40"
                        value={profile?.email || ""}
                        suffix={
                            <Button
                                variant="nude"
                                className="text-sm font-bold text-primary-40"
                                disabled={profile?.telkomNIKType === "ih-partner"}
                                onClick={() => {
                                    modalEmailChange.setModal(true);
                                    modalEmailChange.setData(profile?.email || "");
                                }}
                            >
                                Ubah
                            </Button>
                        }
                        disabled
                    />
                    <TextField
                        label="Nomor Handphone"
                        placeholder="Masukkan nomor handphone Anda"
                        inputClassName="text-secondary-40"
                        value={profile?.mobile || ""}
                        suffix={
                            <Button
                                variant="nude"
                                className="text-sm font-bold text-primary-40"
                                onClick={() => {
                                    modalMobileChange.setModal(true);
                                    modalMobileChange.setData(profile?.mobile || "");
                                }}
                            >
                                Ubah
                            </Button>
                        }
                        disabled
                    />
                    <When condition={!!input?.profile_picture || input?.fullname !== profile?.fullname}>
                        <Button className="w-full my-2" disabled={errorSize || !input?.fullname} onClick={() => handleUpdate()}>
                            Simpan
                        </Button>
                    </When>
                </div>
            </div>
            <EmailChangeModal />
            <EmailSuccessModal />
            <MobileChangeModal />
            <MobileSuccessModal />
            <VerificationPasswordModal />
        </div>
    );
};

export default ProfileEdit;
