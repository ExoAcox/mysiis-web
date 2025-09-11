import { getKelurahanByLocation } from "@api/district/metadata"
import { errorHelper } from "@functions/common"
import { googleMapsDistrictOdp, heatmapOdpAreaDistrictOdp, mainMarkerOdpAreaDistrictOdp, odpAreaInfoWindowsDistrictOdp, odpAreaMarkersDistrictOdp, odpAreaPolygonsDistrictOdp, polygonKelurahanOdpAreaDistrictOdp } from "@pages/planning/odp-area/district-odp"
import { useCountTotalBuidlingStore, useDistrictBuildingStore, useDistrictOdpSummaryStore, useDistrictStore, useKodeDesaDagri, useSummaryPenetrasiOdpBuildingStore } from "../../store"
import { fetchBuildingByKelurahan } from "../building_by_kelurahan"
import { fetchOdpUimByKelurahan } from "../odp_uim_by_kelurahan"
import { fetchOdpUimMiniByKabupaten } from "../odp_uim_mini_by_kabupaten"
import { parseLatLng } from "@functions/maps"
import { toast } from "react-toastify"


export const clearDataDistrictOdp = () => {
  polygonKelurahanOdpAreaDistrictOdp.setMap(null);
  polygonKelurahanOdpAreaDistrictOdp.setOptions({
    strokeWeight: 2,
    strokeColor: "#FF3300",
    fillOpacity: 0,
    clickable: false,
  })
  odpAreaPolygonsDistrictOdp.forEach((x) => x.setMap(null));
  odpAreaPolygonsDistrictOdp.length = 0;
  odpAreaInfoWindowsDistrictOdp.forEach((x) => x?.setMap && x.setMap(null));
  odpAreaInfoWindowsDistrictOdp.length = 0;
  odpAreaMarkersDistrictOdp.forEach((x) => x.setMap(null));
  odpAreaMarkersDistrictOdp.length = 0;
  heatmapOdpAreaDistrictOdp.forEach((x) => x.setMap(null));
  heatmapOdpAreaDistrictOdp.length = 0;
  useDistrictStore.getState().reset();
  useDistrictOdpSummaryStore.getState().reset()
  useCountTotalBuidlingStore.getState().reset()
  useSummaryPenetrasiOdpBuildingStore.getState().reset()
  useKodeDesaDagri.getState().reset()
  useDistrictBuildingStore.getState().reset()
}


export const fetchKelurahanByLocation = async (latLng: LatLng, source: SourceDistrictOdp) => {
  clearDataDistrictOdp()
  useDistrictStore.setState({ status: 'pending' })
  useKodeDesaDagri.setState({ status: 'pending' })

  googleMapsDistrictOdp.panTo(latLng);
  mainMarkerOdpAreaDistrictOdp.setPosition(latLng);
  if (googleMapsDistrictOdp.getZoom()! < 13) googleMapsDistrictOdp.setZoom(13);

  try {
    const resolve = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng })
    const geom: string = resolve?.geom ? resolve.geom : ''
    const polygonLayer = parseLatLng(geom)
    polygonKelurahanOdpAreaDistrictOdp.setPath(polygonLayer);
    polygonKelurahanOdpAreaDistrictOdp.setMap(googleMapsDistrictOdp);
    polygonKelurahanOdpAreaDistrictOdp.setOptions({
      zIndex: 10,
      strokeWeight: 3
    })

    useDistrictStore.setState({ data: resolve, status: 'resolve' })

    if (source == 'district-odp' || source == 'district-heatmap') {
      fetchOdpUimByKelurahan(resolve.kode_desa_dagri, source)
      fetchOdpUimMiniByKabupaten(resolve.provinsi, resolve.kota, source)
    }
    if (source == 'district-building') {
      fetchBuildingByKelurahan(resolve.kode_desa_dagri, source)
    }

    useKodeDesaDagri.setState({ kode_desa_dagri: resolve.kode_desa_dagri, status: 'resolve' })
  } catch (error: any) {
    useDistrictStore.setState({ status: 'reject', error: errorHelper(error) })
    useKodeDesaDagri.setState({ status: 'reject', error: errorHelper(error) })
    toast.error(error?.message || 'Network Error')
  }
}