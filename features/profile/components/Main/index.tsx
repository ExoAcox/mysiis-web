import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { When } from "react-if";
import { toast } from "react-toastify";

import { useProfileStore } from "@libs/store";

import { editProfile } from "@api/account/user";

import usePoint from "@hooks/usePoint";
import useProfile from "@hooks/useProfile";

import { ProfileEditAccountModal, ProfileEditSuccessModal } from "@features/profile/components/Main/components/modal";

import { Spinner } from "@components/loader";

import { ProfileEdit, ProfileMenu, ProfileShow, ProgressBar, ReferralCode } from "./components";

export interface InputProps {
    fullname?: string;
    profile_picture?: unknown;
    imagePreview?: string | null;
}

const Main: React.FC<{ user: User }> = ({ user }) => {
    const profileStoreSet = useProfileStore();
    const profileStore = useProfile();
    const point = usePoint(user.userId);

    const router = useRouter();

    const [percentage, setPercentage] = useState<number>(0);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorSize, setErrorSize] = useState<boolean>(false);
    const [isEmptyProfile, setEmptyProfile] = useState<boolean>(false);
    const [input, setInput] = useState<InputProps>({
        fullname: profileStore?.fullname,
        profile_picture: "",
        imagePreview: null,
    });

    const handleInputImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    
        // File validation
        if (!file) {
            toast.error("file is required");
            return;
        }
    
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error("file type must be image")
            return;
        }
    
        if (file.size > 500000) { // 500 KB
            setErrorSize(true);
            return;
        }
    
        // Clear previous errors if validation passes
        setErrorSize(false);
    
        try {
            const base64 = await convertBase64(file);
    
            setInput(prevInput => ({
                ...prevInput,
                profile_picture: base64,
                imagePreview: URL.createObjectURL(file),
            }));
        } catch (error) {
            console.error('Error converting file to base64:', error);
            setErrorSize(true); // Or handle this error differently if needed
        }
    };
    

    const convertBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader?.readAsDataURL(file);
            reader.onload = () => {
                resolve((reader.result as string)?.split("base64,")?.[1]);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpdate = () => {
        setLoading(true);

        const params = new FormData();
        params.append("fullname", input.fullname!);
        if (input.profile_picture) {
            params.append("profile_picture", input.profile_picture as string);
        }

        editProfile(params)
            .then(async (result) => {
                const rememberMe = window.localStorage.getItem("remember-me");
                await axios.post(rememberMe ? "/api/update" : "/api/update-temp", {
                    fullname: result.fullname,
                });

                toast.success("Profil Berhasil Diubah!");
                setTimeout(() => {
                    router.reload();
                }, 1000);
            })
            .catch((error) => {
                toast.error(error?.message || "Profil Gagal Diubah!");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const isEmptyAddress = () => {
        if (
            !profileStore?.addressProvince ||
            !profileStore?.addressCity ||
            !profileStore?.addressPostalCode ||
            !profileStore?.addressSubDistrict ||
            !profileStore?.addressDetail
        ) {
            return true;
        } else {
            return false;
        }
    };

    const progressChange = () => {
        let progress = 0;
        if (profileStore?.mobile) {
            progress += 1;
        }
        if (profileStore?.fullname) {
            progress += 1;
        }
        if (profileStore?.email) {
            progress += 1;
        }
        if (profileStore?.addressProvince) {
            progress += 1;
        }
        if (profileStore?.addressCity) {
            progress += 1;
        }
        if (profileStore?.addressSubDistrict) {
            progress += 1;
        }
        if (profileStore?.addressDetail) {
            progress += 1;
        }
        if (profileStore?.addressDetail) {
            progress += 1;
        }
        setPercentage(progress);
    };

    const countProgress = (percentage / 8) * 100;

    const handleMove = () => {
        if (profileStore?.mobile == "" || profileStore?.fullname == "" || profileStore?.email == "") {
            setEmptyProfile(true);
        } else {
            router.push("/profile/address");
        }
    };

    useEffect(() => {
        setInput({
            fullname: profileStore?.fullname || "",
            profile_picture: "",
            imagePreview: null,
        });
    }, [profileStore?.fullname]);

    useEffect(() => {
        progressChange();
        isEmptyAddress();
    }, [profileStore?.fullname, countProgress]);

    return (
        <div className="flex flex-col gap-4">
            <When condition={isLoading || !profileStoreSet.ready}>
                <Spinner className="fixed inset-0 z-10 bg-white" size={70} />
            </When>
            <When condition={!isLoading}>
                <ProgressBar countProgress={countProgress} handleMove={handleMove} />
                <div className="flex justify-center w-full gap-4 md:flex-col">
                    <div className="flex flex-col w-full gap-4 basis-5/12">
                        <ProfileShow profile={profileStore} point={point.data ?? 0} />
                        <div className="md:hidden">
                            <ReferralCode refCode={profileStore?.refCode || ""} />
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-4 basis-7/12">
                        <div className="md:hidden">
                            <ProfileEdit
                                profile={profileStore}
                                input={input}
                                handleInputImage={handleInputImage}
                                errorSize={errorSize}
                                handleUpdate={handleUpdate}
                                setInput={setInput}
                                isEmptyProfile={isEmptyProfile}
                            />
                        </div>
                        <ProfileMenu isEmptyAddress={isEmptyAddress()} />
                    </div>
                    <div className="hidden md:block">
                        <ReferralCode refCode={profileStore?.refCode || ""} />
                    </div>
                </div>
            </When>
            <ProfileEditAccountModal
                profile={profileStore}
                input={input}
                handleInputImage={handleInputImage}
                errorSize={errorSize}
                handleUpdate={handleUpdate}
                setInput={setInput}
                isEmptyProfile={isEmptyProfile}
            />
            <ProfileEditSuccessModal />
        </div>
    );
};

export default Main;
