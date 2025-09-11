import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { When } from "react-if";
import { toast } from "react-toastify";

import { createMask } from "@api/rpa-wibs";

import { useMasking } from "@features/support/word-transform/functions/store";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const ModalAdd = ({ visible, onClose }: Props) => {
    const wordRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLInputElement>(null);
    const masks = useMasking();

    const submit = useMutation({
        mutationFn: () =>
            createMask({
                words: wordRef.current!.value,
                label: labelRef.current!.value,
            }),
        onSuccess: (response) => {
            masks.update(
                produce(masks.data ?? [], (draft) => {
                    draft.push(response[0]);
                })
            );
            onClose();

            toast("Add word success");
        },
        onError: (error) => console.error(error),
    });

    const onSubmit = () => {
        submit.mutate();
    };

    return (
        <When condition={visible}>
            <div className="fixed inset-0 flex items-center justify-center bg-black/10">
                <div className="absolute flex flex-col gap-4 p-6 pt-4 bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <h5 className="text-lg">Add word</h5>
                        <MdClose
                            onClick={() => {
                                if (!submit.isPending) onClose();
                            }}
                            className="cursor-pointer"
                        />
                    </div>
                    <input ref={wordRef} placeholder="Input word" className="p-2 border rounded" />
                    <input ref={labelRef} placeholder="Input label" className="p-2 border rounded" />
                    <button onClick={onSubmit} className="p-2 text-sm text-white bg-red-400 rounded" disabled={submit.isPending}>
                        {submit.isPending ? "Loading..." : "Submit"}
                    </button>
                </div>
            </div>
        </When>
    );
};

export default ModalAdd;
