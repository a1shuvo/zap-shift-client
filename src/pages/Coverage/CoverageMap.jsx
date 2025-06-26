import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CoverageMap = ({ warehouses, selectedDistrict }) => {
  const defaultPosition = [23.685, 90.3563]; // Center of Bangladesh

  const filteredWarehouses = selectedDistrict
    ? warehouses.filter((w) =>
        w.district.toLowerCase().includes(selectedDistrict.toLowerCase())
      )
    : warehouses;

  const mapCenter =
    filteredWarehouses.length > 0
      ? [filteredWarehouses[0].latitude, filteredWarehouses[0].longitude]
      : defaultPosition;

  return (
    <MapContainer
      center={mapCenter}
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: "600px", width: "60%", margin: "auto" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {filteredWarehouses.map((location, idx) => (
        <Marker
          key={idx}
          position={[location.latitude, location.longitude]}
          icon={pinIcon}
        >
          <Popup>
            <div>
              <strong>{location.city}</strong>
              <p>{location.covered_area.join(", ")}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CoverageMap;
