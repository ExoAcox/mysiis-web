import { ChangePasswordHeader, ChangePasswordForm } from "./components";

const ChangePassword = () => {
    return (
        <>
            <ChangePasswordHeader />

            <main className="mt-4">
                <ChangePasswordForm />
            </main>
        </>
    );
};

export default ChangePassword;
