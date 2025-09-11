import { usePolygonCountStore } from "@features/planning/dashboard-microdemand/store/polygon";
import Card from "./components/Card";
import useModal from "@hooks/useModal";

interface StatusOption {
    label: string;
    value: string;
    status?: string;
    isUpdate?: boolean;
    access?: string[];
    options?: { label: string; value: string }[];
}
export const statusOptions : StatusOption[] = [
    // { 
    //     label: "Draft", 
    //     value: "draft", 
    //     isUpdate: true, 
    //     access : ["admin-survey-super"], 
    //     options: [
    //         { label: "Approved", value: "approved" },
    //         { label: "CPP Rejected", value: "cpp-rejected" },
    //     ]
    // },
    // { label: "CPP Approved", value: "cpp_approved" },
    // { 
    //     label: "CPP Rejected", 
    //     value: "cpp_rejected",
    //     isUpdate: true,
    //     access : ["admin-survey-super"],
    //     options: [
    //         { label: "Draft", value: "draft" },
    //         { label: "Approved", value: "approved" },
    //     ]
    // },
    { 
        label: "Approved", 
        value: "approved",
        isUpdate: false,
        access : ["admin-survey-super"],
        options: [
            { label: "Draft", value: "draft" },
            { label: "CPP Rejected", value: "cpp-rejected" },
        ]
    },
    // { label: "Rejected", value: "rejected" },
    { label: "Assigned", value: "assigned" },
    // { label: "Permits Rejected", value: "permits_rejected" },
    // { label: "Permits Process", value: "permits_process" },
    // { label: "Permits Approved", value: "permits_approved" },
    { label: "Finished Survey", value: "finished_survey" },
    { label: "Pending", value: "pending" },
    { label: "Drop", value: "drop" },
    { label: "Design", value: "done" },
    { label: "All Status", value: "all_status" },
];

const CardSection: React.FC<{}> = () => {
    const [data, status] = usePolygonCountStore((state) => [state.data, state.status]);
    const modal = useModal("polygon-update-status");
    
    interface NewData {
        [key: string]: number;
    }

    const excludeStatus = ["draft", "cpp_approved", "cpp_rejected", "rejected", "permits_rejected", "permits_process", "permits_approved"];
    
    const newData: NewData = {
        ...data,
        all_status: Number(
            Object.entries(data)
                .filter(([key]) => !excludeStatus.includes(key))
                .reduce((acc, [, value]) => acc + value, 0)
        ),
    };
    
    const result  = statusOptions.map((item) => {
        return {
            label: item.label,
            value: newData[item.value],
            tipe: item.value,
            isUpdate: item.isUpdate,
            access: item.access ?? [],
        };
    });

    return (
        <div>
            <div className="grid grid-cols-7 gap-3 lg:grid-cols-2 sm:gap-2">
                {result.map(({ label, value, tipe, isUpdate, access }, index) => (
                    <Card 
                        key={index} 
                        label={label} 
                        value={value ?? 0} 
                        loading={status === "pending"} 
                        isUpdate={isUpdate} 
                        access={access}
                        onUpdate={() => {
                            modal.setModal(true);
                            modal.setData({ tipe });
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CardSection;
