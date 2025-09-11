import { toast } from "react-toastify";

import useMediaQuery from "@hooks/useMediaQuery";

import { uploadFile } from "@functions/input";

import UploadIcon from "@images/vector/upload.svg";

interface Props {
    uploadCsv: (file: File) => void;
}

const IdleState: React.FC<Props> = ({ uploadCsv }) => {
    const { isMobile } = useMediaQuery(767, { debounce: false });

    const upload = async () => {
        const data = await uploadFile({ accept: "text/csv" });

        switch (data.error) {
            case "empty":
                return toast.error("Tidak ada file yang diupload");
            case "not-supported":
                return toast.error("File yang diupload tidak disupport");
            case "exceed-limit":
                return toast.error("File yang diupload melebihi limit size 1mb");
        }

        uploadCsv(data.file!);
    };

    const dropHandler = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) {
            return toast.error("Tidak ada file yang diupload");
        }

        if (!"text/csv".split(",").includes(file.type)) {
            return toast.error("File yang diupload tidak disupport");
        }
        if (file.size > 1000000) {
            return toast.error("File yang diupload melebihi limit size 1mb");
        }

        uploadCsv(file);
    };

    return (
        <div className="flex flex-col gap-4 items-center w-full min-w-[20.5rem] sm:min-w-[16rem] xs:min-w-0">
            <div
                className="cursor-pointer w-full flex flex-col justify-center items-center border border-secondary-30 border-dashed rounded-md p-5"
                onClick={upload}
                onDragOver={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onDrop={dropHandler}
            >
                <UploadIcon className="w-[100px] h-[106px]" />
                <span className="text-black-100 text-medium text-center">
                    {isMobile ? "Pilih file .csv Anda" : "Tarik & Lepaskan disini atau cari file .csv di komputer Anda"}
                </span>
            </div>
        </div>
    );
};

export default IdleState;
