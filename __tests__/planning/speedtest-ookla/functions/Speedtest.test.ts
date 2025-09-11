import { getColor } from "@features/planning/speedtest-ookla/functions/speedtest";

describe("Get Color Speedtest Ookla", () => {
    test("It should return color", () => {
        const isps = ["Telkom", "Biznet", "MNC Play", "FirstMedia", "CBN", "MyRepublic", "Balifiber", "Stroomnet", "Oxygen", "XL", "IM3 Ooredoo", "Iconnet", "XL Home", "Telkomsel", "Indosat", "INDOSAT", "Smartfren", "3"];

        isps.map((isp) => getColor(isp));
    });
});