import { MdClose, MdSearch } from "react-icons/md";

import { GetAllSentimentFeedback } from "@api/multilayer/sentiment-feedback";

import useMediaQuery from "@hooks/useMediaQuery";
import useModal from "@hooks/useModal";

import UploadIcon from "@images/vector/upload_button.svg";

import { TestModal, UploadModal } from "@features/planning/sentiment-feedback/components/modal";
import { statePrediction } from "@features/planning/sentiment-feedback/functions/table";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";

interface Props {
    input: GetAllSentimentFeedback;
    setInput: (value: GetAllSentimentFeedback) => void;
    textDefault: string;
    setTextDefault: (value: string) => void;
    totalData: number;
    refresh: () => void;
    user: User;
}

const SentimentFeedbackFilter = ({ input, setInput, textDefault, setTextDefault, totalData, refresh, user }: Props): JSX.Element => {
    const modalTest = useModal("modal-sentiment-feedback-test");
    const modalUpload = useModal("modal-sentiment-feedback-upload");

    const { isMobile } = useMediaQuery(767, { debounce: false });

    return (
        <div className="w-full h-full">
            <div className="flex flex-nowrap items-end justify-between gap-4 lg:pb-2 md:flex-wrap">
                <div className="flex gap-4 md:w-full">
                    <TextField
                        label={isMobile ? "" : "Cari"}
                        placeholder="Cari User ID"
                        value={textDefault}
                        onChange={(value) => {
                            if (value !== "") {
                                setInput({ ...input, userid: value, page: 1 });
                            } else {
                                setInput({ ...input, userid: null });
                            }
                            setTextDefault(value);
                        }}
                        prefix={<MdSearch />}
                        suffix={
                            textDefault && (
                                <button
                                    onClick={() => {
                                        setInput({ ...input, userid: null });
                                        setTextDefault("");
                                    }}
                                >
                                    <MdClose title="reset-search" />
                                </button>
                            )
                        }
                        className="w-full overflow-hidden"
                        parentClassName="w-72 lg:w-full order-1 md:order-2"
                    />
                    <Dropdown
                        id="filter-sentiment-feedback-table-prediction"
                        label={isMobile ? "" : "Prediksi"}
                        placeholder="Pilih Prediksi"
                        value={input.prediction || ""}
                        options={statePrediction}
                        onChange={(value) => {
                            setInput({ ...input, prediction: value ? value : null, page: 1 });
                        }}
                        className="w-full xs:w-24 xs:overflow-hidden"
                        parentClassName="order-2 md:order-1"
                        disabled={!input?.prediction && totalData <= 0}
                    />
                </div>
                <div className="flex gap-4 text-sm md:w-full md:overflow-hidden">
                    <Button onClick={() => modalTest.setModal(true)} className="py-3 px-4 w-fit md:flex-1 xs:px-0" variant="ghost">
                        Test API
                    </Button>
                    <Button onClick={() => modalUpload.setModal(true)} className="py-3 px-4 w-fit md:flex-1 xs:px-0" labelClassName="gap-2">
                        <UploadIcon />
                        Upload CSV
                    </Button>
                </div>
            </div>
            <TestModal />
            <UploadModal refresh={refresh} user={user} />
        </div>
    );
};

export default SentimentFeedbackFilter;
