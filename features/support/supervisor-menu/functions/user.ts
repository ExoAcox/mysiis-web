export const getStatus = (tab: string) => {
    switch (tab) {
        case "pending":
            return "active";
        case "reject":
            return "rejected";
        case "block":
            return { $in: ["active", "verified", "rejected"] };
        default:
            return "verified";
    }
};

export const getSearch = (type: string, value: string) => {
    return { [type]: { $regex: value, $options: "i" } };
};

export const getOrder = (tab: string) => {
    if (tab === "verified") {
        return "verifiedData.requestAt";
    } else {
        return "activatedData.requestAt";
    }
};

export const getRole = (roles: string[]) => {
    if (roles.includes("supervisor-salesforce")) {
        return ["5f377b5b-6b69-4eed-a603-7ed7feffaee1"];
    } else if (roles.includes("supervisor-teknisi")) {
        return ["8514953e-0b1d-454c-a0fe-d619d19e101b"];
    } else if (roles.includes("supervisor-obc")) {
        return ["8676dd0e-3e39-4062-9203-4769dabaf81f", "36ef3bbb-b14b-443d-989e-28c11fa0b01b"];
    } else if (roles.includes("supervisor-obc-tam")) {
        return ["5fc7fad6-7947-4d5e-8a78-fe262fc8ca8a"];
    } else if (roles.includes("supervisor-agent")) {
        return ["36ef3bbb-b14b-443d-989e-28c11fa0b01b"];
    } else if (roles.includes("supervisor-agent-myih")) {
        return ["c3d64642-6ec8-4b33-b98d-29815b468f29"];
    } else if (roles.includes("supervisor-assurance-ebis")) {
        return ["a4217202-3ac8-4fd3-bc68-1810d22323f5"];
    }
};
