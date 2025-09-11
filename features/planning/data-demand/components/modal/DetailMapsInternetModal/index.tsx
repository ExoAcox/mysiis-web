import { ListAllMultilayer } from "@api/multilayer/feedback";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

const DetailMapsInternetModal = (): JSX.Element => {
    const { data, modal, setModal } = useModal<ListAllMultilayer>("modal-detail-internet-demand");

    return (
        <Modal visible={modal} className="p-6 w-fit rounded-xl">
            <div className="flex flex-col gap-4 pb-6">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    Detail
                </ModalTitle>
                <div className="flex flex-col gap-2 w-full border border-secondary-30 rounded p-6 max-h-[70vh] overflow-auto">
                    <List label="ID">{data?._id || "-"}</List>
                    <List label="Grid ID">{data?.grid_id || "-"}</List>
                    <List label="Long">{data?.long || 0}</List>
                    <List label="Lat">{data?.lat || 0}</List>
                    <List label="Provinsi">{data?.provinsi || "-"}</List>
                    <List label="Kabupaten/kota">{data?.kabupaten_kota || "-"}</List>
                    <List label="Kecamatan">{data?.kecamatan || "-"}</List>
                    <List label="Desa/kelurahan">{data?.desa_kelurahan || "-"}</List>
                    <List label="Zona nilai tanah">{data?.zona_nilai_tanah || 0}</List>
                    <List label="Jumlah bangunan">{data?.jml_bangunan || 0}</List>
                    <List label="Jumlah testing ookla">{data?.jml_testing_ookla || 0}</List>
                    <List label="Jumlah pelanggan indihome">{data?.jml_pelanggan_indihome || 0}</List>
                    <List label="Jumlah port odp">{data?.jml_port_odp || 0}</List>
                    <List label="Occ rate">{data?.occ_rate || "-"}</List>
                    <List label="Cluster geo">{data?.cluster_geo || "-"}</List>
                    <List label="Warning">{data?.warning || "-"}</List>
                    <List label="Prediksi">{data?.prediksi || 0}</List>
                    <List label="Kode desa dagri">{data?.kode_desa_dagri || 0}</List>
                    <List label="Sum download kbps">{data?.sum_download_kbps || 0}</List>
                    <List label="Sum upload kbps">{data?.sum_upload_kbps || 0}</List>
                    <List label="Cluster">{data?.cluster || "-"}</List>
                    <List label="Jumlah speed test pada kelurahan">{data?.jumlah_speed_test_pada_kelurahan || 0}</List>
                    <List label="Slope">{data?.slope || 0}</List>
                    <List label="Avg download kbps">{data?.avg_download_kbps || 0}</List>
                    <List label="Avg upload kbps">{data?.avg_upload_kbps || 0}</List>
                    <List label="Recommended estimated downspeed kbps">{data?.recommended_estimated_downspeed_kbps || 0}</List>
                    <List label="Recommended estimated upspeed kbps">{data?.recommended_estimated_upspeed_kbps || 0}</List>
                </div>
            </div>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <span className="shrink-0 w-72 font-bold md:w-48 sm:w-28">{label}</span>
            <span className="w-fit font-bold">:</span>
            <span className="w-80">{children}</span>
        </div>
    );
};

export default DetailMapsInternetModal;
