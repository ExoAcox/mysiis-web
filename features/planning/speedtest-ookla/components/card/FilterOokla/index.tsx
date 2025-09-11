import { useRouter } from "next/router";

import { SpeedtestSource, useFilterSpeedtestStore, useKelurahanSpeedtestStore } from "@features/planning/speedtest-ookla/store/ookla";
import { markerMaps, polygonsSpeedtests, circleSpeedtest, markersSpeedtests } from "@pages/planning/speedtest-ookla/speedtest-ookla";

import { RadiusSlider } from "@components/maps";
import { TabButton } from "@components/button";
import { DateRangePicker } from "@components/calendar";
import { fetchOoklaByCoordinate, fetchOoklaByKelurahan } from "@features/planning/speedtest-ookla/queries/ookla";
import { tabOptions } from "@features/planning/speedtest-ookla/functions/common";
import { TabBar } from "@features/planning/speedtest-ookla/components/card";

interface Props {
    mapState: MapState;
}

let debounce: NodeJS.Timeout;

const FilterOokla: React.FC<Props> = ({ mapState }) => {
    const router = useRouter();

    const filterStore = useFilterSpeedtestStore();
    const kelurahanStore = useKelurahanSpeedtestStore();

    const { date, nextDate, source, radius } = filterStore;

    return (
        <div className="z-10">
            <TabBar
                tab={{
                    value: "speedtest-ookla",
                    options: tabOptions,
                    onChange: (value) => {
                        router.push(`/planning/speedtest-ookla/${value}`);
                    },
                }}
            />
            <TabButton
                value={source}
                onChange={(value) => {
                    const source = value as SpeedtestSource;
                    filterStore.set({ source });

                    markersSpeedtests.forEach((marker) => marker.setMap(null));
                    polygonsSpeedtests.forEach((polygon) => polygon.setMap(null));

                    if (source === "radius") {
                        const latLng = markerMaps.getPosition()!;
                        circleSpeedtest.setRadius(radius);
                        fetchOoklaByCoordinate({
                            date: date,
                            nextDate: nextDate,
                            radius: Number(mapState().radius),
                            latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                        });
                    } else {
                        const code = Number(kelurahanStore.data.kode_desa_dagri);
                        circleSpeedtest.setRadius(0);
                        fetchOoklaByKelurahan({
                            code: code,
                            date: date,
                            nextDate: nextDate,
                        });
                    }
                }}
                options={[
                    { label: "Radius", value: "radius" },
                    { label: "Kelurahan", value: "kelurahan" },
                ]}
                className="my-4"
            />

            <DateRangePicker
                id="speedtest-date"
                value={{ start: date, end: nextDate }}
                onChange={(date, nextDate) => {
                    filterStore.set({ date, nextDate });

                    if (markerMaps.getPosition()) {
                        markersSpeedtests.forEach((marker) => marker.setMap(null));
                        polygonsSpeedtests.forEach((polygon) => polygon.setMap(null));

                        if (source === "radius") {
                            const latLng = markerMaps.getPosition()!;
                            fetchOoklaByCoordinate({
                                radius: Number(mapState().radius),
                                latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                                date: date,
                                nextDate: nextDate,
                            });
                        } else {
                            const code = Number(kelurahanStore.data.kode_desa_dagri);
                            fetchOoklaByKelurahan({
                                code: code,
                                date: date,
                                nextDate: nextDate,
                            });
                        }
                    }
                }}
                className="mb-4"
            />

            <RadiusSlider
                value={radius}
                onChange={(radius) => {
                    filterStore.set({ radius });

                    if (markerMaps.getPosition()) {
                        markersSpeedtests.forEach((marker) => marker.setMap(null));
                        polygonsSpeedtests.forEach((polygon) => polygon.setMap(null));

                        const latLng = markerMaps.getPosition()!;

                        clearTimeout(debounce);
                        debounce = setTimeout(() => {
                            if (source === "radius") {
                                circleSpeedtest.setRadius(radius);
                                fetchOoklaByCoordinate({
                                    radius: Number(mapState().radius),
                                    latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                                    date: date,
                                    nextDate: nextDate,
                                });
                            } else {
                                circleSpeedtest.setRadius(0);
                            }
                        }, 1000);
                    }
                }}
                min={50}
                max={300}
                step={25}
            />
        </div>
    );
};

export default FilterOokla;
