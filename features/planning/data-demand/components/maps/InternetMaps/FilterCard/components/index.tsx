import { markerPin } from "@pages/planning/data-demand/internet-summary";

import { fetchKelurahan } from "@features/planning/data-demand/queries/internetMaps";
import { useFilterInternetStore } from "@features/planning/data-demand/store/internetMaps";

import { CheckBox } from "@components/radio";
import { LabelInput } from "@components/text";

interface Props {
    access: Access;
}

const ComponentsFilterCard: React.FC<Props> = ({ access }) => {
    const filterInternetStore = useFilterInternetStore();
    const { predict, cluster } = filterInternetStore;

    return (
        <>
            <div>
                <LabelInput>Pilih Data Prediksi</LabelInput>
                <CheckBox
                    value={predict}
                    options={[
                        { label: "1-3 : Very High Demand Internet", value: "1,2,3" },
                        { label: "4-5 : High Demand Internet", value: "4,5" },
                        { label: "6-7 : Low Demand Internet", value: "6,7" },
                        { label: "8-10 : Very Low Demand Internet", value: "8,9,10" },
                    ]}
                    onChange={(value) => {
                        filterInternetStore.set({ predict: value });

                        if (markerPin.getPosition()) {
                            fetchKelurahan(
                                {
                                    latLng: { lat: markerPin.getPosition()!.lat(), lng: markerPin.getPosition()!.lng() },
                                    predict: value,
                                    cluster,
                                },
                                access
                            );
                        }
                    }}
                    className="text-medium text-black-80"
                />
            </div>
            <div className="mt-3">
                <LabelInput>Pilih Cluster</LabelInput>
                <CheckBox
                    value={cluster}
                    options={[
                        { label: "Rendah", value: "Rendah" },
                        { label: "Rerata Rendah", value: "Rerata Rendah" },
                        { label: "Sedang", value: "Sedang" },
                        { label: "Rerata Tinggi", value: "Rerata Tinggi" },
                        { label: "Tinggi", value: "Tinggi" },
                    ]}
                    onChange={(value) => {
                        filterInternetStore.set({ cluster: value });

                        if (markerPin.getPosition()) {
                            fetchKelurahan(
                                {
                                    latLng: { lat: markerPin.getPosition()!.lat(), lng: markerPin.getPosition()!.lng() },
                                    predict,
                                    cluster: value,
                                },
                                access
                            );
                        }
                    }}
                    className="text-medium text-black-80"
                />
            </div>
        </>
    );
};

export default ComponentsFilterCard;
