import { When } from "react-if";

import { tw } from "@functions/style";

import { useNews } from "@features/home/store";

import { Link } from "@components/navigation";
import { Title } from "@components/text";

import { Card, SkeletonCard } from "./components";

const News: React.FC<{ device?: Device }> = ({ device }) => {
    const isMobile = device === "mobile";
    const { data, isPending, isSuccess, isError } = useNews({ page: 1, row: isMobile ? 3 : 4, status: true });

    return (
        <When condition={!isError}>
            <div className={tw("py-6", !isMobile && "mt-10")}>
                <div className="flex items-center justify-between mb-1">
                    <Title className="font-extrabold text-black-80 sm:text-large">Berita Terbaru</Title>
                    <Link href="/news" className="font-bold text-primary-40 text-medium sm:text-small">
                        Lihat Semua Berita
                    </Link>
                </div>
                <When condition={isPending}>
                    <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:grid-cols-1">
                        {Array.from({ length: isMobile ? 3 : 4 }, (_, index) => ({ id: index })).map((news) => {
                            return <SkeletonCard key={news.id} />;
                        })}
                    </div>
                </When>
                <When condition={isSuccess}>
                    <div className="overflow-auto">
                        <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:grid-cols-1 max-w-screen">
                            {data?.lists.map((news) => {
                                return <Card key={news.id} news={news} />;
                            })}
                        </div>
                    </div>
                </When>
            </div>
        </When>
    );
};

export default News;
