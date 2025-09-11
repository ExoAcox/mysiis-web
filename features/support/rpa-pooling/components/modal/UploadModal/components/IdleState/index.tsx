import { toast } from "react-toastify";

import { uploadFile } from "@functions/input";

import UploadIcon from "@images/vector/upload.svg";

const IdleState: React.FC<{ submit: (file: File) => void }> = ({ submit }) => {
    const upload = async () => {
        const data = await uploadFile({ accept: "text/csv" });

        switch (data.error) {
            case "empty":
                return toast.error("Tidak ada file yg diupload");
            case "not-supported":
                return toast.error("File yg diupload tidak disupport");
            case "exceed-limit":
                return toast.error("File yg diupload melebihi limit size 1mb");
        }

        submit(data.file!);
    };

    const dropHandler = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) {
            return toast.error("Tidak ada file yg diupload");
        }

        if (!"text/csv".split(",").includes(file.type)) {
            return toast.error("File yg diupload tidak disupport");
        }
        if (file.size > 1000000) {
            return toast.error("File yg diupload melebihi limit size 1mb");
        }

        submit(file);
    };

    return (
        <div
            className="cursor-pointer w-[18.75rem] flex flex-col justify-center items-center border bg-secondary-10 border-secondary-30 border-dashed rounded-md p-5 mt-4"
            onClick={upload}
            onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onDrop={dropHandler}
        >
            <UploadIcon className="w-[100px] h-[106px]" />
            <span className="text-center text-black-100 text-medium">Tarik & Lepaskan disini atau cari file di komputer Anda</span>
        </div>
    );
};

export default IdleState;
