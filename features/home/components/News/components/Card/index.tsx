import dayjs from "dayjs";

import { News } from "@api/news";

import { convertHtmlToString } from "@functions/common";

import { Image } from "@components/layout";
import { Link } from "@components/navigation";
import { Subtitle, Title } from "@components/text";

const Card: React.FC<{ news: News }> = ({ news }) => {
    return (
        <div className="flex flex-col gap-3 bg-white p-4 rounded-[0.625rem] shadow sm:h-fit h-[15.625rem] border border-secondary-20">
            <Image src={news.image_url} alt={news.title} fill className="object-cover" parentClassName="w-full rounded-lg h-28 bg-black-30" />

            <div>
                <Title size="large" className="line-clamp-1 text-black-90">
                    {news.title}
                </Title>
                <span className="text-small text-secondary-40">{dayjs(news.updated_at || news.created_at).format("DD MMMM, YYYY")}</span>
                <div className="relative">
                    {/* show article on subtitle according width and high parent */}
                    {/* <Subtitle mSize="small" className="line-clamp-2 mt-1.5 sm:line-clamp-3">
                        {convertHtmlToString(news.article.substring(0, 200))}
                    </Subtitle> */}
                    <div className="absolute bottom-0 right-0 flex items-end gap-1 bg-white">
                        <span className="text-medium">..</span>
                        <Link href={`/news/${news.id}`} className="font-bold text-small text-primary-40">
                            Baca Selengkapnya
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
