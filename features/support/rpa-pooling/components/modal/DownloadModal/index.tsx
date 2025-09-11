import { useMutation } from "@tanstack/react-query";
import csvDownload from "json-to-csv-export";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Pooling, getPoolingDetail } from "@api/rpa/pooling";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";

const DownloadModal: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const { modal, data, setModal } = useModal<Pooling>("rpa-pooling-download");

    const pooling = useMutation({
        mutationFn: (poolingId: string) =>
            getPoolingDetail({ poolingId, row: 100, page: 1 }, (progressEvent) => {
                setProgress((progressEvent.loaded * 100) / progressEvent.total!);
            }),
        onSuccess: (response) => {
            setProgress(100);
            setTimeout(() => {
                csvDownload({
                    data: response,
                    filename: data.filename,
                    delimiter: ",",
                });
                setModal(false);
            }, 1000);
        },
        onError: (error) => {
            toast.error((error as DataError)?.message);
            setModal(false);
        },
    });

    useEffect(() => {
        if (modal) pooling.mutate(data.id);
    }, [modal]);

    return (
        <Modal
            visible={modal}
            onClose={() => {
                setProgress(0);
                pooling.reset();
            }}
        >
            <div className="w-[18.75rem] flex gap-2.5 items-center" data-testid="wow">
                <div className="flex flex-col flex-1 gap-1.5">
                    <div className="flex justify-between">
                        <span className="text-black-90 line-clamp-1">{data.filename}</span>
                        <label className="font-bold text-black-100 text-large">{progress}%</label>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded bg-secondary-20">
                        <div className="absolute inset-0 bg-primary-40" style={{ width: progress + "%" }} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DownloadModal;
