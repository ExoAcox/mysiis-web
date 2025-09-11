const Index = () => {
    return null;
};

export const getServerSideProps = () => {
    return {
        redirect: {
            destination: "/planning/data-demand/detail-summary",
            permanent: true,
        },
    };
};

export default Index;
