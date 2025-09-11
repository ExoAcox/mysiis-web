import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { ErrorInput, LabelInput, ModalTitle } from "@components/text";

import { getBranchTsel, getRegional, getRegionTsel, getWitel } from "@api/district/network";
import { getListUserSupervisor, User } from "@api/account/user";

interface FormValues {
    id: string;
    sourcename: string;
    area: string;
    region: string;
    branch: string;
    regional: string;
    witel: string;
};

const areaOptions = [
    { value: "AREA 1", label: "AREA 1" },
    { value: "AREA 2", label: "AREA 2" },
    { value: "AREA 3", label: "AREA 3" },
    { value: "AREA 4", label: "AREA 4" },
];

const vendorOptions = [
    { value: "telkomakses", label: "Telkom Akses" },
    { value: "enciety", label: "Enciety" },
];

const AddSupervisorModal: React.FC<{ user?: User }> = () => {
    const { modal, setModal } = useModal("supervisor-config-add");
    const [selectedBranch, setSelectedBranch] = useState<string[]>([]);
    const [selectedWitel, setSelectedWitel] = useState<string[]>([]);
    
    const { 
        register, 
        handleSubmit,
        setError,
        setValue,
        getValues,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ 
        shouldFocusError: true, 
        mode: "onBlur", 
        defaultValues: { 
            id: "",
            sourcename: "", 
            region: "",
            branch: "",
            regional: "",
            witel: "",
        }
    });

    const supervisorStore = useFetch<User[]>([]);
    const regionStore = useFetch<string[]>([]);
    const branchStore = useFetch<string[]>([]);
    const regionalStore = useFetch<string[]>([]);
    const witelStore = useFetch<string[]>([]);

    const regionList: Option<string>[] = useMemo(() => {
        return regionStore.data.map((item) => ({ value: item, label: item }));
    }, [regionStore]);

    const branchList: Option<string>[] = useMemo(() => {
        return branchStore.data.map((item) => ({ value: item, label: item }));
    }, [branchStore]);

    const regionalList: Option<string>[] = useMemo(() => {
        return regionalStore.data.map((item) => ({ value: item, label: item }));
    }, [regionalStore]);

    const witelList: Option<string>[] = useMemo(() => {
        return witelStore.data.map((item) => ({ value: item, label: item }));
    }, [witelStore]);

    useEffect(() => {
        if(modal){
            getRegional().then((data) => {
                regionalStore.setData(data);
            });

            getListUserSupervisor().then((data) => {
                supervisorStore.setData(data.lists);
            });
        }
    }, []);

    const handleAddSelected = (type: string, value: string) => {
        if(value === "") return;
        
        if (type === "witel") {
            if(selectedWitel.includes(value)) return;
            setSelectedWitel([...selectedWitel, value]);
        } else if (type === "branch") {
            if(selectedBranch.includes(value)) return;
            setSelectedBranch([...selectedBranch, value]);
        }
    }
    
    const handleRemoveSelected = (type: string, value: string) => {
        if(value === "") return;

        if (type === "witel") {
            const filtered = selectedWitel.filter((item) => item !== value);
            setSelectedWitel(filtered);

            if(filtered.length === 0) {
                setError("witel", {
                    type: "manual",
                    message: "Witel harus diisi",
                });
                setValue("witel", "");
            }
        } else if (type === "branch") {
            const filtered = selectedBranch.filter((item) => item !== value);
            setSelectedBranch(filtered);

            if(filtered.length === 0) {
                setError("branch", {
                    type: "manual",
                    message: "Branch harus diisi",
                });
                setValue("branch", "");
            }
        }
    }

    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => {
        setModal(false);
        setSelectedBranch([]);
        setSelectedWitel([]);
        regionStore.setData([]);
        branchStore.setData([]);
        reset();
        clearErrors(["id", "sourcename", "region", "branch", "regional", "witel"]);
    };

    const onSubmit: SubmitHandler<FormValues> = async (values) => {    
        console.log("values", values);
    };

    return (
        <>
            <Modal
                visible={modal}
                loading={loading}
            >
                <ModalTitle onClose={closeModal}>Tambah Supervisor Config</ModalTitle>
                <form className="w-[28rem]" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4 mt-4 flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <LabelInput>Supervisor</LabelInput>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        {...register("id", {
                                            required: "Supervisor harus diisi",
                                        })}
                                    >
                                        <option value="">
                                            Pilih Supervisor
                                        </option>
                                        {supervisorStore.data.map((item) => (
                                            <option key={item.userId} value={item.userId}>
                                                {item.fullname}
                                            </option>
                                        ))}
                                    </select>
                                <ErrorInput error={errors.id} />
                            </div>
                            <div className="w-full">
                                <LabelInput>Vendor</LabelInput>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        {...register("sourcename", {
                                            required: "Vendor harus diisi",
                                        })}
                                    >
                                        <option value="">
                                            Pilih Vendor
                                        </option>
                                        {vendorOptions.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                <ErrorInput error={errors.sourcename} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <LabelInput>Area</LabelInput>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    {...register("area", {
                                        required: false,
                                    })}
                                    onChange={(e)=> {
                                        getRegionTsel({ area: e.target.value }).then((data) => {
                                            regionStore.setData(data);
                                        });
                                    }}
                                >
                                    <option value="">
                                        Pilih Area
                                    </option>
                                    {areaOptions.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <ErrorInput error={errors.area} />
                            </div>

                            <div className="w-full">
                                <LabelInput>Region</LabelInput>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    {...register("region", {
                                        required: "Region harus diisi",
                                    })}
                                    onChange={(e)=> {
                                        getBranchTsel({ region: e.target.value }).then((data) => {
                                            branchStore.setData(data);
                                        });
                                        setSelectedBranch([]);
                                    }}
                                    disabled={regionList.length === 0}
                                >
                                    <option value="">
                                        Pilih Region
                                    </option>
                                    {regionList.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <ErrorInput error={errors.region} />
                            </div>
                            <div className="w-full">
                                <LabelInput>Branch</LabelInput>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    {...register("branch", {
                                        required: selectedBranch.length === 0 ? "Branch harus diisi" : false,
                                    })} 
                                    onChange={(e)=> handleAddSelected("branch", e.target.value)}
                                    disabled={branchList.length === 0}
                                >
                                    <option value="">
                                        Pilih Branch
                                    </option>
                                    {branchList.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <ErrorInput error={errors.branch} />
                            </div>
                        </div>
                        {selectedBranch.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedBranch.map((item) => {
                                    return (
                                        <ItemSelected key={item} value={item} type="branch" onRemove={()=> handleRemoveSelected("branch", item)} />
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <LabelInput>Regional</LabelInput>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    {...register("regional", {
                                        required: "Regional harus diisi",
                                    })}
                                    onChange={(e)=> {
                                        getWitel({ regional: e.target.value }).then((data) => {
                                            witelStore.setData(data);
                                        });
                                        setSelectedWitel([]);
                                    }}
                                >
                                    <option value="">
                                        Pilih Regional
                                    </option>
                                    {regionalList.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <ErrorInput error={errors.regional} />
                            </div>
                            <div className="w-full">
                                <LabelInput>Witel</LabelInput>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    {...register("witel", {
                                        required: selectedWitel.length === 0 ? "Branch harus diisi" : false,
                                    })}
                                    onChange={(e)=> handleAddSelected("witel", e.target.value)}
                                    disabled={witelList.length === 0}
                                >
                                    <option value="">
                                        Pilih Witel
                                    </option>
                                    {witelList.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <ErrorInput error={errors.witel} />
                            </div>
                        </div>
                        {selectedWitel.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedWitel.map((item) => {
                                    return (
                                        <ItemSelected key={item} value={item} type="witel" onRemove={()=> handleRemoveSelected("witel", item)} />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button color="secondary" variant="ghost" className="flex-1" onClick={closeModal} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" className="flex-1" loading={loading} disabled={loading}>
                            Tambah
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
};

export default AddSupervisorModal;

const ItemSelected: React.FC<{ value: string; type: string; onRemove: (type:string, value: string) => void }> = ({ value, type, onRemove }) => {
    return (
        <div className="flex items-center gap-4 border pl-2">
            <span>{value}</span>
            <button className="border rounded-sm px-2 py-1" onClick={() => onRemove(type, value)}>
                X
            </button>
        </div>
    );
};