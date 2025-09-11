import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { MdClose } from "react-icons/md";
import { When } from "react-if";
import { toast } from "react-toastify";

import { Mask, deleteMask } from "@api/rpa-wibs";

import { useMasking } from "@features/support/word-transform/functions/store";

export interface Word extends Mask {
    index: number;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    word?: Word;
}

const ModalAdd = ({ visible, onClose, word }: Props) => {
    const masks = useMasking();

    const submit = useMutation({
        mutationFn: () => deleteMask(word!.id),
        onSuccess: () => {
            masks.update(
                produce(masks.data ?? [], (draft) => {
                    draft.splice(word!.index, 1);
                })
            );
            onClose();

            toast("Delete word success");
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
                        <h5 className="text-lg">Delete word</h5>
                        <MdClose
                            onClick={() => {
                                if (!submit.isPending) onClose();
                            }}
                            className="cursor-pointer"
                        />
                    </div>
                    <label className="text-center">
                        Are you sure to delete this word
                        <br />
                        <b>{word?.words}</b>
                    </label>
                    <button onClick={onSubmit} className="p-2 text-sm text-white bg-red-400 rounded" disabled={submit.isPending}>
                        {submit.isPending ? "Loading..." : "Delete"}
                    </button>
                </div>
            </div>
        </When>
    );
};

export default ModalAdd;
