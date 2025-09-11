import { getListUser } from "@api/account/user";

import { errorHelper } from "@functions/common";

import { getOrder, getSearch, getStatus } from "../functions/user";
import { FilterStore, useUserStore } from "../store";

interface Param {
    status: string | object;
    roleId: object;
    "lockedAdmin.lockedAt": object;
    "customdata.regional"?: object;
    "customdata.witel"?: object;
    "customdata.vendor"?: string;
    $or?: object[];
}

export const fetchListUser = async (filter: FilterStore, isSamePage?: string) => {
    const { page, role, search, regional, witel, tab, row } = filter;

    const param: Param = {
        status: getStatus(tab),
        roleId: { $in: role },
        "lockedAdmin.lockedAt": tab === "block" ? { $nin: [null, ""] } : { $in: [null, ""] },
    };

    if (regional) param["customdata.regional"] = { $regex: regional, $options: "i" };
    if (witel) param["customdata.witel"] = { $regex: witel, $options: "i" };
    if (search) {
        param["$or"] = [getSearch("fullname", search), getSearch("email", search), getSearch("mobile", search)];
    }

    useUserStore.setState({ data: [], totalData: isSamePage ? useUserStore.getState().totalData : 0, status: "pending", error: null });

    try {
        const users = await getListUser<Param>({ row, page, param, orderColumn: getOrder(tab), orderBy: "DESC" });

        useUserStore.setState({ data: users.lists, totalData: users.totalCount, status: "resolve" });
    } catch (error) {
        useUserStore.setState({ status: "reject", error: errorHelper(error) });
    }
};
