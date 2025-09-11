import { tw } from "@functions/style";

export const stateRow = [5, 10, 20, 50, 100];

export const dummyText =
    "dari bulan lalu udh ksh data mau putusin indihome tv stb krna gak digunakan eh gue tanya lg ternyata blm diproses macam mana pula ini indihome harusnya bln dpn tagihan gue dikit malah msh tetep";

export const statePrediction = [
    {
        label: "Semua Prediksi",
        value: "",
    },
    {
        label: "Positif",
        value: "positive",
    },
    {
        label: "Negatif",
        value: "negative",
    },
    {
        label: "Netral",
        value: "neutral",
    },
];

const ListPrediction: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => {
    return (
        <>
            <span className={tw("font-bold py-1 rounded cursor-default", className)}>{children}</span>
        </>
    );
};

export const getPrediction = (match: string) => {
    switch (match) {
        case "negative":
            return <ListPrediction className="text-primary-40">NEGATIF</ListPrediction>;
        case "positive":
            return <ListPrediction className="text-success-60">POSITIF</ListPrediction>;
        default:
            return <ListPrediction className="text-black-100">NETRAL</ListPrediction>;
    }
};
