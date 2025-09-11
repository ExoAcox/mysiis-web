import dayjs from "dayjs";
import { useState } from "react";
import { When } from "react-if";

import { setMapNull } from "@functions/maps";

import { circleRadius, googleMaps, markerOdps, markerPin, polygonBoundary, polylineDirection } from "@pages/planning/data-demand/maps-summary";

import { filterRespondentByScale } from "@features/planning/data-demand/functions/maps";
import { fetchKelurahan, fetchOdpView } from "@features/planning/data-demand/queries/maps";
import { useBoundsRespondentStore, useFilterStore, useOdpViewStore, useRespondentStore } from "@features/planning/data-demand/store/maps";

import { Dropdown } from "@components/dropdown";
import { CheckBox } from "@components/radio";
import { LabelInput } from "@components/text";

interface Props {
    access: Access;
}

const ComponentsFilterCard: React.FC<Props> = ({ access }) => {
    const respondent = useRespondentStore();
    const filterStore = useFilterStore();
    const { period, scales } = filterStore;

    const boundsRespondentStore = useBoundsRespondentStore();
    const { bounds } = boundsRespondentStore;

    const odpViewStore = useOdpViewStore();

    const [valuesCheckBox, setValuesCheckBox] = useState([""]);

    return (
        <>
            <div>
                <LabelInput>Periode</LabelInput>
                <Dropdown
                    id="filter-maps-period"
                    value={period}
                    options={Array.from({ length: 12 }).map((_, index) => {
                        const currentMonth = dayjs().subtract(index, "month");
                        const pastMonth = dayjs().subtract(index + 1, "month");

                        const option = {
                            label: `${pastMonth.format("MMMM YYYY")} - ${currentMonth.format("MMMM YYYY")}`,
                            value: currentMonth.format("YYYY-MM-DD"),
                        };

                        return option;
                    })}
                    onChange={(value) => {
                        filterStore.set({ period: value });

                        if (markerPin.getPosition()) {
                            fetchKelurahan(
                                {
                                    latLng: { lat: markerPin.getPosition()!.lat(), lng: markerPin.getPosition()!.lng() },
                                    period: value,
                                },
                                access
                            );
                        }
                    }}
                    className="text-medium overflow-hidden"
                />
            </div>
            <When condition={respondent.status === "resolve"}>
                <CheckBox
                    variant="inline"
                    value={valuesCheckBox}
                    onChange={(values) => {
                        setValuesCheckBox(values);

                        if (values.includes("view-odp-checkbox")) {
                            if (markerPin.getPosition()) {
                                const latLng = markerPin.getPosition()!;

                                markerPin?.setPosition(latLng);
                                polygonBoundary?.setPath([]);
                                circleRadius?.setMap(googleMaps);
                                circleRadius?.setCenter(latLng);
                                circleRadius?.setRadius(200);
                                setMapNull(markerOdps);
                                polylineDirection?.setPath([]);

                                googleMaps.panTo(latLng);
                                if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

                                fetchOdpView({
                                    access,
                                    filters: [],
                                    source: "uim",
                                    radius: 200,
                                    latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                                });
                            }
                        } else {
                            polygonBoundary?.setPath([]);
                            circleRadius?.setMap(null);
                            setMapNull(markerOdps);
                            polylineDirection?.setPath([]);

                            odpViewStore.reset();

                            if (bounds) googleMaps.fitBounds(bounds);
                        }
                    }}
                    options={[{ label: "View ODP", value: "view-odp-checkbox" }]}
                    className="mt-3"
                />
                <div className="mt-3">
                    <LabelInput>Skala</LabelInput>
                    <CheckBox
                        value={scales}
                        options={[
                            { label: "Cenderung Membutuhkan", value: "10" },
                            { label: "Membutuhkan", value: "11" },
                            { label: "Sangat Membutuhkan", value: "12" },
                        ]}
                        onChange={(value) => {
                            filterStore.set({ scales: value });
                            filterRespondentByScale(value.map((v) => Number(v)));
                        }}
                        className="text-medium text-black-80"
                    />
                </div>
            </When>
        </>
    );
};

export default ComponentsFilterCard;
