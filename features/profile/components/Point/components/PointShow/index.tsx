import { Image } from "@components/layout";

import HeadPointProfile from "@images/bitmap/head_point_profile.png";
import IconPoint from "@images/bitmap/icon_point.png";

interface PointShowProps {
    point: number;
}

const PointShow: React.FC<PointShowProps> = ({ point }) => {
    return (
        <div className="flex flex-col rounded-md shadow overflow-hidden">
            <div className="relative bg-gradient-to-r from-[#9C1642] to-[#D02541]">
                <Image src={HeadPointProfile} fill className="object-cover" parentClassName="absolute inset-0" />
                <div className="relative flex items-center gap-4 p-4 text-white">
                    <Image src={IconPoint} fill className="object-cover rounded-full" parentClassName="w-16 h-16" />
                    <div className="flex flex-col gap-1 text-white">
                        <span className="font-bold">Poin Anda</span>
                        <span className="text-2xl font-extrabold">{point || "0"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointShow;
