/* eslint-disable @typescript-eslint/no-unused-vars */
interface User {
    uuid: string;
    userId: string;
    fullname: string;
    profilePicture?: string;
    permission_keys: string[];
    role_keys: string[];
    regional?: string;
    witel?: string;
    vendor?: string;
    tsel_area?: string;
    tsel_region?: string;
    tsel_branch?: string;
    tsel_vendor?: string;
}

interface Portofolio {
    category: "fulfillment" | "planning" | "assurance" | "support" | "development";
    path: string;
    label: string;
    permission: string[];
    description: string;
    icon: React.ElementType;
    badge?: string;
    longLabel?: boolean;
    redirect?: boolean;
    guest?: boolean;
}

type Access = "allowed" | "unauthorized" | "forbidden";

type Device = "desktop" | "mobile" | "tablet";
