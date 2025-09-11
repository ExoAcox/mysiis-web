import { intersection } from "@functions/common";
import { tw } from "@functions/style";

import { Link } from "@components/navigation";
import { Subtitle, Title } from "@components/text";

const GridCard: React.FC<{ user: User; portofolio: Portofolio }> = ({ user, portofolio }) => {
    const isAllowed = portofolio.guest || intersection(user.permission_keys, [...portofolio.permission, "development"]).length;
    const Icon = portofolio.icon;

    return (
        <Link
            href={portofolio.path}
            target={portofolio.redirect ? "_blank" : ""}
            disable={!isAllowed}
            className={tw(
                "flex text-center bg-white gap-4 border border-black-20 h-[8rem] w-[23.375rem] p-4 shadow-sm rounded-[1.25rem] items-center",
                isAllowed ? "hover:scale-105" : "cursor-not-allowed grayscale"
            )}
        >
            <Icon className="w-24 h-24 shrink-0" />
            <div>
                <Title size="large" className="mt-auto mb-1 text-start">
                    {portofolio.label}
                </Title>
                <Subtitle size="small" className="line-clamp-2 text-start">
                    {portofolio.description}
                </Subtitle>
            </div>
        </Link>
    );
};

export default GridCard;
