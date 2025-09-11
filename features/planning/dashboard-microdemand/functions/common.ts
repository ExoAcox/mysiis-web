import { getSupervisor } from "@api/survey-demand/supervisor";

import { intersection } from "@functions/common";

import { useUserDataStore } from "../store/global";

export const tabOptions = (user: User) => {
    if (intersection(user.role_keys, ["admin-survey-nasional"]).length) {
        return [
            { label: "Dashboard", value: "dashboard" },
            { label: "Polygon", value: "polygon" },
            // { label: "Supervisor", value: "supervisor" },
        ];
    } else if (intersection(user.role_keys, ["admin-survey-area"]).length) {
        return [
            { label: "Dashboard", value: "dashboard" },
            { label: "Polygon", value: "polygon" },
        ];
    } else if (intersection(user.role_keys, ["admin-survey-region"]).length) {
        return [
            { label: "Dashboard", value: "dashboard" },
            { label: "Report", value: "report" },
            { label: "Polygon", value: "polygon" },
        ];
    } else if (intersection(user.role_keys, ["admin-survey-branch"]).length) {
        return [
            { label: "Dashboard", value: "dashboard" },
            { label: "Assignment", value: "assignment" },
            { label: "Report", value: "report" },
            { label: "Polygon", value: "polygon" },
            { label: "Pre Survey", value: "pre-survey" },
        ];
    } else if (intersection(user.role_keys, ["supervisor-survey-mitra"]).length) {
        return [
            { label: "Dashboard", value: "dashboard" },
            { label: "Assignment", value: "assignment" },
            { label: "Report", value: "report" },
            { label: "Polygon", value: "polygon" },
        ];
    } else {
        return [
            // { label: "Dashboard", value: "dashboard" },
        ];
    }
};

export const roleOptions = [
    {
        key: "surveyor-mitra",
        label: "Surveyor Mitra",
        value: "e8c5d8e6-251a-42c4-a7e7-48ad6a433724",
    },
    {
        key: "surveyor-telkom-akses",
        label: "Surveyor TA",
        value: "0e9a6bdd-c586-4406-ad8a-5ae92bdb0641",
    },
    {
        key: "surveyor",
        label: "Surveyor",
        value: "bdd18515-4660-452a-9d92-453a350e8e02",
    },
    {
        key: "supervisor",
        label: "Supervisor",
        value: "49a4826a-6e53-4865-8f8d-2b4742e7d636",
    },
    {
        key: "admin-branch",
        label: "Admin Branch",
        value: "b394d9ed-1d16-4a68-8e37-becd09f646f4",
    },
    {
        key: "admin-region",
        label: "Admin Region",
        value: "bc6ab436-5124-44f7-ae16-d58c1365ccb7",
    },
    {
        key: "admin-area",
        label: "Admin Area",
        value: "a8fc400e-2fcc-428a-89d3-3a01e7364811",
    },
];

export const getUserData = async (user: User) => {
    const roles: string[] = user.role_keys;

    if (roles.includes("admin-survey-nasional")) {
        useUserDataStore.setState({
            regional: "",
            witel: [],
            vendor: "",
            role: "admin-survey-nasional",
        });

        return { 
            regional: user.tsel_region !== "National" ? user.tsel_region : "",
        };
    } else if (roles.includes("admin-survey-region")) {
        useUserDataStore.setState({
            regional: user.tsel_region !== "National" ? user.tsel_region : "",
            witel: [],
            vendor: "",
            role: "admin-survey-region",
        });

        return { 
            regional: user.tsel_region !== "National" ? user.tsel_region : "",
        };
    } else if (roles.includes("admin-survey-branch")) {
        useUserDataStore.setState({
            regional: user.tsel_region !== "National" ? user.tsel_region : "",
            witel: user.tsel_branch && user.tsel_branch !== "All" ? [user.tsel_branch] : [],
            vendor: "",
            role: "admin-survey-branch",
        });

        return {
            regional: user.tsel_region !== "National" ? user.tsel_region : "",
            witel: user.tsel_branch !== "All" ? user.tsel_branch : "",
        };
    } else if (roles.includes("admin-survey-mitra")) {
        useUserDataStore.setState({
            regional: "",
            witel: [],
            vendor: user.vendor ?? "",
            role: "admin-survey-mitra",
        });

        return { vendor: user.vendor ?? "" };
    } else if (roles.includes("supervisor-survey-mitra")) {
        try {
            const supervisor = await getSupervisor(user.userId);

            useUserDataStore.setState({
                regional: supervisor.mysista_treg,
                witel: supervisor.mysista_witel || [],
                vendor: supervisor.mysista_source,
                role: "supervisor-survey-mitra",
            });

            return {
                regional: supervisor.mysista_treg,
                witel: supervisor.mysista_witel.length === 1 ? supervisor.mysista_witel[0] : "",
                vendor: supervisor.mysista_source,            };
        } catch {
            useUserDataStore.setState({
                regional: "undefined",
                witel: [],
                vendor: "undefined",
                role: "supervisor-survey-mitra",
            });

            return {
                regional: "undefined",
                witel: "undefined",
                vendor: "undefined",
            };
        }
    } else {
        useUserDataStore.setState({
            regional: "undefined",
            witel: [],
            vendor: "undefined",
            role: "supervisor-survey-mitra",
        });

        return {
            regional: "undefined",
            witel: "undefined",
            vendor: "undefined",
        };
    }
};

export const getSearch = (type: string, value: string) => {
    return { [type]: { $regex: value, $options: "i" } };
};

export const optionsStatus = [
    { label: "Semua Status", value: "" },
    // { label: "Draft", value: "draft" },
    // { label: "CPP Rejected", value: "cpp-rejected" },
    // { label: "CPP Approved", value: "cpp-approved" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Assigned", value: "assigned" },
    // { label: "Permit Rejected", value: "permits-rejected" },
    // { label: "Permits Proses", value: "permits-process" },
    // { label: "Permits Approved", value: "permits-approved" },
    { label: "Finish Survey", value: "finished-survey" },
    { label: "Pending", value: "pending" },
    { label: "Drop", value: "drop" },
    { label: "Design", value: "done" },
];

export const optionsStatusPermit = [
    { label: "Semua", value: "" },
    { label: "Not yet assigned", value: "not yet assigned" },
    { label: "Assigned", value: "assigned" },
    { label: "Finish Permit", value: "finished-permits" },
    { label: "Permit Prosses", value: "prosses" },
    { label: "Permit Rejected", value: "rejected" },
    { label: "Permit Approved", value: "approved" },
    { label: "Done", value: "done" },
];