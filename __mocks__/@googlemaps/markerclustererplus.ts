import { vi } from "vitest";

const MarkerClusterer = class MarkerClusterer {
    [x: string]: any;
    constructor() {
        this.clearMarkers = vi.fn();
        this.addMarkers = vi.fn();
    }
};

export default MarkerClusterer;
