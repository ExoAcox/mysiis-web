const Index = () => {
    return null;
};

export const getServerSideProps = () => {
    return {
        redirect: {
            destination: "/planning/district-validation/maps-summary",
            permanent: true,
        },
    };
};

export default Index;
