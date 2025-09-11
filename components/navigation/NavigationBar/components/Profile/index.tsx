import ContentLoader from "react-content-loader";
import { Else, If, Then } from "react-if";

import usePoint from "@hooks/usePoint";

import AvatarProfile from "@images/bitmap/avatar_profile.png";

import { Image } from "@components/layout";
import { Link } from "@components/navigation";

const Profile: React.FC<{ user: User }> = ({ user }) => {
    const { data, isLoading } = usePoint(user.userId);

    return (
        <Link href="/profile" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-20">
                <Image
                    src={user.profilePicture ? user.profilePicture : AvatarProfile}
                    fill
                    className="object-cover rounded-full"
                    parentClassName="w-8 h-8"
                />
            </div>
            <div className="flex flex-col text-medium">
                <label className="font-semibold">{user.fullname}</label>
                <If condition={isLoading}>
                    <Then>
                        <div className="w-full mt-1">
                            <ContentLoader
                                speed={2}
                                width={100}
                                height={20}
                                viewBox="0 0 100 20"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                                uniqueKey="point-placeholder"
                            >
                                <rect x="0" y="0" rx="0" ry="0" width="100" height="20" />
                            </ContentLoader>
                        </div>
                    </Then>
                    <Else>
                        <span className="text-black-70">
                            Poin Anda: <b className="font-bold text-black-80">{data ?? 0}</b>
                        </span>
                    </Else>
                </If>
            </div>
        </Link>
    );
};

export default Profile;
