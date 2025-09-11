import WarninigIcon from "@public/images/vector/feedback_warning.svg";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";

import { tw } from "@functions/style";

const LiveChat = () => {
    const router = useRouter();
    const [chatPositionY, setChatPositionY] = useState(800);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const openChat = () => {
        setIsChatOpen(true);
        setTimeout(() => {
            setChatPositionY(0);
        }, 100);
    };

    const closeChat = () => {
        setChatPositionY(800);
        setTimeout(() => {
            setIsChatOpen(false);
        }, 400);
    };

    const bottomPositionClass = `fixed bottom-0 md:right-[1.5rem] right-[4rem]`;

    if (router.pathname !== "/home") return null;

    return (
        <div className={tw("z-[60]", bottomPositionClass)}>
            <button
                type="button"
                className={tw(
                    "bg-primary-40 hover:bg-primary-50 px-4 py-2 justify-center text-white items-center gap-2 rounded-t-lg font-bold text-medium",
                    bottomPositionClass,
                    isChatOpen ? "hidden" : "flex",
                    "md:rotate-90 md:-right-[44px] md:bottom-40 md:rounded-b-lg md:rounded-t-none"
                )}
                onClick={openChat}
            >
                <WarninigIcon />
                Live Chat
            </button>

            <div
                className={tw(
                    "w-[320px] h-[550px] rounded-t-lg overflow-hidden transition-transform ease-out duration-500 bg-white shadow-2xl",
                    bottomPositionClass
                )}
                style={{
                    transform: `translateY(${chatPositionY}px)`,
                }}
            >
                <div className="relative z-10 flex items-center justify-between text-white bg-primary-40">
                    <h4 className="p-3 font-bold">Live Chat</h4>
                    <button type="button" onClick={closeChat} className="p-3 hover:bg-primary-50">
                        <IoRemoveOutline size={30} color="white" />
                    </button>
                </div>

                <iframe src="https://sf.mysiis.io/" scrolling="no" frameBorder={0} className="h-full absolute top-0 md:w-full w-[340px]" />
            </div>
        </div>
    );
};

export default LiveChat;
