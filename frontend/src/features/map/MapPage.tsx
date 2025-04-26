import { Alert, Box, Button, Snackbar } from "@mui/material"
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLazyBuildRouteQuery, useLazyGetPointsQuery } from "./slices/mapSLice";
import { ReactComponent as MarkerIcon } from './assets/images/marker.svg'
import { customAddIcon, customIcon } from "./components/CustomMarker";
import { BaseCoorsType } from "../../types/baseCoorsType";
import MarkerIconComponent from "./components/MarkerIconComponent";
import MarkerDetailView from "./components/MarkerDetailView";
import { useDispatch } from "react-redux";
import { chaneIsOpen } from "../../app/store/detailMarkerSlice";
import CreateMarkerModal from "./components/CreateMarkerModal";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import RoutingMachine from "./components/RoutingMachine";
import MapFilterPanel from "./components/MapFilterPanel";
import { AccessibilityListEnum } from "../../utils/getAccessibilityList";
import TuneIcon from '@mui/icons-material/Tune';
import { changeOpenState } from "../../app/store/authMenuSlice";


function ClickHandler({ onMapClick }: any) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick(e.latlng);
    }
  });
  return null;
}

const MapPage = () => {
  const [tempMark, setTempMark] = useState<BaseCoorsType | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  // const [userPosition, setUserPosition] = useState<BaseCoorsType | null>({lng: 24.039995670318607, lat: 49.84636825169357});
  // const [endPosition, setEndPosition] = useState<BaseCoorsType | null>({lng: 24.022765159606937, lat: 49.839601606714496});
  const [userPosition, setUserPosition] = useState<BaseCoorsType | null>(null);
  const [endPosition, setEndPosition] = useState<BaseCoorsType | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [accessibilityChecked, setAccessibilityChecked] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
  const [existingRoutes, setExistingRoutes] = useState<BaseCoorsType[]>([])
  const [showError, setShowError] = useState<boolean>(false)

  const [triggerGetRoutes, {data: routes}] = useLazyBuildRouteQuery()

  useEffect(() => {
    let tempArray = routes?.data?.data?.map((value: number[]) => ({lat: value[0], lng: value[1]}))
    setExistingRoutes(tempArray)
  }, [routes])

  useEffect(() => {
    if(endPosition && userPosition) {
      triggerGetRoutes({
        lat_a: userPosition.lat,
        lon_a: userPosition.lng,
        lat_b: endPosition.lat,
        lon_b: endPosition.lng,
      })
    }
  }, [endPosition, userPosition])

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(
        (position) => {
          // setUserPosition({
          //   lat: position.coords.latitude,
          //   lng: position.coords.longitude,
          // });
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Помилка отримання геолокації:', error);
          setShowError(true)
        }
      );
    } else {
      setShowError(true)
    }
  }, []);

  const [triggerGetPoints, data] = useLazyGetPointsQuery({})

  const dispatch = useDispatch()

  useEffect(() => {
    triggerGetPoints({})
  }, [])

  useEffect(() => {
    dispatch(chaneIsOpen(false))
  }, [tempMark])

    return (
      <Box
        sx={{
          '& .leaflet-popup-content-wrapper' :{
            width: '600px',
            display: 'flex',
            justifyContent: 'center'
          },
          '& .leaflet-popup-content' :{
            width: 'calc(100% - 60px) !important',
            display: 'flex',
            justifyContent: 'center'
          },
          '& .leaflet-routing-container: last-child' :{
            display: 'none'
          },
        }}
      >
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={()=>{setShowError(false)}}
        >
           <Alert
            onClose={()=>{setShowError(false)}}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Немає доступу до ваших геоданих!
        </Alert>
          </Snackbar>
        <TuneIcon
          sx={{
            position: 'absolute',
            top: '100px',
            zIndex: 500,
            right: '50px'
          }}
          onClick={()=>{
            setIsFiltersOpen(!isFiltersOpen)
          }}
        />
        <MapFilterPanel
          categories={Object.values(AccessibilityListEnum)}
          selectedCategories={selectedCategories}
          onChangeCategories={setSelectedCategories}
          accessibilityChecked={accessibilityChecked}
          onChangeAccessibility={setAccessibilityChecked}
          isOpen={isFiltersOpen}
          handleClose={()=>{
            setIsFiltersOpen(false)
          }}
          onApply={()=>{
            let filteredKeys: any = []
            Object.keys(AccessibilityListEnum).forEach((value: string) =>{
              if(selectedCategories.includes(AccessibilityListEnum[value as keyof typeof AccessibilityListEnum])){
                filteredKeys[value as keyof typeof filteredKeys] = true
              }
            })
            triggerGetPoints(filteredKeys)
            setIsFiltersOpen(false)
          }}
          onCancel={()=>{
            triggerGetPoints({})
            setIsFiltersOpen(false)
            setSelectedCategories([])
          }}
        />
        <CreateMarkerModal
          isOpen={isCreateModalOpen}
          handleClose={()=>{
            setIsCreateModalOpen(false)
          }}
          lat={tempMark?.lat || 0}
          lng={tempMark?.lng || 0}
        />
          <MarkerDetailView/>
          <MapContainer center={[49.8397, 24.0297]} zoom={16} style={{ height: "100svh", width: "100%", borderRadius: '15px' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onMapClick={(coors: BaseCoorsType)=>{
              if (tempMark) {
                setTempMark(null)
              } else {
                setTempMark({lng: coors.lng, lat: coors.lat})
              }
            }} />
            {data?.data?.data?.length > 0 && data?.data?.data?.map((position: any, idx: number) => {
              return ( <Marker key={`marker-${idx}`} position={[position.latitude, position.longitude]} icon={customIcon}>
                  <Popup>
                    <MarkerIconComponent
                      id={position.id}
                      setEndPosition={setEndPosition}
                      triggerGetMarkers={triggerGetRoutes}
                    />
                  </Popup>
                </Marker>)
              })
            }
            {tempMark &&
              <Marker position={[tempMark.lat, tempMark.lng]} icon={customAddIcon}>
                <Popup>
                    <Button
                      variant="contained"
                      onClick={()=>{
                        if (localStorage.getItem('username')){
                        setIsCreateModalOpen(true)
                        } else {
                          dispatch(changeOpenState(true))
                        }
                      }}
                    >
                      Запропонувати локацію
                    </Button>
                  </Popup>
              </Marker>
            }
            
            {routes?.data?.data && existingRoutes && <RoutingMachine points={existingRoutes} />}
            {/* {routes?.data?.data && <RoutingMachine points={[
              {lat: 49.5419392, lng: 25.6835584},
              {lat: 49.55874, lng: 25.62193},
              {lat: 49.56806, lng: 25.55373},
              {lat: 49.57597, lng: 25.49114},
              {lat: 49.58483, lng: 25.42253},
              {lat: 49.59908, lng: 25.3586},
              {lat: 49.61009, lng: 25.29328},
              {lat: 49.62441, lng: 25.23207},
              {lat: 49.63982, lng: 25.16355},
              {lat: 49.65132, lng: 25.09748},
              {lat: 49.66557, lng: 25.02972},
              {lat: 49.67621, lng: 24.96569},
              {lat: 49.69248, lng: 24.90437},
              {lat: 49.70033, lng: 24.84182},
              {lat: 49.71479, lng: 24.77878},
              {lat: 49.72416, lng: 24.71417},
              {lat: 49.74087, lng: 24.65308},
              {lat: 49.7546, lng: 24.58632},
              {lat: 49.76551, lng: 24.5218},
              {lat: 49.77995, lng: 24.45918},
              {lat: 49.79554, lng: 24.3964},
              {lat: 49.80719, lng: 24.33164},
              {lat: 49.82191, lng: 24.26311},
              {lat: 49.83785, lng: 24.20152},
              {lat: 49.85093, lng: 24.13964},
            ]} />} */}
            {/* <Polyline positions={positions.map(pos => [pos.lat, pos.lng])} /> */}
          </MapContainer>
      </Box>
      );
}
export default MapPage