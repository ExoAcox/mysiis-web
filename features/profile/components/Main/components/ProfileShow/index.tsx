import { Title } from "@components/text";
import { Image } from "@components/layout";
import { Link } from "@components/navigation";

import { User } from "@api/account/user";

import AvatarProfile from "@images/bitmap/avatar_profile.png";
import HeadPointProfile from "@images/bitmap/head_point_profile.png";
import IconPoint from "@images/bitmap/icon_point.png";
import ChevronIcon from "@images/vector/profile/point_chevron_right.svg";

interface ProfileShowProps {
    profile: User;
    point: number;
}

const ProfileShow: React.FC<ProfileShowProps> = ({ profile, point }) => {
    return (
        <div className="flex flex-col rounded-md shadow bg-white overflow-hidden">
            <div className="flex gap-4 items-center p-4 md:flex-col md:text-center">
                <Image
                    src={profile?.profilePicture ? profile?.profilePicture : AvatarProfile}
                    fill
                    className="object-cover rounded-full"
                    parentClassName="w-14 h-14"
                />
                <div className="flex flex-col gap-2">
                    <Title className="text-xl text-black-100 font-bold">{profile?.fullname || ""}</Title>
                    <span className="text-md text-black-80">{profile?.role_details?.name || ""}</span>
                    {profile?.customdata?.tsel_region_branch?.map(item => {
                        return (
                            <ul className="list-disc ml-4">
                                <li className="text-sm text-black-80">{`${item.area}, ${item.region}, ${item.branch}`}</li>
                            </ul>
                        );
                    })}
                </div>
            </div>
            <div className="relative bg-gradient-to-r from-[#9C1642] to-[#D02541]">
                <Image src={HeadPointProfile} fill className="object-cover" parentClassName="absolute inset-0" />
                <div className="relative flex items-center gap-4 p-4 text-white">
                    <Image src={IconPoint} fill className="object-cover rounded-full" parentClassName="w-16 h-16" />
                    <div className="flex flex-col gap-1 text-white text-sm">
                        <div className="flex gap-1 items-center">
                            Point Anda: <span className="text-xl font-bold">{point}</span>
                        </div>
                        <span>Kumpulkan terus poinmu dan tukar dengan voucher!</span>
                        <Link href="/profile/point" className="underline underline-offset-2 md:hidden">
                            Lihat Selengkapnya
                        </Link>
                    </div>
                    <div className="hidden md:block ml-auto">
                        <Link href="/profile/point">
                            <ChevronIcon />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileShow;
