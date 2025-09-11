import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { getServer, session } from "@libs/session";
import { Responsive, Wrapper } from "@components/layout";
import { Container, TitleBar } from "@features/planning/dashboard-microdemand/components/global";
import { tabOptions } from "@features/planning/dashboard-microdemand/functions/common";
import { List } from "react-content-loader";
import ListTableSupervisor from "@features/planning/dashboard-microdemand/components/supervisor/ListTable";
import { TextField } from "@components/input";
import { Button } from "@components/button";
import useModal from "@hooks/useModal";
import AddSupervisorModal from "@features/planning/dashboard-microdemand/components/supervisor/modal/AddSupervisor";

const MicrodemandAssignmentPage: React.FC<{ user: User; device: Device }> = ({ user, device }) => {
    const router = useRouter();
    const supervisorAddModal = useModal("supervisor-config-add");

    return (
        <Wrapper
            user={user}
            title="Supervisor Config"
            tab={{
                value: "supervisor",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-microdemand/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-0 pb-16">
                <TitleBar>Menu yang digunakan untuk melakukan config supervisor.</TitleBar>
                <Container>
                    <div className="flex items-center justify-between mb-2">
                        <TextField placeholder="Cari Supervisor ..." />
                        <Button variant="filled" onClick={()=> supervisorAddModal.setModal(true)}>Tambah</Button>
                    </div>
                    <ListTableSupervisor />
                </Container>

                <AddSupervisorModal />
            </Responsive>
        </Wrapper>
    );
};

// export const getServerSideProps: GetServerSideProps = session(async (context) => {
//     const server = await getServer({
//         context,
//         permissions: ["surveydemand-web"],
//     });

//     return server;
// });

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        notFound: true,
    };
};

export default MicrodemandAssignmentPage;
