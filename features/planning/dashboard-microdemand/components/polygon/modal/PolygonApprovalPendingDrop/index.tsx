import { deletePolygon, uploadBakStatusPolygon } from "@api/survey-demand/mysiista";
import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";
import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { ErrorInput, LabelInput, ModalTitle, Subtitle, Title } from "@components/text";
import { TextArea } from "@components/input";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
    file_bakp: File;
    reason: string;
    reason_category: string;
}

const reasonCategoryOptions = [
    "Low Potential",
    "High CPP",
    "Covered by Other Project",
    "Duplicate Order",
    "BTS Radio (Site non-Fiber)",
    "Customer Cancel",
    "Narrow Path (jalan sempit)",
    "High Community Case (Comcase)",
    "Other",
];

export const ConfirmApprovalPendingDrop: React.FC<{ 
    action: "Drop" | "Pending" | "Approve" | "Assign" | "Aktifkan",
    status: "approved" | "assigned" | "pending" | "drop",
    initialStatus: string,
    polygon_id: number;
    submit: ReturnType<typeof useFetch>,
    refresh: () => void;
}> = ({ polygon_id, action, status, initialStatus, submit, refresh }) => {

    const { modal, setModal } = useModal("modal-confirm-pending-drop");
    const modalDetail = useModal("polygon-approval");

    const { 
        register, 
        handleSubmit,
        setError,
        setValue,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ 
        shouldFocusError: true, 
        mode: "onBlur", 
        defaultValues: { 
            file_bakp: undefined,
            reason: "", 
            reason_category: "",
        }
    });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files){
            setError("file_bakp", { type: "manual", message: "File harus diisi" });
            return;
        }

        if(files[0].type !== "application/pdf"){
            setError("file_bakp", { type: "manual", message: "File harus berformat pdf" });
            return;
        }        
        
        const file = files[0];
        if (file) {
            try {
                clearErrors("file_bakp");
                setValue("file_bakp", file);
            } catch (error) {
                console.error("Error reading file:", error);
            }
        }
    };

    const closeModal = () => {
        setModal(false);
        reset();
        clearErrors(["file_bakp", "reason", "reason_category"]);
    }

    const onSubmit: SubmitHandler<FormValues> = async (values) => {    
        if(!values.file_bakp){
            setError("file_bakp", { type: "manual", message: "File harus diisi" });
            return;
        }
        
        if(initialStatus === "approved" && status === "drop") {
            submit.fetch(deletePolygon({ id: polygon_id }), {
                onResolve: () => {
                    closeModal();
                    modalDetail.setModal(false);
                    refresh();
                    toast.success("Polygon berhasil dihapus");
                },
                onReject: (error) => {
                    toast.error(error?.message);
                }
            });
        } else {
            submit.fetch(uploadBakStatusPolygon({
                polygonId: polygon_id,
                status: status as "pending" | "drop",
                file: values.file_bakp!,
                reason: values.reason,
            }), {
                onResolve: () => {
                    closeModal();
                    modalDetail.setModal(false);
                    refresh();
                    toast.success("Berhasil mengubah status polygon");
                },
                onReject: (error) => {
                    toast.error(error?.message);
                }
            });
        }
    };

    return (
        <Modal visible={modal} className="w-[380px] sm:w-full">
            <ModalTitle onClose={closeModal}>&nbsp;</ModalTitle>
            <div className="my-2">
                <Title size="large">Apakah yakin ingin {action} polygon?</Title>
                <Subtitle size="small">Mohon pastikan BA {action} sudah disepakati Telkomsel dan TA karena hasil survey valid untuk poligon {action} tidak dihitung dalam rekon.</Subtitle>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">                        
                        <LabelInput>Upload file BAK</LabelInput>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="p-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorInput error={errors.file_bakp} />
                    </div>
                    <div className="flex flex-col"> 
                        <LabelInput>Kategori Alasan</LabelInput>                       
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            {...register("reason_category", {
                                required: "Kategori alasan harus diisi",
                            })}
                        >
                            <option value="">
                                Pilih Kategori Alasan
                            </option>
                            {reasonCategoryOptions.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                        <ErrorInput error={errors.reason_category} />
                    </div>
                    <TextArea
                        label="Alasan"
                        rows={2}
                        className="w-full"
                        placeholder={`Masukkan alasan kenapa ${action.toLowerCase()} polygon ini.`}
                        controller={register("reason", {
                            required: "Alasan harus diisi",
                        })}
                        error={errors.reason}
                    />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex justify-end gap-4 mt-6">
                        <Button onClick={closeModal} variant="ghost" className="flex-1">
                            Batal
                        </Button>
                        <Button type="submit" className="flex-1">
                            Kirim
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
