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
    const [accessibility, setAccessibility] = useState<any[]>([])

    const dispatch = useDispatch()

    useEffect(() => {
        if (data?.data){
            setAccessibility(getAccessibilityList(data?.data))
        }
    }, [data])
    return (
        <Grid
            container
            sx={{
                width: '100%'
            }}
            spacing={2}
        >
            <Grid size={4}>
                <img 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill'
                    }}
                    src={`${API_HOST}/${data?.data?.photos[0]?.photo_url}`} 
                />
            </Grid>
            <Grid 
                size={8}
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}    
            >
                <Typography variant="marker_title">
                    {data?.data?.name}
                </Typography>
                <Typography variant="marker_sub_title">
                    {data?.data?.address}
                </Typography>
                
                <Alert severity="info">
                    Оцінка генерована за допомогою ШІ
                    {data?.data?.raiting && <Rating name="read-only" value={data?.data?.raiting} readOnly />}
                </Alert>
                {data?.data?.raiting && <Rating name="read-only" value={data?.data?.comments.reduce((reducer: number, value: any) => {return reducer+value.rating}, 0)/ data?.data?.comments.length} readOnly />}
                <Typography variant="marker_title">
                    Доступність
                </Typography>
                <Box
                    sx={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {accessibility.length > 0 && accessibility?.filter((value) => Object.values(value)[0]).map((value) => {
                        return <Typography variant="marker_list_component">
                            {Object.keys(value)[0]}
                        </Typography>
                        
                    })}
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Tooltip 
                        title={
                            <Fragment>
                                <Typography>
                                    Маршрут будується штучним інтелектом і може різнитись в залежності від багатьох умов
                                </Typography>
                                <Button
                                    onClick={()=>{
                                        setEndPosition({
                                            lng: data?.data.longitude,
                                            lat: data?.data.latitude,
                                        })
                                    }}
                                    sx={{
                                        width: '100%'
                                    }}
                                    variant="contained"
                                >
                                    Будувати
                                </Button>
                            </Fragment>
                        }
                    >
                            <Button
                                variant="contained"
                            >
                                Прокласти маршрут
                        </Button>
                    </Tooltip>
                    
                    <Button
                        variant="outlined"
                        sx={{
                            textDecoration: 'none'
                        }}
                        onClick={()=>{
                            dispatch(setValues({
                                isOpen: true,
                                title: data?.data?.name,
                                address: data?.data?.address,
                                accesabilityList: accessibility,
                                comments: data?.data?.comments,
                                rating: data?.data?.raiting,
                                photos: data?.data?.photos,
                                id: data?.data?.id
                            }))
                        }}
                    >
                        i
                    </Button>
                </Box>
            </Grid>
            
        </Grid>
    )
}
export default MarkerIconComponent