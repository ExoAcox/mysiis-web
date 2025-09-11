import usePortofolio from "@hooks/usePortofolio";

import { compareNumbers, intersection } from "@functions/common";

import { Title } from "@components/text";

import { GridCard } from "..";

const categoryList: { label: string; value: Portofolio["category"] }[] = [
    { label: "Fulfillment", value: "fulfillment" },
    { label: "Planning", value: "planning" },
    { label: "Support", value: "support" },
];

const Drawer: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div className="px-4 pt-2 pb-6">
            <Title size="large" className="text-secondary-60">
                Semua Portofolio
            </Title>
            <div className="w-full h-[1px] bg-black-30 mt-4 mb-6" />
            <div className="flex flex-col gap-8">
                {categoryList.map((category) => {
                    const portofolios = usePortofolio({ category: category.value });
                    const activePortofolios = portofolios.filter((portofolio) => {
                        const active = portofolio.guest || intersection(user.permission_keys, [...portofolio.permission, "development"]).length;
                        return active;
                    });

                    return (
                        <div key={category.value}>
                            <Title size="medium" className="mb-4 text-secondary-60">
                                {category.label}
                            </Title>
                            <div className="grid grid-cols-4 gap-y-2.5">
                                {activePortofolios.map((portofolio) => {
                                    return <GridCard portofolio={portofolio} key={portofolio.path} device="mobile" user={user} />;
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Drawer;
