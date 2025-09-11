import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { RiInformationFill, RiQuestionFill } from "react-icons/ri";

import { getServer, session } from "@libs/session";

import useModal from "@hooks/useModal";

import { Responsive, Wrapper } from "@components/layout";
import { Profile } from "@components/navigation/NavigationBar/components";

const Notification: React.FC<{ user: User }> = ({ user }) => {
    const router = useRouter();

    const { setModal } = useModal("logout");

    return (
        <Wrapper user={user} title="Akun">
            <Responsive>
                <div className="py-4">
                    <Profile user={user} />
                </div>
                <List
                    icon={<RiInformationFill className="w-6 h-6 fill-black-80" />}
                    label="Tentang mySIIS"
                    onClick={() => router.push("https://mysiis.io/about")}
                />
                <List icon={<RiQuestionFill className="w-6 h-6 fill-black-80" />} label="FAQ" onClick={() => router.push("/profile/faq")} />
                <List
                    icon={<RiQuestionFill className="w-6 h-6 fill-primary-40" />}
                    label={<span className="text-primary-40">Keluar</span>}
                    onClick={() => setModal(true)}
                />
            </Responsive>
        </Wrapper>
    );
};

interface ListProps {
    icon: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
}

const List: React.FC<ListProps> = ({ icon, label, onClick }) => {
    return (
        <div onClick={onClick} className="flex items-center gap-3 py-4 border-t text-black-90 border-secondary-20">
            {icon}
            {label}
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, guest: true });

    return server;
});

export default Notification;
