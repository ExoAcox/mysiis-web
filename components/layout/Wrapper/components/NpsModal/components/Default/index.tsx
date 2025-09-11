import RateIcon1 from "@public/images/vector/nps/1.svg";
import RateIcon2 from "@public/images/vector/nps/2.svg";
import RateIcon3 from "@public/images/vector/nps/3.svg";
import RateIcon4 from "@public/images/vector/nps/4.svg";
import RateIcon5 from "@public/images/vector/nps/5.svg";
import RateIcon6 from "@public/images/vector/nps/6.svg";
import RateIcon7 from "@public/images/vector/nps/7.svg";
import RateIcon8 from "@public/images/vector/nps/8.svg";
import RateIcon9 from "@public/images/vector/nps/9.svg";
import RateIcon10 from "@public/images/vector/nps/10.svg";
import { useState } from "react";
import { When } from "react-if";

import { Rating } from "@api/nps";

import { tw } from "@functions/style";

import { Button } from "@components/button";
import { Spinner } from "@components/loader";
import { Title } from "@components/text";

const Default: React.FC<{
    ratings: Rating[];
    rate?: string;
    setRate: (value: string) => void;
    setStatus: (value: string) => void;
    loading: boolean;
}> = ({ ratings, rate, setRate, setStatus, loading }) => {
    const [rateIcon, setRateIcon] = useState<React.ReactNode | undefined>(undefined);

    const changeRateIcon = (rateNumber: number) => {
        const iconClassName = "w-14 h-14";

        switch (rateNumber) {
            case 1:
                return setRateIcon(<RateIcon1 className={iconClassName} />);
            case 2:
                return setRateIcon(<RateIcon2 className={iconClassName} />);
            case 3:
                return setRateIcon(<RateIcon3 className={iconClassName} />);
            case 4:
                return setRateIcon(<RateIcon4 className={iconClassName} />);
            case 5:
                return setRateIcon(<RateIcon5 className={iconClassName} />);
            case 6:
                return setRateIcon(<RateIcon6 className={iconClassName} />);
            case 7:
                return setRateIcon(<RateIcon7 className={iconClassName} />);
            case 8:
                return setRateIcon(<RateIcon8 className={iconClassName} />);
            case 9:
                return setRateIcon(<RateIcon9 className={iconClassName} />);
            case 10:
                return setRateIcon(<RateIcon10 className={iconClassName} />);
            default:
                return setRateIcon(undefined);
        }
    };

    if (loading) {
        return (
            <div className="mt-4 mb-2 w-[31.25rem]">
                <Spinner className="py-8" size={100} />
            </div>
        );
    }

    return (
        <div className="mt-4 mb-2">
            <Title size="h5" className="text-center">
                Dalam Skor 1-10, seberapa Anda akan
                <br />
                merekomendasikan mySIIS ke rekan kerja Anda?
            </Title>
            <div className="flex gap-2 mt-4 mb-1 sm:overflow-scroll sm:scrollbar-hidden">
                {ratings
                    .sort((a, b) => a.rate - b.rate)
                    .map((rating) => {
                        return (
                            <div
                                key={rating._id}
                                className={tw(
                                    "p-4 border rounded cursor-pointer border-black-40",
                                    rate === rating._id ? "bg-primary-20 border-primary-30" : "hover:bg-primary-10 hover:border-primary-20"
                                )}
                                onClick={() => {
                                    setRate(rating._id);
                                    changeRateIcon(rating.rate);
                                }}
                            >
                                {rating.rate}
                            </div>
                        );
                    })}
            </div>
            <div className="flex justify-between gap-4 text-black-100 text-medium">
                <span>Tidak Merekomendasikan</span>
                <span>Sangat Merekomendasikan</span>
            </div>
            <When condition={!!rateIcon}>
                <div className="flex justify-center mt-4">{rateIcon}</div>
            </When>
            <Button className={tw("mt-12 px-4 mx-auto", !!rateIcon && "mt-4")} onClick={() => setStatus("reason")} disabled={!rate}>
                Selanjutnya
            </Button>
        </div>
    );
};

export default Default;
