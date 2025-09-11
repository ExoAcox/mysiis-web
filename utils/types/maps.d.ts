type Maps = google.maps.Map;
type MapMouseEvent = google.maps.MapMouseEvent;
type Marker = google.maps.Marker;
type AdvancedMarkerView = google.maps.marker.AdvancedMarkerView;
type Polyline = google.maps.Polyline;
type Polygon = google.maps.Polygon;
type Circle = google.maps.Circle;
type LatLng = { lat: number; lng: number };
type LatLngFunction = google.maps.LatLng;
type LatLngBounds = google.maps.LatLngBounds;
type DirectionsService = google.maps.DirectionsService;
type DirectionsRenderer = google.maps.DirectionsRenderer;
type Geocoder = google.maps.GeocoderAddressComponent;

interface InfoWindow extends google.maps.InfoWindow {
    getMap?: () => void;
    setMap?: (maps: Maps | null) => void;
}

type AutocompletePrediction = google.maps.AutocompletePrediction;
type HeatmapLayer = google.maps.visualization.HeatmapLayer;

type MapState = () => DOMStringMap;
