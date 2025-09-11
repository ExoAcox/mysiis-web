import { createPortal } from "react-dom";

import { tw } from "@functions/style";

import AppStore from "@images/bitmap/app_store.png";
import PlayStore from "@images/bitmap/play_store.png";
import QrCode from "@images/bitmap/qrcode_download.png";

import { Image, Responsive } from "@components/layout";
import { Link } from "@components/navigation";
import { Title } from "@components/text";

const Download: React.FC<{ visible: boolean; close: () => void; screenMax?: boolean }> = ({ visible, close, screenMax }) => {
    if (!visible) return null;

    return createPortal(
        <div className="fixed left-0 z-50 w-screen h-screen top-8" onClick={() => close()}>
            <Responsive className={tw("p-8 pt-2", screenMax && "max-w-none")}>
                <div className="w-fit bg-white p-8 rounded-[1.25rem] shadow">
                    <Title mSize="h5" className="font-extrabold text-center">
                        Silakan Mendaftar Melalui Aplikasi
                    </Title>
                    <div className="flex flex-wrap items-center mt-4 gap-x-9 gap-y-4">
                        <Image src={QrCode} width={171} height={171} parentClassName="mx-auto" />
                        <div className="flex flex-col gap-2.5 mx-auto">
                            <span className="text-center text-subtitle text-black-10 md:text-large">Scan QR code atau unduh Aplikasi dari</span>
                            <div className="flex gap-3">
                                <Link href="https://play.google.com/store/apps">
                                    <Image src={PlayStore} />
                                </Link>
                                <Link href="https://apps.apple.com/id/app/mysiis/id1541573301">
                                    <Image src={AppStore} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Responsive>
        </div>,
        document.getElementById("__modal")!
    );
};

export default Download;
