import { getBuildingByKelurahan } from "@api/building";
import { errorHelper } from "@functions/common";
import { googleMapsDistrictOdp, odpAreaPolygonsDistrictOdp } from "@pages/planning/odp-area/district-odp";
import { parseFromWK } from "wkt-parser-helper";
import { DataPolygon, useCountTotalBuidlingStore, useDistrictBuildingStore, useDistrictOdpSummaryStore, useReport } from "../store";

const fetchBuildingByKelurahan = async (kode_desa_dagri: string, source: string, page = 1) => {
  useDistrictBuildingStore.setState({ status: 'pending' })
  useCountTotalBuidlingStore.setState({ status: 'pending' })
  try {
    let countPage = 1;
    let count = page
    const polygon_building = []
    for (let index = 1; index <= countPage; index++) {
      const data_polygon = await getBuildingByKelurahan({ kode_desa_dagri, page: count, row: 1000 })
      countPage = data_polygon.countPage
      polygon_building.push(...data_polygon.lists)
      useCountTotalBuidlingStore.setState({ countTotal: data_polygon.countTotal })
      count++
    }
    useDistrictBuildingStore.setState({ data: polygon_building, status: 'resolve' })
    useCountTotalBuidlingStore.setState({ status: 'resolve' })
    if (source == 'district-building') { showPolygonBuilding(polygon_building) }
  } catch (error) {
    useDistrictBuildingStore.setState({ error: errorHelper(error), status: 'reject' })
    useCountTotalBuidlingStore.setState({ error: errorHelper(error), status: 'reject' })
  }
}

const showPolygonBuilding = (data_polygon: DataPolygon[]) => {
  data_polygon.forEach((data): void => {
    const geom: string = data?.geom ? data.geom : ''
    const parse = parseFromWK(geom)
    const polygonLayer = parse.type == 'Polygon' ? parse.coordinates[0].map((x: OdpAreaMaping) => ({ lat: x[1], lng: x[0] })) : parse.coordinates[0][0].map((x: OdpAreaMaping) => ({ lat: x[1], lng: x[0] }))
    const polygon = new window.google.maps.Polygon({
      map: googleMapsDistrictOdp,
      paths: polygonLayer,
      strokeWeight: 2,
      strokeColor: "#FF3300",
      fillOpacity: 0,
    });
    odpAreaPolygonsDistrictOdp.push(polygon)
  })
  if (googleMapsDistrictOdp.getZoom()! < 16) googleMapsDistrictOdp.setZoom(16);
}

const fetchReportData = async () => {
  const odpSummary = useDistrictOdpSummaryStore.getState().data
  const countTotal = useCountTotalBuidlingStore.getState().countTotal
  useReport.setState({
    report: {
      penetration: (((odpSummary.deviceportnumber - odpSummary.portidlenumber) / countTotal) * 100).toFixed(2),
      readiness: ((100 * odpSummary.deviceportnumber) / countTotal).toFixed(2)
    },
    status: 'resolve'
  })
}

export {
  fetchBuildingByKelurahan,
  showPolygonBuilding,
  fetchReportData
}