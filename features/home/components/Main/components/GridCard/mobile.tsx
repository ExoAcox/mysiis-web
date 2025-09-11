import { intersection } from "@functions/common";
import { tw } from "@functions/style";

import { Link } from "@components/navigation";

const GridCard: React.FC<{ user: User; portofolio: Portofolio }> = ({ user, portofolio }) => {
    const isAllowed = portofolio.guest || intersection(user.permission_keys, [...portofolio.permission, "development"]).length;
    const Icon = portofolio.icon;

    return (
        <Link href={portofolio.path} disable={!isAllowed} className={tw("flex flex-col text-center gap-1.5", !isAllowed && "grayscale")}>
            <Icon className="mx-auto w-[3.25rem] h-[3.25rem]" />
            <label className="text-secondary-60 text-small">{portofolio.label}</label>
        </Link>
    );
};

export default GridCard;
