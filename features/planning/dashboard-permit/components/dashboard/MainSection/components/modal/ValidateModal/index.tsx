import { SubmitHandler, useForm } from "react-hook-form";

import { Respondent, validateRespondent, validatePermit } from "@api/survey-demand/respondent";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";


import { InfoModal } from "@features/planning/dashboard-microdemand/components/global";

import { Button } from "@components/button";
import { TextArea, TextField } from "@components/input";
import { Modal } from "@components/layout";
import { ErrorInput, LabelInput, ModalTitle } from "@components/text";
import { toast } from "react-toastify";

interface FormValues {
    file_bakp: File;
    reason: string;
    permit_fee: string;
}

const ValidateModal: React.FC<{ refresh: () => void; user: User; category: string }> = ({ refresh, user, category }): React.ReactElement => {
    const survey = useModal<Respondent>("dashboard-survey-default");
    const { modal, data, setModal } = useModal<Respondent>("dashboard-survey-validate");
    const submit = useFetch<unknown>(null);


    const { 
        register, 
        handleSubmit,
        setError,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<FormValues>({ 
        shouldFocusError: true, 
        mode: "onBlur", 
        defaultValues: { 
            file_bakp: undefined,
            reason: "", 
            permit_fee: "",
        }
    });

    const closeModal = () => {
        survey.setModal(false);
        setModal(false);
    };

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
                setValue("file_bakp", file); // Set the file in the form state
            } catch (error) {
                console.error("Error reading file:", error);
            }
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        if (data.mysista_data?.objectid === undefined) {
            toast.error("Polygon tidak ditemukan");
            return;
        }

        if (!values.file_bakp) {
            setError("file_bakp", { type: "manual", message: "File harus diisi" });
            return;
        }

        submit.fetch(validatePermit({
            vendor: data.sourcename, 
            polygonId: data.mysista_data?.objectid, 
            file_bakp: values.file_bakp,
            reason_permits: values.reason,
            permits_fee: (Number(values.permit_fee))
        }), {
            onResolve: () => {
                closeModal();
                refresh();
                submit.fetch(validateRespondent({ surveyId: data.id, status: "valid", valid_reason: values.reason }), {
                    onResolve: () => {
                        toast.success("Berhasil Upload File BAKP");
                        closeModal();
                        refresh();
                    },
                });
            },
        });
    };


    return (
        <>
            <Modal
                className="sm:w-full max-h-[90%] overflow-y-auto"
                visible={modal}
            >
                <ModalTitle onClose={closeModal}>Validasi Izin Disetujui</ModalTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <LabelInput>Upload file BAKP</LabelInput>
                            <input
                                id="file-upload"
                                className="p-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                            <ErrorInput error={errors.file_bakp} />
                        </div>
                        <TextArea
                            label="Alasan"
                            rows={2}
                            className="w-80"
                            placeholder="Masukkan info tambahan izin disetujui."
                            controller={register("reason", {
                                required: "Alasan harus diisi",
                            })}
                            error={errors.reason}
                        />
                        <TextField 
                            className="w-80"
                            label="Biaya Izin"
                            type="number"
                            controller={register("permit_fee", {
                                required: "Biaya izin harus diisi",
                                min: { value: 0, message: "Biaya izin tidak boleh kurang dari 0" },
                            })}
                            error={errors.permit_fee}
                        />
                        <div className="flex justify-center gap-2 mt-5">
                            <Button 
                                className="text-medium py-2 px-7"
                                variant="ghost" 
                                color="secondary" 
                                disabled={submit.status === "pending"} 
                                onClick={closeModal} 
                            >
                                Batal
                            </Button>
                            <Button 
                                type="submit"
                                className="text-medium py-2 px-7" 
                                loading={submit.status === "pending"} 
                                disabled={submit.status === "pending"}
                            >
                                Kirim
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil Memverifikasi Survey
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal Memverifikasi Survey
            </InfoModal>
        </>
    );
};

export default ValidateModal;
