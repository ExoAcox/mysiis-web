import { When } from "react-if";

import { tw } from "@functions/style";

import EmptyState from "@images/bitmap/empty_state.png";

import { usePointTask } from "@features/profile/store";

import { Image } from "@components/layout";
import { Subtitle } from "@components/text";

import { SkeletonCard } from "./components";

const PointTask: React.FC = () => {
    const { data, isPending, isError } = usePointTask();

    return (
        <div className="flex flex-col gap-4 p-0.5 rounded-md bg-white overflow-hidden">
            <When condition={isPending}>
                {Array.from({ length: 4 }, (_, index) => ({ id: index })).map((item) => {
                    return <SkeletonCard key={item.id} />;
                })}
            </When>
            <When condition={!isPending}>
                <When condition={(data && data?.length < 1) || isError}>
                    <NotFoundComponent />
                </When>
                <When condition={data && data?.length > 0}>
                    <When
                        condition={
                            data && data?.filter((item) => item.isShowWeb === true && item.log_details && item.log_details?.length === 0).length > 0
                        }
                    >
                        <Subtitle size="large" className="font-bold text-black-100">
                            Selesaikan misi Anda!
                        </Subtitle>
                        {data
                            ?.filter((item) => item.isShowWeb === true && item.log_details && item.log_details?.length === 0)
                            .map((item, index) => (
                                <div key={`${item.title}.${index.toString()}`}>
                                    <List title={item.title?.id} subtitle={item.subtitle?.id}>
                                        {item.unit}
                                    </List>
                                </div>
                            ))}
                    </When>
                    <When
                        condition={
                            data && data?.filter((item) => item.isShowWeb === true && item.log_details && item.log_details?.length !== 0).length > 0
                        }
                    >
                        <Subtitle size="large" className="mt-2 font-bold text-black-100">
                            Telah diselesaikan
                        </Subtitle>
                        {data
                            ?.filter((item) => item.isShowWeb === true && item.log_details && item.log_details?.length !== 0)
                            .map((item, index) => (
                                <div key={`${item.title}.${index.toString()}`}>
                                    <List title={item.title?.id} subtitle={item.subtitle?.id} isCheck={true}>
                                        {item.unit}
                                    </List>
                                </div>
                            ))}
                    </When>
                </When>
            </When>
        </div>
    );
};

const List: React.FC<{ children: React.ReactNode; title: string; subtitle: string; isCheck?: boolean }> = ({
    children,
    title,
    subtitle,
    isCheck,
}) => {
    return (
        <div className={tw("flex items-center gap-4 p-4 rounded-md shadow overflow-hidden bg-white", isCheck && "bg-secondary-20")}>
            <div
                className={tw(
                    "flex flex-col items-center justify-center h-14 w-14 rounded-md font-bold text-white bg-primary-40 shrink-0",
                    isCheck && "bg-black-70"
                )}
            >
                <span className="text-xl">{children}</span>
                <span className="text-xs">Poin</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="font-bold text-black-100">{title}</span>
                <span className="text-xs text-black-80">{subtitle}</span>
            </div>
        </div>
    );
};

const NotFoundComponent: React.FC = () => {
    return (
        <div className="py-8 text-center">
            <Image src={EmptyState} width={288} height={200} />
            <Subtitle size="large" className="mt-4 font-bold text-black-100">
                Misi Kosong
            </Subtitle>
        </div>
    );
};

export default PointTask;
