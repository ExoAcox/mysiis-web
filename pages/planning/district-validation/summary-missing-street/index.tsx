import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { getServer, session } from "@libs/session";

import { StreetChart } from "@features/planning/district-validation/components/chart";
import { ListTable } from "@features/planning/district-validation/components/table";
import { districtBarOptions } from "@features/planning/district-validation/functions/common";

import { Wrapper } from "@components/layout";

const DistrictValidation: React.FC<{ user: User; access: Access }> = ({ user }) => {
    const router = useRouter();
    const [filter, setFilter] = useState({
        start_date: dayjs().subtract(30, "days").format("YYYY-MM-DD"),
        end_date: dayjs().format("YYYY-MM-DD"),
        page: 1,
        reason: "empty-match-ncx",
    });

    return (
        <Wrapper
            user={user}
            screenMax
            title="District Validation"
            tab={{
                value: "summary-missing-street",
                options: districtBarOptions,
                onChange: (value) => {
                    router.push(`/planning/district-validation/${value}`);
                },
            }}
            backPath="/"
        >
            <div className="px-8">
                <StreetChart filter={filter} setFilter={setFilter} />
                <ListTable filter={filter} setFilter={setFilter} />
            </div>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = getServer({
        context,
        permissions: ["mysiis.district-validation"],
    });

    return server;
});

export default DistrictValidation;
