import SuccessState from "@images/bitmap/success_state.png";

import { Button } from "@components/button";
import { Image } from "@components/layout";
import { Title } from "@components/text";

const Default: React.FC<{ close: () => void }> = ({ close }) => {
    return (
        <div className="mx-4 mt-4 mb-2">
            <Image src={SuccessState} width={320} />
            <Title size="h3" className="mt-4 mb-2 text-center">
                Terima Kasih Atas Penilaian Anda
            </Title>
            <span className="block mb-4 text-center text-black-80">Selamat beraktivitas kembali!</span>
            <Button className="px-12 mx-auto" onClick={close}>
                Oke
            </Button>
        </div>
    );
};

export default Default;
