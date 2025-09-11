import { OdpUim, getOdpUimByKelurahan } from "@api/odp";

import { errorHelper } from "@functions/common";

import { googleMapsDistrictOdp, odpAreaMarkersDistrictOdp } from "@pages/planning/odp-area/district-odp";

import { useDistrictOdpSummaryStore } from "../store";
import dayjs from "dayjs";

const fetchOdpUimByKelurahan = async (kode_desa_dagri: string, source: string) => {
  useDistrictOdpSummaryStore.setState({ status: "pending" });
  try {
    const resolve = await getOdpUimByKelurahan(kode_desa_dagri);
    useDistrictOdpSummaryStore.setState({
      data: {
        ...resolve.summary.total_port,
        status_occ_add: resolve.summary.status_occ_add,
        total_odp: resolve.lists.length,
        lists: resolve.lists,
        kode_desa_dagri: kode_desa_dagri,
      },
      status: "resolve",
    });
    if (source == "district-odp") {
      showDistrictOdp(resolve.lists);
    }
  } catch (error) {
    useDistrictOdpSummaryStore.setState({ status: "reject", error: errorHelper(error) });
  }
};

const showDistrictOdp = (district_odp: OdpUim[]) => {
  district_odp.forEach((data) => {
    let color;
    switch (data.status_occ_add) {
      case "RED":
        color = "red";
        break;
      case "ORANGE":
        color = "orange";
        break;
      case "YELLOW":
        color = "yellow";
        break;
      case "GREEN":
        color = "green";
        break;
      default:
        color = "black";
    }

    const marker = new window.google.maps.Marker({
      map: googleMapsDistrictOdp,
      position: { lat: data.lat, lng: data.long },
      icon: {
        anchor: new window.google.maps.Point(10, 10),
        url: `data:image/svg+xml;utf-8, \
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> \
                <circle cx="10" cy="10" r="${data.status_occ_add === "BLACK_SYSTEM" ? 6 : 8}" fill="${color}" ${data.status_occ_add === "BLACK_SYSTEM" ? `stroke="green" stroke-width="4"` : ""
          }></circle> \
          </svg>`,
      },
    });

    marker.set("name", data.devicename);

    const content = `
        <div " id="infowindow">
          <table >
            <tr>
              <td>Device ID <span>:</span></td>
              <td><b>${data.device_id}</b></td>
            </tr>
            <tr>
              <td>Device Name <span>:</span></td>
              <td><b>${data.devicename}</b></td>
            </tr>
            <tr>
              <td>Status <span>:</span></td>
              <td><b>${data.status_occ_add}</b></td>
            </tr>
            <tr>
              <td>Device Port <span>:</span></td>
              <td><b>${data.portinservicenumber}</b></td>
            </tr>
            <tr>
              <td>Idle Port <span>:</span></td>
              <td><b>${data.portidlenumber}</b></td>
            </tr>
            <tr>
              <td>Install Date <span>:</span></td>
              <td><b>${data.odp_install}</b></td>
            </tr>
            <tr>
              <td>Last Update <span>:</span></td>
              <td><b>${dayjs(data.updated_mysiis).format('YYYY-MM-DD')}</b></td>
            </tr>
          </table>
        </div>
      `;

    const infowindow = new window.google.maps.InfoWindow({
      content,
      zIndex: 2,
    });

    marker.set(
      "infoWindow",
      new window.google.maps.InfoWindow({
        content: content,
      })
    );

    marker.addListener("mouseover", () => {
      infowindow.open(googleMapsDistrictOdp, marker);
    });

    marker.addListener("mouseout", () => {
      infowindow.close();
    });
    odpAreaMarkersDistrictOdp.push(marker);
  });
  if (googleMapsDistrictOdp.getZoom()! < 16) googleMapsDistrictOdp.setZoom(16);
};

export { fetchOdpUimByKelurahan, showDistrictOdp };
