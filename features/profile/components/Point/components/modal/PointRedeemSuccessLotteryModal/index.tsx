import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";

interface PointRedeemSuccessLotteryModalProps {
    onClick: () => void;
    date: string;
}

const PointRedeemSuccessLotteryModal = ({ onClick, date }: PointRedeemSuccessLotteryModalProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-redeem-success-lottery");

    return (
        <Modal visible={modal} className="w-fit min-w-[40vw] p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close className="cursor-pointer" onClick={() => setModal(false)} />
                </div>
                <div className="flex flex-col items-center justify-start gap-4 w-full pr-2 max-h-[70vh] overflow-auto">
                    <Title size="h4" className="font-bold text-black-100">
                        Berhasil Menukar Voucher Undian
                    </Title>
                    <p className="text-black-100">{`Silakan tunggu pengundian hadiah pada tanggal ${date}`}</p>
                    <Button
                        className="w-full mx-auto"
                        onClick={() => {
                            onClick();
                            setModal(false);
                        }}
                    >
                        Oke
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PointRedeemSuccessLotteryModal;
