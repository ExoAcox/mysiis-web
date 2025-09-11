
import { Container } from "@features/planning/dashboard-microdemand/components/global";
import { Title } from "@components/text";
import { FilterBar, MainTable } from "@features/planning/dashboard-microdemand/components/dashboard/SummarySection/components";

interface Props{
    user: User;
}

const SummarySection: React.FC<Props> = ({ user }) => {

    return (
        <Container>
            <div className="flex items-center justify-between mb-5 sm:mb-2.5 sm:flex-col sm:items-start sm:gap-2">
                {/* <Title size="h2" mSize="h5" className="font-extrabold">
                    Summary Survey
                </Title> */}
            </div>
            <div className="flex flex-col gap-4">
                <FilterBar user={user} />
                <MainTable user={user} />
            </div>
        </Container>
    );
};

export default SummarySection;
