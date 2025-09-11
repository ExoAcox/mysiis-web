import { getKelurahanByLocation } from "@api/district/metadata"
import { GetOdp, getOdp, Odp, OdpBoundary, OdpSource } from "@api/odp";
import { errorHelper, titleCase } from "@functions/common";
import { getStreetName } from "@functions/maps";
import { formatOdpToGeneral, FormattedOdp, odpIconSvg } from "@functions/odp";
import { circleRadiusMysiista, googleMapsMysiista, markerOdpMySiista, markerPinMysiista } from "@pages/planning/mysiista";
import { getOdpPercent, infoWindowContentOdp } from "../../function";
import { useKabupatenStore, useKecamatanStore, useKelurahanStore } from "../../store/address";
import { useOdpPercentStore, useStreetStore } from "../../store/odp";

const clearData = () => {
  markerOdpMySiista.forEach(e => e.setMap(null))
  markerOdpMySiista.length = 0
  useOdpPercentStore.getState().reset()
  useStreetStore.getState().reset()
}

export const resetData = () => {
  useKabupatenStore.getState().reset()
  useKecamatanStore.getState().reset()
  useKelurahanStore.getState().reset()
}

const fetchOdp = async (args: GetOdp) => {
  useOdpPercentStore.setState({ status: 'pending' })
  try {
    const rawOdps: OdpBoundary | Odp[] = await getOdp(args)
    let odps: FormattedOdp[];
    odps = formatOdpToGeneral(rawOdps as Odp[], args.source)

    if (args.source === "valins") {
      const newOdpData: FormattedOdp[] = [];
      odps.forEach((data) => {
        if (!newOdpData?.some((odp) => odp.name === data.name)) newOdpData.push(data);
      });
      odps = newOdpData;
    }

    odps.forEach((odp) => {
      const marker: Marker = new window.google.maps.Marker({
        map: googleMapsMysiista,
        position: { lat: odp.lat, lng: odp.lng },
        icon: odpIconSvg(odp.status),
        zIndex: 3,
      });

      marker.set(
        "infoWindow",
        new window.google.maps.InfoWindow({
          content: infoWindowContentOdp(odp),
        })
      );

      marker.addListener("mouseover", () => {
        markerOdpMySiista.forEach((marker) => marker.get("infoWindow").close());
        marker.get("infoWindow").open(googleMapsMysiista, marker);
      });

      marker.addListener("mouseout", () => {
        markerOdpMySiista.forEach((marker) => marker.get("infoWindow").close());
      });

      markerOdpMySiista.push(marker);
    });
    const odpPercent = `${odps.length} ODP ${args.source.toUpperCase()} (${getOdpPercent(odps)})%`
    useOdpPercentStore.setState({ odp_precent: odpPercent, status: 'resolve' })
  } catch (error) {
    useOdpPercentStore.setState({ status: 'pending', error: errorHelper(error) })
  }
}

export const fetchKelurahanByLocation = async (latLng: LatLng, source: OdpSource | undefined, radius: number) => {
  clearData()
  googleMapsMysiista.panTo(latLng);
  if (googleMapsMysiista.getZoom()! < 15) googleMapsMysiista.setZoom(17);
  markerPinMysiista.setPosition(latLng);
  markerPinMysiista.setVisible(true);
  circleRadiusMysiista.setCenter(latLng);
  circleRadiusMysiista.setRadius(radius);
  useStreetStore.setState({ status: 'pending', street: '' })
  try {
    const dataKelurahan = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng, isShowGeom: false })
    const streetName = await getStreetName(latLng);
    if (dataKelurahan?.kota) {
      const regionType = dataKelurahan.kota.split(" ")[0] == "KOTA";
      const kota = regionType ? dataKelurahan.kota.replace("KOTA ", "") : dataKelurahan.kota;
      const name = `${streetName ? streetName + ', ' : ''}Kel. ${titleCase(dataKelurahan.kelurahan)}, Kec. ${titleCase(dataKelurahan.kecamatan)}, ${regionType ? "Kota" : "Kab."
        } ${titleCase(kota)}, ${titleCase(dataKelurahan.provinsi).replace("Dki", "DKI")}`;
      useStreetStore.setState({ street: name, status: 'resolve' })
      const args: GetOdp = {
        source: source ? source : 'uim',
        radius,
        lat: latLng.lat,
        long: latLng.lng,
        isBoundaryActive: false
      }
      fetchOdp(args)
    }
  } catch (error) {
    useStreetStore.setState({ status: 'reject', error: errorHelper(error) })
  }
}