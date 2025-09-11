import { googleMapsEvent } from "@functions/maps";

interface EventProps {
  googleMaps: Maps
}

export const eventListenerDrawingPolygon = ({ googleMaps }: EventProps) => {
  googleMapsEvent("maps-type", "click", () => {
    const type = document.getElementById("maps-type")!.dataset.type as string;
    googleMaps.setMapTypeId(type);
  });
}