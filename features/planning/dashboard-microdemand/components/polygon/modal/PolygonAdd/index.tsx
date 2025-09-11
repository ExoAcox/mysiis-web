import { SubmitHandler, useForm } from "react-hook-form";

import useModal from "@hooks/useModal";
import useFetch from "@hooks/useFetch";

import { Modal } from "@components/layout";
import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";
import { ErrorInput, LabelInput, ModalTitle } from "@components/text";
import { storePolygon } from "@api/survey-demand/mysiista";
import { toast } from "react-toastify";

interface FormValues {
    name: string;
    target_household: number;
    surveyor: string;
    geometry: string;
}

const PolygonAddKml: React.FC<{ user: User; refresh: () => void }> = ({ user, refresh }) => {
    const { modal, setModal, data } = useModal("polygon-add-kml");
    const submit = useFetch<unknown>(null);

    const { 
        register, 
        handleSubmit, 
        setValue,
        getValues,
        setError,
        clearErrors,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormValues>({ 
        shouldFocusError: true, 
        mode: "onBlur", 
        defaultValues: { 
            geometry: "",
            name: "", 
            target_household: 0,
            surveyor: "", 
        }
    });

    const closeModal = () => {
        setModal(false);
        reset();
    };

    const handleChangeKml = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file){
            setError("geometry", { type: "manual", message: "File is required" });
            return;
        };

        if (!file.name.includes(".kml")){
            setError("geometry", { type: "manual", message: "File must be KML" });
            return;
        };

        clearErrors("geometry");

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const kml = e.target?.result as string;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(kml, "text/xml");

            const polygonElement = xmlDoc.getElementsByTagName("Polygon");        
            if (polygonElement.length < 1){
                setError("geometry", { type: "manual", message: "Polygon not found" });
                return;
                
            }

            if (polygonElement.length > 1){
                setError("geometry", { type: "manual", message: "Only 1 polygon allowed" });
                return;
            };
            
            const coordinatesElement = xmlDoc.getElementsByTagName("coordinates")[0];
            const coordinates = coordinatesElement?.textContent;
            const polygon = coordinates?.split(" ").map((c) => {
                const [lng, lat] = c.split(",");
                return { lng: parseFloat(lng), lat: parseFloat(lat) };
            }) ?? [];

            polygon.pop();

            const polygonWkt = `POLYGON((${polygon.map((c) => `${c.lng} ${c.lat}`).join(",")}))`;
            
            if (!polygonWkt){
                setError("geometry", { type: "manual", message: "Invalid polygon" });
                return;
            };

            setValue("name", file.name.replace(".kml", "")); 
            setValue("geometry", polygonWkt); 
        };
    };

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();

        if(watch("geometry") === ""){
            setError("surveyor", { type: "manual", message: "Vendor is required" });
            return;
        };

        if(watch("surveyor") === ""){
            setError("surveyor", { type: "manual", message: "Vendor is required" });
            return;
        };

        submit.fetch(storePolygon(data), {
            onResolve: () => {
                toast.success("Berhasil menambahkan polygon");
                closeModal();
                refresh();
            },
            onReject(error) {
                toast.error(error?.message);
            },
        });
    };

    return (
        <>
            <Modal
                visible={modal}
                onClose={closeModal}
            >
                <ModalTitle onClose={closeModal}>Tambah polygon</ModalTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4 mt-4 w-[24rem] flex-col">
                        <div>
                            <LabelInput className="block">Upload KML</LabelInput>
                            <input 
                                className="flex-1 w-full focus:outline-none border border-secondary-30 rounded-md p-2"
                                type="file"
                                accept=".kml,application/vnd.google-earth.kml+xml" 
                                onChange={handleChangeKml}
                            />
                            <ErrorInput error={errors.geometry} />
                        </div>
                        <TextField
                            label="Nama"
                            placeholder="Nama"
                            controller={register("name", { 
                                required: "Nama is required" 
                            })}
                            error={errors.name}
                        />
                        <TextField
                            label="Target household"
                            placeholder="Target household"
                            type="number"
                            controller={register("target_household", { 
                                required: "Target household is required", 
                                min: { value: 1, message: "household target must be more than 0" },
                                valueAsNumber: true,
                            })}
                            error={errors.target_household}
                        />
                        <Dropdown
                            id="vendor"
                            label="Vendor"
                            placeholder="Pilih Vendor"
                            value={watch("surveyor")}
                            options={[
                                { value: "telkomakses", label: "Telkom Akses" },
                                { value: "enciety", label: "Enciety" },
                            ]}
                            onChange={(value) => {
                                if (value) {
                                    clearErrors("surveyor");
                                    setValue("surveyor", value);
                                }
                            }}
                            error={errors.surveyor}
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button 
                            className="flex-1" 
                            color="secondary" 
                            variant="ghost" 
                            onClick={closeModal} 
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit"
                            className="flex-1" 
                            loading={submit.status === "pending"} 
                            disabled={submit.status === "pending"}
                        >
                            {submit.status === "pending" ? "Menambahkan..." : "Tambah"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default PolygonAddKml;
