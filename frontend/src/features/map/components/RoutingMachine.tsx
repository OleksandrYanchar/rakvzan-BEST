import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import '../assets/locales/locales';

// Інтерфейс для передачі масиву координат
interface RoutingProps {
  points: { lat: number; lng: number }[];
}

const RoutingMachine: React.FC<RoutingProps> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    // Перевірка: якщо мапи немає або масив точок порожній, виходимо
    if (!map || points.length === 0) return;

    // Створення масиву waypoints з координат
    const waypoints = points.map(point => L.latLng(point.lat, point.lng));

    //@ts-ignore
    const routingControl = L.Routing.control({
      waypoints: waypoints,
      language: 'uk',
      routeWhileDragging: true,
      //@ts-ignore
      createMarker: function(i, wp, nWps) {
        // Визначаємо тип маркера: перший - старт, останній - фініш, інші - проміжні точки
        const iconUrl = i === 0 
                          ? 'start.png' 
                          : i === nWps - 1 
                            ? 'end.png' 
                            : 'waypoint.png';
        return L.marker(wp.latLng, {
          icon: L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          })
        });
      }
    });

    routingControl.addTo(map);

    // Якщо потрібно прибрати контрол після демонтажу компонента,
    // можна повернути функцію очистки:
    // return () => map.removeControl(routingControl);
  }, [map, points]);

  return null;
};

export default RoutingMachine;
