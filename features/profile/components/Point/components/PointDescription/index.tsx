import useModal from "@hooks/useModal";

import { Title, Subtitle } from "@components/text";
import { Button } from "@components/button";

import { PointDescriptionModal } from "@features/profile/components/Point/components/modal";

const PointDescription: React.FC = () => {
    const modalPointDescription = useModal("modal-profile-point-description");

    return (
        <div className="flex flex-col items-center justify-center gap-2 p-4">
            <Title className="text-2xl font-extrabold text-black-100">Apa itu poin MySIIS?</Title>
            <Subtitle className="flex items-center gap-1 text-sm text-black-100">
                Baca selengkapnya
                <Button
                    variant="nude"
                    className="text-base font-bold text-primary-40 p-0"
                    onClick={() => {
                        modalPointDescription.setModal(true);
                    }}
                >
                    di sini
                </Button>
            </Subtitle>
            <PointDescriptionModal />
        </div>
    );
};

export default PointDescription;
