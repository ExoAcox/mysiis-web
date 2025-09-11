const Index = () => {
    return null;
};

export const getServerSideProps = () => {
    return {
        redirect: {
            destination: "/planning/speedtest-ookla/agregat-speedtest",
            permanent: true,
        },
    };
};

export default Index;
