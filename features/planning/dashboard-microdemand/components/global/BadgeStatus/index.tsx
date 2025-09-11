import { Badge } from "@components/badge";

const BadgeStatus: React.FC<{ status: string }> = ({ status }) => {
    let type: "error" | "default" | "success" | "information" = "default";

    if (status === "draft") {
        type = "default";
    } else if (status === "approved") {
        type = "success";
    } else if (status === "rejected") {
        type = "error";
    } else {
        type = "information";
    }
    
    return <Badge variant={type}>{status !== "done" ? status : "design"}</Badge>;
};

export default BadgeStatus;