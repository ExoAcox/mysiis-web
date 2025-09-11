import { GetServerSideProps } from "next";
import { parse } from "next-useragent";

const DownloadApp = () => {
    return null;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const playStore = "https://play.google.com/store/apps/details?id=com.telkom.mysiis";
    const appStore = "https://apps.apple.com/id/app/mysiis/id1541573301";

    const redirect = (destination: string) => {
        return {
            redirect: {
                destination,
                permanent: false,
            },
        };
    };

    if (req.headers["user-agent"]) {
        const ua = parse(req.headers["user-agent"]);

        if (ua.isMac || ua.isIos) {
            return redirect(appStore);
        } else {
            return redirect(playStore);
        }
    } else {
        return redirect(playStore);
    }
};

export default DownloadApp;
