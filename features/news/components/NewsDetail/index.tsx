import CalendarIcon from "@public/images/vector/calendar.svg";
import dayjs from "dayjs";
import { IoDownloadOutline } from "react-icons/io5";
import { When } from "react-if";

import { News } from "@api/news";

import { tw } from "@functions/style";

import { convertFileName } from "@features/news/functions/common";

import { Image } from "@components/layout";
import { Subtitle, Title } from "@components/text";

import style from "./style.module.css";

interface NewsDetailProps {
    news: News;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news }) => {
    return (
        <div className="grid grid-cols-12 lg:grid-row-3 grid-row-2 lg:gap-3">
            <Image
                src={news.image_url}
                alt={news.title}
                parentClassName="lg:col-span-12 col-span-5 lg:row-span-1 row-span-2 sm:h-32 lg:h-60 h-52"
                className="object-cover rounded-lg"
                fill
            />

            <div className="flex flex-wrap col-span-7 ml-8 lg:col-span-12 lg:ml-0 lg:order-first">
                <div className="flex gap-3">
                    <Subtitle className="px-2 rounded-md bg-secondary-20 text-black-80" size="medium">
                        Poin
                    </Subtitle>
                    <div className="flex items-center gap-2">
                        <CalendarIcon />
                        <Subtitle size="medium">{dayjs(news.created_at).format("DD MMMM YYYY")}</Subtitle>
                    </div>
                </div>

                <div className="flex-1 lg:order-last lg:mt-1">
                    <Subtitle size="medium" className="mx-2 lg:hidden">
                        •
                    </Subtitle>
                    <Subtitle size="medium" className="italic text-black-80">
                        Updated: {dayjs(news.updated_at).format("DD MMMM YYYY")}
                    </Subtitle>
                </div>

                <Title tag="h1" size="h1" mSize="h5" className="w-full mt-2 md:mt-4">
                    {news.title}
                </Title>
            </div>

            <div className="col-span-7 mt-2 ml-8 lg:col-span-12 lg:ml-0">
                <div className={tw(style.content, "flex flex-col gap-2 mt-2")} dangerouslySetInnerHTML={{ __html: news.article }} />

                <When condition={news.doc && news.doc_urls.length}>
                    <div className="mt-5">
                        <Title tag="h3" className="mb-3" mSize="large">
                            Download Files
                        </Title>
                        {news.doc_urls?.map((result, index) => (
                            <a href={result} target="_blank" rel="noopener noreferrer" download key={`${result}.${index.toString()}`}>
                                <div className="flex items-center justify-between gap-3 p-2 border rounded-md border-black-60 hover:bg-black-30">
                                    <p>{convertFileName(news.doc)}</p>
                                    <IoDownloadOutline size={20} color="#ee3124" />
                                </div>
                            </a>
                        ))}
                    </div>
                </When>
            </div>
        </div>
    );
};

export default NewsDetail;
