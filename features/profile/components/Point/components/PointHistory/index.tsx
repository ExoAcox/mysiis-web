import dayjs from "dayjs";
import { useState } from "react";
import { When } from "react-if";

import { GetMyVoucher } from "@api/point";

import DefaultRedeemPoint from "@images/bitmap/default_redeem_point.png";
import EmptyState from "@images/bitmap/empty_state.png";

import { usePointMyVoucher } from "@features/profile/store";

import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Subtitle } from "@components/text";

const PointHistory: React.FC = () => {
    const [paginate, setPaginate] = useState<GetMyVoucher>({
        page: 1,
        row: 6,
    });

    const { data, isPending, isError, isSuccess } = usePointMyVoucher(paginate);

    return (
        <div className="flex flex-col gap-4">
            <When condition={isPending}>
                <Spinner className="bg-white" size={70} />
            </When>
            <When condition={!isPending}>
                <div className="flex items-center">
                    <Subtitle size="large" className="font-bold text-black-100">
                        Poin yang telah Anda tukarkan
                    </Subtitle>
                </div>
                <When condition={(data?.totalData ?? 0) < 1 || isError}>
                    <NotFoundComponent />
                </When>
                <When condition={(data?.totalData ?? 0) > 0 || isSuccess}>
                    {data?.lists?.map((voucher, index) => (
                        <div key={`${voucher.item.itemName}.${index.toString()}`}>
                            <List title={voucher.item?.itemName} date={voucher.item?.expDate} image={voucher.item?.banner}>
                                {voucher.item?.price}
                            </List>
                        </div>
                    ))}
                    <div className="flex items-center justify-between gap-4 overflow-hidden md:flex-col md:justify-center">
                        <PaginationInfo row={paginate.row} page={paginate.page} totalCount={data?.totalData || 0} />
                        <Pagination
                            row={paginate.row}
                            page={paginate.page}
                            totalCount={data?.totalData || 0}
                            onChange={(value) => setPaginate({ ...paginate, page: value })}
                        />
                    </div>
                </When>
            </When>
        </div>
    );
};

const List: React.FC<{ children: React.ReactNode; title: string; date: string; image: string }> = ({ children, title, date, image }) => {
    return (
        <div className="flex items-center w-full gap-4 p-4 overflow-hidden rounded-md shadow bg-secondary-20">
            <Image
                src={image ? image : DefaultRedeemPoint}
                fill
                className="object-contain rounded-md"
                parentClassName="w-28 h-16 shrink-0 xs:hidden"
            />
            <div className="flex flex-col gap-1 sm:text-sm">
                <span className="font-bold text-black-100">{title || "Title"}</span>
                <span className="font-bold text-primary-40">{children || "00"}</span>
                <span className="text-xs text-black-80">{dayjs(date).format("DD/MM/YYYY")}</span>
            </div>
        </div>
    );
};

const NotFoundComponent: React.FC = () => {
    return (
        <div className="text-center">
            <Image src={EmptyState} width={288} height={200} />
            <Subtitle size="large" className="mt-4 font-bold text-black-100">
                Voucher Kosong
            </Subtitle>
        </div>
    );
};

export default PointHistory;
