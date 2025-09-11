import { Button } from "@components/button";
import { TextArea } from "@components/input";
import { Title } from "@components/text";

interface Props {
    reason: string;
    setReason: (value: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

const Default: React.FC<Props> = ({ reason, setReason, onSubmit, loading }) => {
    return (
        <div className="my-2">
            <Title size="h5" className="text-center">
                Berikan Alasan Anda
            </Title>
            <TextArea value={reason} onChange={setReason} className="w-[25rem] mt-4 mb-6 sm:w-full" placeholder="Masukan alasan anda disini..." />
            <Button className="px-10 mx-auto" onClick={onSubmit} disabled={!reason} loading={loading}>
                Kirim
            </Button>
        </div>
    );
};

export default Default;
