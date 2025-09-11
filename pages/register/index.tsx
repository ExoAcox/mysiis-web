import Head from "next/head";

import Overlay1 from "@images/background/register_overlay_1.svg";
import Overlay2 from "@images/background/register_overlay_2.svg";
import AppStore from "@images/bitmap/app_store.png";
import PlayStore from "@images/bitmap/play_store.png";
import QrCode from "@images/bitmap/qrcode_download.png";
import MainImage from "@images/bitmap/register_main_image.jpg";
import ArrowBack from "@images/vector/arrow_back.svg";
import MySiisIcon from "@images/vector/mysiis.svg";

import { Button } from "@components/button";
import { Image } from "@components/layout";
import { Link } from "@components/navigation";

const Register = () => {
    return (
        <div className="relative flex items-center justify-center w-full min-h-screen gap-32 bg-white">
            <Head>
                <title>Register | MySIIS Web</title>
            </Head>
            <Overlay1 className="absolute top-0 left-0" />
            <Overlay2 className="absolute bottom-0 left-44" />
            <div>
                <Image src={MainImage} />
            </div>
            <div className="max-w-[32.75rem]">
                <div>
                    <MySiisIcon className="w-[200px] h-[87px]" />
                    <h1 className="text-black-100 text-[42px] font-extrabold my-4">Selamat Datang di mySIIS</h1>
                    <p className="mb-5 text-subtitle text-black-80">
                        Platform digitizing untuk CFU Consumer dengan fitur utama multi-portofolio dan multi-role
                    </p>
                    <Link href="/login">
                        <Button className="w-[9.375rem]">Masuk</Button>
                    </Link>
                </div>
                <div className="pt-8 mt-8 border-t border-secondary-30">
                    <span>
                        <b>Belum punya akun?</b> Segera daftar melalui aplikasi mySIIS
                    </span>
                    <div className="flex items-center mt-4 gap-9">
                        <Image src={QrCode} width={171} height={171} />
                        <div className="flex flex-col gap-2.5">
                            <span className="text-medium text-black-100">Scan QR code atau unduh Aplikasi dari</span>
                            <div className="flex gap-3">
                                <Link href="https://play.google.com/store/apps/details?id=com.telkom.mysiis">
                                    <Image src={PlayStore} />
                                </Link>
                                <Link href="https://apps.apple.com/id/app/mysiis/id1541573301">
                                    <Image src={AppStore} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Link className="absolute flex items-center gap-2 mb-2 font-bold left-8 top-8 text-black-90" href="/login">
                <ArrowBack />
                <span>Kembali</span>
            </Link>
        </div>
    );
};

export default Register;
