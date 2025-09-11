import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { Case, Default, Switch, When } from "react-if";

import EmptyState from "@images/bitmap/empty_state.png";

import { useFaqAllCategoryActive, useFaqByCategory, useFaqByPopularity, useFaqBySearch } from "@features/profile/store";

import { Accordion } from "@components/accordion";
import { TextField } from "@components/input";
import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import TabBar from "@components/navigation/NavigationBar/components/TabBar";
import { Subtitle, Title } from "@components/text";

interface ListQuestion {
    question: string;
    answer: string;
}

interface TabChange {
    data: { key: string };
}

const Faq = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [categoryKey, setCategoryKey] = useState<string>("");
    const [activeOptions, setActiveOptions] = useState<string>("");
    const [listOptions, setListOptions] = useState<Option<string>[]>([]);
    const [listQuestion, setListQuestion] = useState<ListQuestion[]>([]);
    const [listQuestionPopular, setListQuestionPopular] = useState<ListQuestion[]>([]);

    const faqAllCategoryActive = useFaqAllCategoryActive();
    const faqByCategory = useFaqByCategory({
        categoryKey,
        status: "active",
    });
    const faqByPopularity = useFaqByPopularity();
    const faqBySearch = useFaqBySearch({ keyword });

    useEffect(() => {
        if (faqAllCategoryActive.data && faqAllCategoryActive.data?.length > 0) {
            setListOptions(
                faqAllCategoryActive.data
                    ?.filter((item) => item.key.includes("mysiis"))
                    .map((item) => ({
                        label: item.label?.id,
                        value: item.label?.id,
                        data: item,
                    }))
            );
            setActiveOptions(faqAllCategoryActive.data?.[0]?.label?.id);
            setCategoryKey(faqAllCategoryActive.data?.[0]?.key);
        }
    }, [faqAllCategoryActive.data]);

    useEffect(() => {
        if (faqByCategory.data && faqByCategory.data?.length > 0) {
            setListQuestion(
                faqByCategory.data?.map((item) => ({
                    question: item.label.id,
                    answer: item.answer.id,
                }))
            );
        }
    }, [faqByCategory.data, activeOptions]);

    useEffect(() => {
        if (faqBySearch.data && faqBySearch.data?.length > 0) {
            setListQuestion(
                faqBySearch.data?.map((item) => ({
                    question: item.label.id,
                    answer: item.answer.id,
                }))
            );
        }
    }, [faqBySearch.data]);

    useEffect(() => {
        if (faqByPopularity.data && faqByPopularity.data?.length > 0) {
            setListQuestionPopular(
                faqByPopularity.data?.map((item) => ({
                    question: item.label.id,
                    answer: item.answer.id,
                }))
            );
        }
    }, [faqByPopularity.data]);

    return (
        <div className="flex flex-col gap-4 p-6 rounded-md shadow bg-white overflow-hidden">
            <When condition={faqAllCategoryActive.isFetching}>
                <Spinner className="fixed inset-0 z-10 bg-white" size={70} />
            </When>
            <When condition={faqAllCategoryActive.isSuccess}>
                <Title className="text-2xl font-extrabold text-black-90">Pertanyaan yang Sering Ditanyakan</Title>
                <TextField
                    placeholder="Cari Pertanyaan Terkait mySIIS"
                    value={keyword}
                    onChange={(value) => {
                        setKeyword(value);
                        if (value) {
                            setActiveOptions("");
                        } else {
                            setActiveOptions(faqAllCategoryActive.data?.[0]?.label?.id ?? "Fulfilment");
                            setCategoryKey(faqAllCategoryActive.data?.[0]?.key ?? "mysiis-faq-fulfilment");
                        }
                    }}
                    prefix={<MdSearch />}
                    suffix={
                        keyword && (
                            <button
                                onClick={() => {
                                    setKeyword("");
                                    setActiveOptions(faqAllCategoryActive.data?.[0]?.label?.id ?? "Fulfilment");
                                    setCategoryKey(faqAllCategoryActive.data?.[0]?.key ?? "mysiis-faq-fulfilment");
                                }}
                            >
                                <MdClose title="reset-search" />
                            </button>
                        )
                    }
                    className="w-full"
                />
                <TabBar
                    tab={{
                        value: activeOptions,
                        options: listOptions,
                        onChange: (value, data) => {
                            setKeyword("");
                            setActiveOptions(value);
                            setCategoryKey((data as TabChange)?.data?.key);
                        },
                    }}
                    screenMax
                    grandParentClassName="shadow-none"
                    parentClassName="p-0 gap-0"
                    wrapperClassName="flex flex-1 justify-center"
                />
                <Switch>
                    <Case condition={faqByCategory.isError || faqBySearch.isError}>
                        <div className="flex flex-col gap-4 py-8">
                            <Image src={EmptyState} width={288} height={200} />
                            <Subtitle size="large" className="text-center font-bold text-black-100">
                                Hasil Tidak Ditemukan
                            </Subtitle>
                            <When condition={faqByPopularity.data && faqByPopularity.data?.length > 0}>
                                <Subtitle size="h3" className="mt-4 text-center font-bold text-black-100">
                                    Topik yang Sering Dicari
                                </Subtitle>
                                <Accordion data={listQuestionPopular}></Accordion>
                            </When>
                        </div>
                    </Case>
                    <Case condition={faqBySearch.data && faqBySearch.data?.length > 0}>
                        <Accordion data={listQuestion} keyword={keyword}></Accordion>
                    </Case>
                    <Case condition={faqByCategory.data && faqByCategory.data?.length > 0}>
                        <Accordion data={listQuestion}></Accordion>
                    </Case>
                    <Default>
                        <Spinner className="bg-white h-[40vh]" size={70} />
                    </Default>
                </Switch>
            </When>
        </div>
    );
};

export default Faq;
