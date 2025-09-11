import centroid from "@turf/centroid";
import { polygon as TurfPolygon } from "@turf/helpers";
import { toast } from "react-toastify";

import { addPolygon, getInfoBatasAdministratif } from "@api/survey-demand/mysiista";
import { getTahap } from "@api/survey-demand/utility";

import { customFormData, errorHelper } from "@functions/common";

import { polygonDrawing, polygonsDrawing } from "../../components/ModalDrawingPolygon/components/DrawingPolygon";
import { getStreetDrawing } from "../../function/drawing";
import { useBodyStore } from "../../store/drawing";
import { User } from "@api/account/user";

export const getDatabatasKelurahan = async (profile: User) => {
    useBodyStore.setState({ status: "pending" });

    try {
        const listBody = useBodyStore.getState().body;
        const reverseList = polygonDrawing
            .getPath()
            .getArray()
            ?.map((data) => [data.lat(), data.lng()]);
        const newPoly = TurfPolygon([[...reverseList, reverseList[0]]]);
        const newCentroid = centroid(newPoly);
        const street = await getStreetDrawing({ lat: newCentroid.geometry.coordinates[0], lng: newCentroid.geometry.coordinates[1] });
        const batas = await getInfoBatasAdministratif({ lat: newCentroid.geometry.coordinates[0], long: newCentroid.geometry.coordinates[1] });
        const tahap = await getTahap();
        const body = {
            ...listBody,
            treg: batas.treg,
            witel: batas.witel,
            id_desa: batas.kode_desa_dagri,
            desa: batas.kelurahan,
            kecamatan: batas.kecamatan,
            kabupaten: batas.kota,
            provinsi: batas.provinsi,
            address: street?.street,
            street: street?.street,
            postal: street?.postalCode,
            lat: newCentroid.geometry.coordinates[0],
            lon: newCentroid.geometry.coordinates[1],
            tahap_survey: String(tahap[0]["tahap_survey"]),
            user: profile.fullname ?? "",
        };
        useBodyStore.setState({ body: body, status: "resolve" });
    } catch (error) {
        toast.error("terjadi kesalahan");
        useBodyStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export const handleSave = (setModal: (e: boolean) => void, setSuccess: (e: boolean) => void, setLoading: (e: boolean) => void) => {
    const bodyStore = useBodyStore.getState().body;
    setLoading(true);
    const raw = {
        f: "json",
        geometry: JSON.stringify({
            rings: polygonsDrawing,
        }),
        attributes: JSON.stringify(bodyStore),
    };
    const body = customFormData(raw);
    addPolygon(body)
        .then(() => {
            setSuccess(true);
            setModal(false);
            setLoading(false);
        })
        .catch((err) => {
            toast.error(err);
            setLoading(false);
        });
};
