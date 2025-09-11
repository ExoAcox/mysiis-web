import { Title, Subtitle } from "@components/text";

const ChangePasswordHeader = () => {
    return (
        <header>
            <Title className="text-h2">Ubah Password</Title>
            <Subtitle className="mt-2 text-black-70" size="large">
                Silakan ubah password untuk keamanan akun Anda
            </Subtitle>
        </header>
    );
};

export default ChangePasswordHeader;
