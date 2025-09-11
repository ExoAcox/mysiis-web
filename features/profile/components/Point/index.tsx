import { useState } from "react";
import { Case, Default, Switch, When } from "react-if";

import usePoint from "@hooks/usePoint";
import useProfile from "@hooks/useProfile";

import { tabOptions } from "@features/profile/functions/point";

import { Spinner } from "@components/loader";
import TabBar from "@components/navigation/NavigationBar/components/TabBar";

import { PointBanner, PointDescription, PointHistory, PointRedeem, PointShow, PointTask } from "./components";

const Point: React.FC<{ user: User }> = ({ user }) => {
    const profileStore = useProfile();
    const point = usePoint(user.userId);

    const [activeOptions, setActiveOptions] = useState<string>("task-point");

    return (
        <div className="flex flex-col gap-4">
            <When condition={point.isLoading}>
                <Spinner className="fixed inset-0 z-10 bg-white" size={70} />
            </When>
            <When condition={!point.isLoading}>
                <PointDescription />
                <div className="flex justify-center w-full gap-4 md:flex-col">
                    <div className="flex flex-col w-full gap-4 basis-5/12">
                        <PointShow point={point.data ?? 0} />
                        <div className="p-4 bg-white shadow md:hidden">
                            <PointTask />
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-4 p-4 overflow-hidden bg-white rounded-md shadow h-fit basis-7/12">
                        <PointBanner />
                        <div className="mt-4 md:hidden">
                            <PointRedeem profile={profileStore} />
                        </div>
                    </div>
                    <div className="flex-col hidden w-full gap-4 py-4 overflow-hidden bg-white rounded-md shadow h-fit md:flex">
                        <TabBar
                            tab={{
                                value: activeOptions,
                                options: tabOptions,
                                onChange: (value) => {
                                    setActiveOptions(value);
                                },
                            }}
                            screenMax
                            grandParentClassName="shadow-none"
                            parentClassName="p-0 gap-0"
                            wrapperClassName="flex flex-1 justify-center"
                        />
                        <div className="px-8">
                            <Switch>
                                <Case condition={activeOptions === "redeem-point"}>
                                    <PointRedeem profile={profileStore} />
                                </Case>
                                <Case condition={activeOptions === "history-point"}>
                                    <PointHistory />
                                </Case>
                                <Default>
                                    <PointTask />
                                </Default>
                            </Switch>
                        </div>
                    </div>
                </div>
            </When>
        </div>
    );
};

export default Point;
