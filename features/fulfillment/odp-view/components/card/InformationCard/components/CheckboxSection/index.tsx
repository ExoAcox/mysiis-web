import { When } from "react-if";

import { googleMaps, markerPin, markerSpeedtests, polygonClusters, polygonSmartSales } from "@pages/fulfillment/odp-view";

import { fetchCluster, fetchSmartSales, fetchSpeedtest } from "@features/fulfillment/odp-view/queries";
import {
    useClusterStore,
    useFilterStore,
    useKelurahanStore,
    useOdpStore,
    useSmartSalesStore,
    useSpeedtestStore,
} from "@features/fulfillment/odp-view/store";

import { CheckBox } from "@components/radio";

const CheckboxSection: React.FC<{ access: Access; device?: Device }> = ({ access, device }) => {
    const smartSalesStatus = useSmartSalesStore((store) => store.status);
    const clusterStatus = useClusterStore((store) => store.status);
    const odpStatus = useOdpStore((store) => store.status);
    const speedtestStatus = useSpeedtestStore((store) => store.status);

    const filterStore = useFilterStore();
    const filterValue = [filterStore.smartsales && "smartsales", filterStore.ipca_cluster && "ipca_cluster", filterStore.speedtest && "speedtest"];

    const kelurahanStore = useKelurahanStore();
    const { kode_desa_dagri, regional, witel } = kelurahanStore.data;

    return (
        <When condition={odpStatus === "resolve" && access === "allowed"}>
            <div className="pt-3.5 mt-6.5 border-t border-secondary-20">
                <CheckBox
                    value={filterValue}
                    options={[
                        { label: "Tampilkan SmartSales Grid", value: "smartsales", loading: smartSalesStatus === "pending" },
                        { label: "Tampilkan Cluster Priority", value: "ipca_cluster", loading: clusterStatus === "pending" },
                        { label: "Tampilkan Speedtest Ookla", value: "speedtest", loading: speedtestStatus === "pending" },
                    ]}
                    onChange={(values, dataValue) => {
                        if (dataValue.value === "smartsales") {
                            filterStore.set({
                                smartsales: values.includes("smartsales"),
                                ipca_cluster: false,
                                speedtest: false,
                            });

                            polygonClusters.forEach((polygon) => polygon.setMap(null));
                            markerSpeedtests.forEach((marker) => marker.setMap(null));

                            if (smartSalesStatus === "resolve") {
                                polygonSmartSales.forEach((polygon) => {
                                    polygon.setMap(values.includes("smartsales") ? googleMaps : null);
                                });
                            } else {
                                fetchSmartSales({
                                    kode_desa_dagri,
                                });
                            }
                        }

                        if (dataValue.value === "ipca_cluster") {
                            filterStore.set({
                                smartsales: false,
                                ipca_cluster: values.includes("ipca_cluster"),
                                speedtest: false,
                            });

                            polygonSmartSales.forEach((polygon) => polygon.setMap(null));
                            markerSpeedtests.forEach((marker) => marker.setMap(null));

                            if (clusterStatus === "resolve") {
                                polygonClusters.forEach((polygon) => {
                                    polygon.setMap(values.includes("ipca_cluster") ? googleMaps : null);
                                });
                            } else {
                                fetchCluster({
                                    regional,
                                    witel,
                                });
                            }
                        }

                        if (dataValue.value === "speedtest") {
                            filterStore.set({
                                smartsales: false,
                                ipca_cluster: false,
                                speedtest: values.includes("speedtest"),
                            });

                            polygonSmartSales.forEach((polygon) => polygon.setMap(null));
                            polygonClusters.forEach((polygon) => polygon.setMap(null));

                            if (speedtestStatus === "resolve") {
                                markerSpeedtests.forEach((marker) => {
                                    marker.setMap(values.includes("speedtest") ? googleMaps : null);
                                });
                            } else {
                                const latLng = markerPin.getPosition()!;
                                fetchSpeedtest({ latLng: { lat: latLng.lat(), lng: latLng.lng() }, radius: filterStore.radius });
                            }
                        }
                    }}
                    className={device === "mobile" ? "" : "mx-auto"}
                />
            </div>
        </When>
    );
};

export default CheckboxSection;
