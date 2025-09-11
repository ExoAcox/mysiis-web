const Index = () => {
    return null;
};

export const getServerSideProps = () => {
    return {
        redirect: {
            destination: "/planning/dashboard-permit/dashboard",
            permanent: true,
        },
    };
};

export default Index;
