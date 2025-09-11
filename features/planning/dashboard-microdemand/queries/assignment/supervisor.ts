import { getListUser } from "@api/account/user";

import { errorHelper } from "@functions/common";

import { getSearch, roleOptions } from "../../functions/common";
import { FilterStore, useSupervisorStore } from "../../store/assignment";
import { useUserDataStore } from "../../store/global";

interface Param {
    status: string | object;
    roleId: object;
    "lockedAdmin.lockedAt": object;
    "customdata.regional"?: object;
    "customdata.witel"?: object;
    "customdata.vendor"?: string;
    $or?: object[];
}

export const fetchListSupervisor = async (args: FilterStore, isSamePage?: string) => {
    const vendor = useUserDataStore.getState().vendor;
    const { search, regional, witel, page, row } = args;

    const param: Param = {
        status: "verified",
        roleId: { $in: [roleOptions[1].value] },
        "lockedAdmin.lockedAt": { $in: [null, ""] },
    };

    if (regional) param["customdata.regional"] = { $regex: regional, $options: "i" };
    if (witel) param["customdata.witel"] = { $in: [witel] };
    if (vendor) param["customdata.vendor"] = vendor;
    if (search) {
        param["$or"] = [getSearch("fullname", search), getSearch("email", search), getSearch("mobile", search)];
    }

    useSupervisorStore.setState({ data: [], totalData: isSamePage ? useSupervisorStore.getState().totalData : 0, status: "pending", error: null });

    try {
        const supervisors = await getListUser({ row, page, param, orderColumn: "fullname", orderBy: "ASC" });

        useSupervisorStore.setState({ data: supervisors.lists, totalData: supervisors.totalCount, status: "resolve" });
    } catch (error) {
        useSupervisorStore.setState({ status: "reject", error: errorHelper(error) });
    }
};
