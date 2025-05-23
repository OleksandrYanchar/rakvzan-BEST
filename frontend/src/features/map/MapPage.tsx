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
import { CityCoordsType } from "../mainPage/assets/map/maps";


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
  const [tempCenter, setTempCenter] = useState<{lng: number, lat: number} |null>(null)
  const [firstLoadState, setFirsLoadState] = useState<boolean>(false)
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
    console.log(localStorage.getItem('tempCoors'))
    let tempValue = JSON.parse(localStorage.getItem('tempCoors') || '{}') as CityCoordsType;
    if (tempValue.id) {
      console.log('1')
      setTempCenter({lng: tempValue.lng, lat: tempValue.lat});
      return;
    } else {
      console.log('2')
      if (!navigator.geolocation) {
        setShowError(true)
        setTempCenter({
          lat: 50.4501, 
          lng: 30.5234
        })
        return;
      } else {
        console.log('3')
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setTempCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
        )
      }
    }

    setFirsLoadState(true)
  }, [])

  useEffect(() => {
    console.log(tempCenter, firstLoadState)
  }, [tempCenter])

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
            width: '250px',
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
        <CreateMarkerModal
          isOpen={isCreateModalOpen}
          handleClose={()=>{
            setIsCreateModalOpen(false)
          }}
          lat={tempMark?.lat || 0}
          lng={tempMark?.lng || 0}
        />
          <MarkerDetailView/>
          {tempCenter && <MapContainer center={[tempCenter.lat, tempCenter.lng]} zoom={16} style={{ height: "100svh", width: "100%", borderRadius: '15px' }}>
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
          </MapContainer>}
      </Box>
      );
}
export default MapPage