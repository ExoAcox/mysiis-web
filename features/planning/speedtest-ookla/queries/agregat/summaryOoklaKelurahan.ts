import { getSummaryOoklaByKelurahan } from "@api/speedtest/ookla";
import { errorHelper } from "@functions/common";

import { dataSelectedKelurahan, useSelectedKelurahanStore } from "../../store/agregat";

interface FetchSummaryOoklaByKelurahan {
    code: number;
}

const fetchSummaryOoklaByKelurahan = async (args: FetchSummaryOoklaByKelurahan) => {
    const { code } = args;

    useSelectedKelurahanStore.setState({ data: dataSelectedKelurahan, status: "idle", error: null });
    try {
        const agregat = await getSummaryOoklaByKelurahan({kode_desa_dagri: code});
        useSelectedKelurahanStore.setState({ data: {...agregat} , status: "resolve" });
    } catch (error) {
        useSelectedKelurahanStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchSummaryOoklaByKelurahan;