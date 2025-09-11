import { Container } from "@features/planning/dashboard-microdemand/components/global";
import { FilterBar, MainTable } from "@features/planning/dashboard-permit/components/dashboard/SummarySection/components";

interface Props{
    user: User;
}

const SummarySection: React.FC<Props> = ({ user }) => {

    return (
        <Container className="mb-4">
            <div className="flex flex-col gap-4">
                <FilterBar user={user} />
                <MainTable user={user} />
            </div>
        </Container>
    );
};

export default SummarySection;
