import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { When } from "react-if";

import { getServer, session } from "@libs/session";

import { News } from "@api/news";

import { ErrorState, NewsDetail, SkeletonNewsDetail } from "@features/news/components";
import { fetchDetailNews } from "@features/news/queries/news";
import { useDetailNewsStore } from "@features/news/store";

import { Responsive, Wrapper } from "@components/layout";

interface NewsDetailPageProps {
    user: User;
    device: Device;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ user, device }) => {
    const router = useRouter();
    const newsData = useDetailNewsStore();

    useEffect(() => {
        const newsId = router.query?.newsId as string;
        fetchDetailNews(newsId);
    }, []);

    return (
        <Wrapper user={user} device={device} footer hideBack>
            <Responsive className="pt-6 pb-24">
                <When condition={["idle", "pending"].includes(newsData.status)}>
                    <SkeletonNewsDetail />
                </When>

                <When condition={newsData.status === "resolve"}>
                    <NewsDetail news={newsData.data as News} />
                </When>

                <When condition={newsData.status === "reject" && newsData.error?.code === 404}>
                    <ErrorState title="Berita tidak ditemukan" description="Pastikan berita yang Anda cari tersedia" />
                </When>
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, guest: true });

    return server;
});

export default NewsDetailPage;
