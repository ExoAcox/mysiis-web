import { RiQuestionFill, RiInformationFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { tw } from "@functions/style";

import { Profile } from "..";

interface Props {
    user: User;
    isOpen: boolean;
    logout: () => void;
}

const MobileTopSheet: React.FC<Props> = ({ user, isOpen, logout }) => {
    const router = useRouter();

    return (
        <div
            className={tw(
                "absolute bottom-0 flex flex-col h-screen w-full px-4 py-1 translate-y-full bg-white rounded-b-lg",
                isOpen ? "visible" : "invisible"
            )}
        >
            <div className="py-4">
                <Profile user={user} />
            </div>
            <List
                icon={<RiInformationFill className="w-6 h-6 fill-black-80" />}
                label="Tentang mySIIS"
                onClick={() => router.push("https://mysiis.io/about")}
            />
            aa
            <List icon={<RiQuestionFill className="w-6 h-6 fill-black-80" />} label="FAQ" onClick={() => router.push("/profile/faq")} />
            <List icon={<RiQuestionFill className="w-6 h-6 fill-black-80" />} label="SOP mySIIS" onClick={() => null} />
            <List
                icon={<RiQuestionFill className="w-6 h-6 fill-primary-40" />}
                label={<span className="text-primary-40">Keluar</span>}
                onClick={logout}
            />
            {/* <div className="absolute bottom-0 left-0 w-full h-32 rounded-b-lg shadow-lg" /> */}
        </div>
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

export default MobileTopSheet;
