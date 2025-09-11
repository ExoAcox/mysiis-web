export const getStatus = (status: "REQUESTED" | "FINISHED" | "FAILED") => {
    switch (status) {
        case "REQUESTED":
            return "information";
        case "FAILED":
            return "error";
        case "FINISHED":
            return "success";
    }
};
