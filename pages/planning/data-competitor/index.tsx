const Index = () => {
    return null;
};

export const getServerSideProps = () => {
    return {
        redirect: {
            destination: "/planning/data-competitor/summary-competitor",
            permanent: true,
        },
    };
};

export default Index;
