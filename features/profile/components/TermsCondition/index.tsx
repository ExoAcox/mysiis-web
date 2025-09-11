import { When } from "react-if";

import { useTermsCondition } from "@features/profile/store";

import { Spinner } from "@components/loader";
import { Title } from "@components/text";

const TermsCondition = () => {
    const { data, isPending, isSuccess } = useTermsCondition();

    return (
        <div className="flex flex-col gap-4 p-8 bg-white rounded-md shadow">
            <When condition={isPending}>
                <Spinner className="fixed inset-0 z-10 bg-white" size={70} />
            </When>
            <When condition={isSuccess}>
                <Title className="text-2xl font-extrabold text-black-90">Terms & Condition</Title>
                <When condition={!!data?.description?.id}>
                    <div
                        className="overflow-auto whitespace-pre-wrap scrollbar-hidden hover:scrollbar-visible-block"
                        dangerouslySetInnerHTML={{ __html: data?.description?.id ?? "" }}
                    />
                </When>
            </When>
        </div>
    );
};

export default TermsCondition;
