import csvDownload from "json-to-csv-export";
import ReactTooltip from "react-tooltip";

import { ListAllCompetitor } from "@api/odp/competitor";

import { tw } from "@functions/style";

export const stateRegional = [{ label: "Semua Regional", value: "" }];

export const stateWitel = [{ label: "Semua Witel", value: "" }];

export const stateMatch = [
    {
        label: "Semua Status",
        value: "",
    },
    {
        label: "Rekomendasi",
        value: "W",
    },
    {
        label: "Belum Direkomendasi",
        value: "L",
    },
];

const ListStatusOcc: React.FC<{ children: React.ReactNode; dataTip: string; className: string }> = ({ children, dataTip, className }) => {
    return (
        <>
            <span className={tw("font-bold bg-error-20 py-1 px-2 rounded cursor-default", className)} data-for="statusOcc" data-tip={dataTip}>
                {children}
            </span>
            <ReactTooltip effect="solid" place="top" delayShow={500} id="statusOcc" getContent={(dataTip) => <span>{dataTip}</span>} />
        </>
    );
};

export const getStatusOcc = (status: string) => {
    switch (status) {
        case "RED":
            return (
                <ListStatusOcc dataTip="Status ODP RED menandakan keterisian port 100%" className="text-red-600">
                    RED
                </ListStatusOcc>
            );
        case "ORANGE":
            return (
                <ListStatusOcc dataTip="Status ODP ORANGE menandakan keterisian port >80%" className="text-orange-500">
                    ORANGE
                </ListStatusOcc>
            );
        case "YELLOW":
            return (
                <ListStatusOcc dataTip="Status ODP YELLOW menandakan keterisian port >40%" className="text-yellow-400">
                    YELLOW
                </ListStatusOcc>
            );
        case "BLACK_SYSTEM":
            return (
                <ListStatusOcc dataTip="Status ODP BLACK menandakan keterisian port 0%" className="text-black">
                    BLACK
                </ListStatusOcc>
            );
        default:
            return (
                <ListStatusOcc dataTip="Status ODP GREEN menandakan keterisian port 1-40%" className="text-green-700">
                    GREEN
                </ListStatusOcc>
            );
    }
};

const ListOverallMatch: React.FC<{ children: React.ReactNode; dataTip: string; className: string }> = ({ children, dataTip, className }) => {
    return (
        <>
            <span className={tw("font-bold cursor-default", className)} data-for="overallMatch" data-tip={dataTip}>
                {children}
            </span>
            <ReactTooltip effect="solid" place="top" delayShow={500} id="overallMatch" getContent={(dataTip) => <span>{dataTip}</span>} />
        </>
    );
};

export const getOverallMatch = (match: string) => {
    if (match === "L") {
        return (
            <ListOverallMatch dataTip="Harga, Speed, dan Latency koneksi kurang unggul dari kompetitor" className="text-red-600">
                Belum Direkomendasi
            </ListOverallMatch>
        );
    } else {
        return (
            <ListOverallMatch dataTip="Harga, Speed, dan Latency koneksi lebih unggul dari kompetitor" className="text-green-700">
                Rekomendasi
            </ListOverallMatch>
        );
    }
};

export const exportCsv = (array: ListAllCompetitor[]) => {
    const dataToConvert = {
        data: array,
        filename: `Data Competitor.csv`,
        delimiter: ",",
    };
    csvDownload(dataToConvert);
};
