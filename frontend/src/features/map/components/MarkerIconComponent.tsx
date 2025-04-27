import { Alert, Box, Button, Grid, Paper, Rating, Tooltip, Typography } from "@mui/material"
import { useGetPointQuery, useLazyBuildRouteQuery } from "../slices/mapSLice"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { getAccessibilityList } from "../../../utils/getAccessibilityList"
import { useDispatch } from "react-redux"
import { setValues } from "../../../app/store/detailMarkerSlice"
import { BaseCoorsType } from "../../../types/baseCoorsType"
import { API_HOST } from "../../../app/config"

interface MarkerIconComponentInterface {
    id: number
    setEndPosition: (value: BaseCoorsType | null) => void
    triggerGetMarkers: (body: {lat_a: number, lon_a: number, lat_b: number, lon_b: number}) => void
}

const MarkerIconComponent: FC<MarkerIconComponentInterface> = ({ id, setEndPosition }) => {
    const {data} = useGetPointQuery(id)

    const dispatch = useDispatch()

    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Box>
                <img 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill'
                    }}
                    src={`${API_HOST}/${data?.data?.establishment?.photos[0]?.photo_url}`} 
                />
            </Box>
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}    
            >
                <Typography variant="marker_title">
                    {data?.data?.establishment?.name}
                </Typography>
                <Typography variant="marker_sub_title">
                    {data?.data?.establishment?.address}
                </Typography>
                
                <Box
                    sx={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography variant='detail_list_subtitle'>
                        123 грн
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{
                            textDecoration: 'none',
                        }}
                        onClick={()=>{
                            dispatch(setValues({
                                isOpen: true,
                                title: data?.data?.establishment?.name,
                                address: data?.data?.establishment?.address,
                                accesabilityList: [],
                                comments: [],
                                rating: 0,
                                photos: data?.data?.establishment?.photos,
                                id: data?.data?.establishment?.id
                            }))
                        }}
                    >
                        ?
                    </Button>
                </Box>
            </Box>
            
        </Box>
    )
}
export default MarkerIconComponent