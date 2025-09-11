import { GetServerSideProps } from "next";
import { NewPasswordForm } from "@features/new-password/components";
import { Header } from "@features/otp-verification/components";

interface NewPasswordPageProps {
    resetPasswordToken: string;
}

const NewPasswordPage: React.FC<NewPasswordPageProps> = ({ resetPasswordToken }) => {
    return (
        <>
            <Header />

            <NewPasswordForm token={resetPasswordToken} />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { resetPasswordToken } = context.query;

    if (!resetPasswordToken) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            resetPasswordToken,
        },
    };
};

export default NewPasswordPage;
