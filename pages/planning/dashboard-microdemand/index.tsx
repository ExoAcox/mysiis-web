const Index = () => {
    return null;
};

export const getServerSideProps = () => {
    return {
        redirect: {
            destination: "/planning/dashboard-microdemand/dashboard",
            permanent: true,
        },
    };
};

export default Index;
