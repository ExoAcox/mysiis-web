import { useState } from "react";
import ContentLoader from "react-content-loader";
import { When } from "react-if";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import { tw } from "@functions/style";

import { useBanner } from "@features/home/store";

import { Image } from "@components/layout";
import { Link } from "@components/navigation";

SwiperCore.use([Pagination, Autoplay]);

const Banner = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const { data, status } = useBanner({ page: 1, row: 10, status: true });

    const getNewsId = (url: string) => {
        const urlSplit = url.split("?id=");
        return urlSplit[1];
    };

    return (
        <div>
            <When condition={["idle", "loading", "pending"].includes(status)}>
                <ContentLoader
                    uniqueKey="home-banner"
                    speed={2}
                    viewBox="0 0 1000 250"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                    className="rounded-xl"
                >
                    <rect x="0" y="0" rx="0" ry="0" width="1000" height="250" />
                </ContentLoader>
            </When>
            <When condition={status === "success"}>
                <div className="w-full">
                    <Swiper
                        loop={true}
                        autoplay={{
                            waitForTransition: true,
                            disableOnInteraction: false,
                        }}
                        pagination={true}
                        onSlideChange={(e) => {
                            let index = e.activeIndex;
                            if (e.activeIndex > data!.length) index = 1;
                            if (e.activeIndex < 1) index = data!.length;
                            setActiveIndex(index);
                        }}
                    >
                        {data?.map((banner) => {
                            return (
                                <SwiperSlide key={banner.id}>
                                    <Link href={`/news/${getNewsId(banner.url)}`}>
                                        <Image
                                            src={banner.image_url}
                                            fill
                                            className="object-contain rounded-xl"
                                            parentClassName="relative w-full h-[11.25rem] xl:h-[9.5rem] lg:h-[8.5rem] md:h-[10rem] sm:h-[7rem]"
                                        />
                                    </Link>
                                </SwiperSlide>
                            );
                        })}

                        <SwiperPagination length={data?.length ?? 0} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                    </Swiper>
                </div>
            </When>
        </div>
    );
};

const SwiperPagination: React.FC<{ length: number; activeIndex: number; setActiveIndex: (index: number) => void }> = ({
    length,
    activeIndex,
    setActiveIndex,
}) => {
    const swiper = useSwiper();

    return (
        <div className="flex justify-center gap-3 mt-3 sm:mt-0 sm:gap-2">
            {Array.from({ length }).map((_, index) => {
                return (
                    <div
                        key={`${index.toString()}`}
                        className={tw("w-2 h-2 bg-[#D9D9D9] rounded-full cursor-pointer", activeIndex === index + 1 && "bg-primary-40 sm:w-4")}
                        onClick={() => {
                            setActiveIndex(index + 1);
                            swiper.slideTo(index + 1);
                        }}
                        data-testid={`swiper-pagination-${index}`}
                    />
                );
            })}
        </div>
    );
};

export default Banner;
