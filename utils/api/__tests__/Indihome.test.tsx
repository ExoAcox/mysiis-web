import {
    getMyIhxAddressTranslate,
    getMyIhxAddressTranslateDetail,
    getMyIhxFunnel,
    getMyIhxFunnelDetail,
    getMyIhxFunnelDetailRaw,
    getMyIhxFunnelRaw,
    getMyIhxFunnelV2,
    getMyIhxFunnelV2Detail,
} from "@api/indihome";

import { fetch } from "@functions/test";

test("getMyIhxAddressTranslate", async () => {
    fetch({ method: "get", func: getMyIhxAddressTranslate });
});

test("getMyIhxAddressTranslateDetail", async () => {
    fetch({ method: "get", func: getMyIhxAddressTranslateDetail });
});

test("getMyIhxFunnel", async () => {
    fetch({ method: "get", func: getMyIhxFunnel });
});

test("getMyIhxFunnelRaw", async () => {
    fetch({ method: "get", func: getMyIhxFunnelRaw });
});

test("getMyIhxFunnelV2", async () => {
    fetch({ method: "get", func: getMyIhxFunnelV2 });
});

test("getMyIhxFunnelDetail", async () => {
    fetch({ method: "get", func: getMyIhxFunnelDetail });
});

test("getMyIhxFunnelDetailRaw", async () => {
    fetch({ method: "get", func: getMyIhxFunnelDetailRaw });
});

test("getMyIhxFunnelV2Detail", async () => {
    fetch({ method: "get", func: getMyIhxFunnelV2Detail });
});

// test("getTrackidDetail", async () => {
//     axios.get.mockResolvedValueOnce({
//         data: {
//             data: {
//                 event_user_kyc: {
//                     positive: "",
//                     negative: "",
//                 },
//             },
//         },
//     });
//     fetch({ method: "post", func: getTrackidDetail });
// });
