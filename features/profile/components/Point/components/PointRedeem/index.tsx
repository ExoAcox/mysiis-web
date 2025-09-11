import HistoryIcon from "@public/images/vector/history.svg";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { When } from "react-if";
import { toast } from "react-toastify";

import { User } from "@api/account/user";
import { GetVoucher, VoucherProps, getPointExchange } from "@api/point";

import useModal from "@hooks/useModal";

import DefaultRedeemPoint from "@images/bitmap/default_redeem_point.png";
import EmptyState from "@images/bitmap/empty_state.png";

import {
    PointHistoryModal,
    PointRedeemAddressCheckModal,
    PointRedeemAddressConfirmationModal,
    PointRedeemProfileCheckModal,
    PointRedeemSuccessLotteryModal,
    PointRedeemSuccessModal,
    PointRedeemVoucherModal,
} from "@features/profile/components/Point/components/modal";
import { usePointVoucher } from "@features/profile/store";

import { Button } from "@components/button";
import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Subtitle } from "@components/text";

interface PointRedeemProps {
    profile: User;
}

const PointRedeem: React.FC<PointRedeemProps> = ({ profile }) => {
    const router = useRouter();

    const modalPointHistory = useModal("modal-profile-point-history");
    const modalPointRedeemProfileCheck = useModal("modal-profile-point-redeem-profile-check");
    const modalPointRedeemAddressCheck = useModal("modal-profile-point-redeem-address-check");
    const { data: dataVoucher, setData: setDataVoucher } = useModal<VoucherProps | null>("modal-profile-point-redeem-voucher");
    const modalPointRedeemAddressConfirmation = useModal("modal-profile-point-redeem-address-confirmation");
    const modalPointRedeemSuccess = useModal("modal-profile-point-redeem-success");
    const modalPointRedeemSuccessLottery = useModal("modal-profile-point-redeem-success-lottery");

    const [input, setInput] = useState<GetVoucher>({
        page: 1,
        row: 6,
        isExpired: false,
        isAvailable: true,
    });
    const [isLoading, setLoading] = useState<boolean>(false);

    const { data, isPending, isError } = usePointVoucher(input);

    const handleClose = () => {
        modalPointRedeemAddressConfirmation.setModal(false);
        modalPointRedeemSuccess.setModal(false);
        modalPointRedeemSuccessLottery.setModal(false);
        router.push("/profile/point");
    };

    const handleRedeem = (data: VoucherProps) => {
        setLoading(true);

        if (data?.type === "lottery") {
            const formData = new FormData();
            formData.append("itemId", data?.itemId);

            getPointExchange(formData)
                .then(() => {
                    modalPointRedeemSuccessLottery.setModal(true);
                })
                .catch((error) => {
                    toast.error(error?.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (
            profile?.addressProvince !== "" &&
            profile?.addressCity !== "" &&
            profile?.addressPostalCode !== "" &&
            profile?.addressSubDistrict !== "" &&
            profile?.addressDetail !== ""
        ) {
            modalPointRedeemAddressConfirmation.setData(data);
            setLoading(false);
        } else {
            modalPointRedeemAddressCheck.setModal(true);
            setLoading(false);
        }
    };

    const handleRedeemExchange = (data: VoucherProps) => {
        setLoading(true);

        if (data?.isNeedAddress === true) {
            const formData = new FormData();
            formData.append("itemId", data?.itemId);
            formData.append("addressName", profile?.fullname || "");
            formData.append("addressEmail", profile?.email || "");
            formData.append("addressPhone", profile?.mobile || "");
            formData.append("addressProvince", profile?.addressProvince || "");
            formData.append("addressCity", profile?.addressCity || "");
            formData.append("addressSubDistrict", profile?.addressSubDistrict || "");
            formData.append("addressDetail", profile?.addressDetail || "");

            getPointExchange(formData)
                .then(() => {
                    modalPointRedeemSuccess.setModal(true);
                })
                .catch((error) => {
                    toast.error(error?.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            const formData = new FormData();
            formData.append("itemId", data?.itemId);
            formData.append("addressProvince", profile?.addressProvince || "");
            formData.append("addressCity", profile?.addressCity || "");
            formData.append("addressSubDistrict", profile?.addressSubDistrict || "");
            formData.append("addressDetail", profile?.addressDetail || "");

            getPointExchange(formData)
                .then(() => {
                    modalPointRedeemSuccess.setModal(true);
                })
                .catch((error) => {
                    toast.error(error?.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (profile) {
            if (profile.hasOwnProperty("email") && profile.hasOwnProperty("mobile")) {
                if (!profile.email || !profile.mobile) {
                    modalPointRedeemProfileCheck.setModal(true);
                } else {
                    modalPointRedeemProfileCheck.setModal(false);
                }
            }
        }
    }, [profile]);

    return (
        <div className="flex flex-col gap-4">
            <When condition={isLoading || isPending}>
                <Spinner className="bg-white" size={70} />
            </When>
            <When condition={!isLoading && !isPending}>
                <div className="flex items-center justify-between">
                    <Subtitle size="large" className="font-bold text-black-100">
                        Tukarkan Poin Anda dengan Voucher Menarik
                    </Subtitle>
                    <Button variant="nude" className="md:hidden" labelClassName="flex gap-2" onClick={() => modalPointHistory.setModal(true)}>
                        <HistoryIcon />
                        Riwayat Poin
                    </Button>
                </div>
                <When condition={(data?.totalData ?? 0) < 1 || isError}>
                    <NotFoundComponent />
                </When>
                <When condition={(data?.totalData ?? 0) > 0}>
                    {data?.lists?.map((voucher) => (
                        <div key={voucher.itemId}>
                            <List title={voucher.itemName} image={voucher.banner} dataVoucher={voucher} setDataVoucher={setDataVoucher}>
                                {voucher.price}
                            </List>
                        </div>
                    ))}
                    <div className="flex items-center justify-between gap-4 overflow-hidden md:flex-col md:justify-center">
                        <PaginationInfo row={input.row} page={input.page} totalCount={data?.totalData || 0} />
                        <Pagination
                            row={input.row}
                            page={input.page}
                            totalCount={data?.totalData || 0}
                            onChange={(value) => setInput({ ...input, page: value })}
                        />
                    </div>
                </When>
            </When>
            <PointHistoryModal />
            <PointRedeemProfileCheckModal onClick={() => router.push("/profile")} />
            <PointRedeemAddressCheckModal onClick={() => router.push("/profile/address")} />
            <PointRedeemVoucherModal data={dataVoucher!} onClick={() => handleRedeem(dataVoucher!)} />
            <PointRedeemAddressConfirmationModal onClick={() => handleRedeemExchange(dataVoucher!)} />
            <PointRedeemSuccessModal onClick={() => handleClose()} />
            <PointRedeemSuccessLotteryModal date={dayjs(dataVoucher?.expDate).format("DD/MM/YYYY")} onClick={() => handleClose()} />
        </div>
    );
};

const List: React.FC<{
    children: React.ReactNode;
    title: string;
    image: string;
    dataVoucher: VoucherProps;
    setDataVoucher: (values: VoucherProps) => void;
}> = ({ children, title, image, dataVoucher, setDataVoucher }) => {
    return (
        <div className="flex items-center justify-between gap-4 p-4 overflow-hidden font-bold bg-white rounded-md shadow lg:gap-1">
            <div className="flex items-center w-full gap-4">
                <Image
                    src={image ? image : DefaultRedeemPoint}
                    fill
                    className="object-contain rounded-md"
                    parentClassName="w-28 h-16 shrink-0 sm:hidden"
                />
                <div className="flex flex-col gap-2 sm:flex-1 sm:text-sm">
                    <span className="text-black-100">{title || "Title"}</span>
                    <span className="text-primary-40">{`${children || "00"} poin`}</span>
                </div>
            </div>
            <Button onClick={() => setDataVoucher(dataVoucher)} className="sm:px-1">
                Tukar Poin
            </Button>
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

export default PointRedeem;
