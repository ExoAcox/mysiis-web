import { Subtitle } from "@components/text";
import { Image } from "@components/layout";
import { Button } from "@components/button";

import ReferralProfile from "@images/bitmap/referral_profile.png";
import Copy from "@images/vector/copy.svg";

interface ReferralCodeProps {
    refCode: string;
}

const ReferralCode: React.FC<ReferralCodeProps> = ({ refCode }) => {
    return (
        <div className="flex flex-col gap-4 p-4 rounded-md shadow bg-white overflow-hidden">
            <Subtitle size="large" className="text-black-100 font-bold">
                Referal Code
            </Subtitle>
            <div className="relative">
                <Image src={ReferralProfile} fill className="object-cover" parentClassName="absolute inset-0 rounded-md" />
                <div className="relative flex justify-between items-center p-4 text-white">
                    <span className="text-lg">{refCode || ""}</span>
                    <Button
                        variant="ghost"
                        className="bg-transparent border-white text-white"
                        labelClassName="flex gap-2"
                        onClick={() => navigator.clipboard.writeText(refCode)}
                    >
                        <Copy />
                        Salin
                    </Button>
                </div>
            </div>
            <span className="text-sm text-black-60">Sebarkan code ini ke rekan-rekan anda dan dapatkan 100 poin</span>
        </div>
    );
};

export default ReferralCode;
