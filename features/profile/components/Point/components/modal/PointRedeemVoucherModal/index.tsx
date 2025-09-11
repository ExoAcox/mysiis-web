import dayjs from "dayjs";
import { Else, If, Then, When } from "react-if";

import { VoucherProps } from "@api/point";

import useModal from "@hooks/useModal";

import DefaultRedeemPoint from "@images/bitmap/default_redeem_point.png";

import { usePointMyWallet } from "@features/profile/store";

import { Button } from "@components/button";
import { Image, Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

interface PointRedeemVoucherModalProps {
    onClick: () => void;
    data: VoucherProps;
}

const PointRedeemVoucherModal = ({ onClick, data }: PointRedeemVoucherModalProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-redeem-voucher");

    const pointMyWallet = usePointMyWallet();

    return (
        <Modal visible={modal} className="w-[35rem] p-6 rounded-xl md:w-full">
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    {""}
                </ModalTitle>
                <div className="flex flex-col w-full gap-4">
                    <div className="w-full h-48 shrink-0 md:h-44 sm:h-32">
                        <Image
                            src={data?.banner ? data?.banner : DefaultRedeemPoint}
                            fill
                            className="object-contain rounded-md"
                            parentClassName="w-full h-full"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="px-2 font-bold w-fit text-primary-60 bg-primary-20">{`${data?.price} Poin`}</span>
                        <p className="font-bold text-black-100 text-h5">{data?.itemName}</p>
                        <If condition={data?.type === "lottery"}>
                            <Then>
                                <p className="text-black-80">Undian diadakan tanggal {dayjs(data?.expDate).format("DD/MM/YYYY")}</p>
                            </Then>
                            <Else>
                                <p className="text-black-80">Berakhir tanggal {dayjs(data?.expDate).format("DD/MM/YYYY")}</p>
                            </Else>
                        </If>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: data?.desc }} className="text-black-80 whitespace-pre-wrap"></p>
                    <When condition={data?.price > (pointMyWallet.data ?? 0)}>
                        <p className="text-primary-40 font-bold text-subtitle">Poin Anda tidak mencukupi</p>
                    </When>
                    <div className="flex flex-col gap-4 w-full">
                        <Button
                            className="w-full mx-auto"
                            disabled={data?.price > (pointMyWallet.data ?? 0)}
                            onClick={() => {
                                onClick();
                                setModal(false);
                            }}
                        >
                            Redeem
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full mx-auto"
                            onClick={() => {
                                setModal(false);
                            }}
                        >
                            Batal
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PointRedeemVoucherModal;
