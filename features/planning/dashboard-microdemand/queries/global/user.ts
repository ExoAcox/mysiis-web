import { getListUser } from "@api/account/user";

import { errorHelper } from "@functions/common";

import { roleOptions } from "../../functions/common";
import { useUserStore } from "../../store/global";

interface Param {
    status: string | object;
    roles: object;
}

export const fetchListUser = async (filter: { regional: string[]; witel: string[]; vendor: string; row?: number }) => {
    const { regional, witel, vendor, row = 1000 } = filter;

    const vendors = [
        {
            label: "Enciety",
            value: "enciety"
        },
        {
            label: "Telkom Akses",
            value: "telkomakses"
        }
    ];

    const newVendor = vendors.find(item => item.value === vendor)?.label;    
    
    // get roles from roleOptions with keys surveyor-mitra and surveyor-telkom-akses
    // const roles = roleOptions.filter((role) => role.key === "surveyor-mitra" || role.key === "surveyor-telkom-akses").map((role) => role.value);
    useUserStore.setState({ data: [], totalData: 0, status: "pending", error: null });

    try {
        const users = await getListUser<Param>({
            row,
            page: 1,
            region: regional,
            branch: witel,
            vendor: newVendor,
            // roles: roles,
            status: "verified",
            orderColumn: "fullname",
            orderBy: "ASC",
        });
        useUserStore.setState({ data: users.lists, totalData: users.totalCount, status: "resolve" });
    } catch (error) {
        useUserStore.setState({ status: "reject", error: errorHelper(error) });
    }
};
