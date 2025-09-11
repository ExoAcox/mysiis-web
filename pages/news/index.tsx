import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";

import { getServer, session } from "@libs/session";

import { Card, SkeletonCard } from "@features/home/components/News/components";
import { ErrorState } from "@features/news/components";
import { fetchAllNews } from "@features/news/queries/news";
import { useNewsStore } from "@features/news/store";

import { Responsive, Wrapper } from "@components/layout";
import { Pagination } from "@components/navigation";
import { Title } from "@components/text";

interface NewsPageProps {
    user: User;
    device: Device;
}

export const ROW_DATA = 16;

const NewsPage: React.FC<NewsPageProps> = ({ user, device }) => {
    const newsData = useNewsStore();
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchAllNews({ page, row: ROW_DATA });
    }, [page]);

    const handleChangePage = (page: number) => {
        setPage(page);
    };

    return (
        <Wrapper user={user} device={device} footer hideBack>
            <Responsive className="pt-6 pb-24">
                <When condition={["idle", "pending"].includes(newsData.status)}>
                    <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:grid-cols-1">
                        {Array.from({ length: 8 }, (_, index) => ({ id: index })).map((news) => {
                            return <SkeletonCard key={news.id} />;
                        })}
                    </div>
                </When>

                <When condition={newsData.status === "resolve"}>
                    <If condition={newsData.data?.countFiltered === 0}>
                        <Then>
                            <ErrorState title="Belum ada berita terbaru" description="Tunggu berita-berita terbaru untuk Anda" />
                        </Then>

                        <Else>
                            <Title tag="h1" size="h2">
                                Berita Terbaru
                            </Title>
                            <p>Kumpulan berita terbaru di MySIIS.</p>

                            <div className="grid grid-cols-4 gap-3 mt-4 lg:grid-cols-2 sm:grid-cols-1">
                                {newsData.data?.lists?.map((news) => {
                                    return <Card key={news.id} news={news} />;
                                })}
                            </div>

                            <Pagination
                                page={page}
                                row={ROW_DATA}
                                totalCount={newsData.data?.countFiltered as number}
                                onChange={(nextPage) => handleChangePage(nextPage)}
                                className="mx-auto mt-8"
                            />
                        </Else>
                    </If>
                </When>

                <When condition={newsData.status === "reject"}>
                    <div className="flex items-center justify-center w-full h-[15.625rem]">
                        <Title>Terjadi kesalahan :(</Title>
                    </div>
                </When>
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, guest: true });

    return server;
});

export default NewsPage;
