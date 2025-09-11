import { summaryPenetrasiOdpBuilding } from "@api/district/summary";
import { errorHelper } from "@functions/common";
import { PolygonPenetration } from "@pages/planning/odp-area/district-odp";
import { districtSummaryInfoWindows, districtSummaryPolygons } from "@pages/planning/odp-area/district-summary";
import { useSummaryPenetrasiOdpBuildingStore, useSummaryTable } from "../store";
import { toast } from "react-toastify";

interface InfoW extends InfoWindow {
  data?: object
}

interface Poly extends Polygon {
  kelurahan?: string;
  kecamatan?: string
}

const fetchSummaryPenetrasiOdpBuilding = async (provinsi: string, kota: string) => {
  useSummaryPenetrasiOdpBuildingStore.setState({ status: 'pending' })
  useSummaryTable.setState({ status: 'pending' })
  try {
    const resolve = await summaryPenetrasiOdpBuilding(provinsi, kota)
    const data_sort = resolve.sort((a, b) => a.kecamatan?.localeCompare(b.kecamatan))
    useSummaryTable.setState({
      data: data_sort,
      status: 'resolve'
    })

    const mapMode = document.getElementById("mode-district-summary");

    resolve.forEach((data) => {
      const infoWindow: InfoW = new window.google.maps.InfoWindow({
        content: `<div class="">${data.building_count
          ? mapMode?.dataset.mode == "penetration"
            ? (((data.odp_deviceportnumber - data.odp_portidlenumber) / data.building_count) * 100).toFixed()
            : data.penetrasi_percent.toFixed(2)
          : 0
          }%</div>`,
        zIndex: 3,
        position: { lat: data.lat, lng: data.long },
      });

      infoWindow.data = data;
      districtSummaryInfoWindows.push(infoWindow);

      const polygon: PolygonPenetration | undefined = districtSummaryPolygons.find((poly: Poly) => poly.kelurahan === data.kelurahan && poly.kecamatan === data.kecamatan);
      if (polygon) {
        const penetrasi: any = data.building_count
          ? mapMode?.dataset.mode === "penetration"
            ? (((data.odp_deviceportnumber - data.odp_portidlenumber) / data.building_count) * 100).toFixed()
            : data.penetrasi_percent.toFixed(2)
          : 0;
        let color;
        if (penetrasi <= 0) {
          color = "#073A5F";
        } else if (penetrasi <= 10) {
          color = "#0762A4";
        } else if (penetrasi <= 40) {
          color = "#0791A4";
        } else if (penetrasi > 40 && penetrasi <= 70) {
          color = "#07A446";
        } else if (penetrasi > 70 && penetrasi <= 100) {
          color = "#A1A407";
        } else if (penetrasi > 100 && penetrasi <= 150) {
          color = "#D1C345";
        } else {
          color = "#F1E78A";
        }
        polygon.setOptions({ fillColor: color, fillOpacity: 0.7 });
        polygon.data = data;
      }
    });
    useSummaryPenetrasiOdpBuildingStore.setState({ data: resolve, status: 'resolve' })
  } catch (error: any) {
    useSummaryPenetrasiOdpBuildingStore.setState({ error: errorHelper(error), status: 'reject' })
    useSummaryTable.setState({ error: errorHelper(error), status: 'reject' })
    toast.error(error?.message || 'Network Error', {
      autoClose: 5000,
    })
  }
}

const handleMode = (mapMode: string) => {
  districtSummaryPolygons.forEach((polygon) => {
    const penetrasi: any = polygon.data && polygon.data.building_count
      ? mapMode != "penetration"
        ? (((polygon.data.odp_deviceportnumber - polygon.data.odp_portidlenumber) / polygon.data.building_count) * 100).toFixed()
        : polygon.data.penetrasi_percent.toFixed(2)
      : 0;
    let color;
    if (penetrasi <= 0) {
      color = "#073A5F";
    } else if (penetrasi <= 10) {
      color = "#0762A4";
    } else if (penetrasi <= 40) {
      color = "#0791A4";
    } else if (penetrasi > 40 && penetrasi <= 70) {
      color = "#07A446";
    } else if (penetrasi > 70 && penetrasi <= 100) {
      color = "#A1A407";
    } else if (penetrasi > 100 && penetrasi <= 150) {
      color = "#D1C345";
    } else {
      color = "#F1E78A";
    }
    polygon.setOptions({ fillColor: color, fillOpacity: 0.3 });
  })
}

export {
  fetchSummaryPenetrasiOdpBuilding,
  handleMode
}