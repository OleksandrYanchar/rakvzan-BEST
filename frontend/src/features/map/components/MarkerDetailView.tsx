import { Avatar, Box, Button, colors, Rating, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/baseStore";
import CreateComentModal from "./CreateComentModal";
import { API_HOST } from "../../../app/config";
import { changeOpenState } from "../../../app/store/authMenuSlice";
import { useLazyGetPointQuery } from "../slices/mapSLice";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MarkerDetailView = () => {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const detailMarker = useSelector((state: RootState) => state.detailMarker);
    const [triggerGetPointData, {data}] = useLazyGetPointQuery()

    const dispatch = useDispatch()

    useEffect(() => {
        detailMarker?.id && triggerGetPointData(detailMarker.id)
    }, [detailMarker])

    return(
        <>
        {detailMarker.isOpen &&
        <Box
            sx={{
                position: 'fixed',
                height: '80svh',
                width: {sm: '80swv', md: '20svw'},
                top: '10svh',
                right: '20px',
                background: colors.common.white,
                zIndex: 500,
                borderRadius: '25px',
                padding: '24px',
                overflowY: 'auto',
            }}
        >
            <Box
                sx={{
                    overflowY: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >

                <CreateComentModal
                    isOpen={isModalOpen}
                    handleClose={()=>{
                        setIsModalOpen(false)
                    }}
                />
                {detailMarker?.photos?.length > 0 &&
                <Carousel>
                    {data?.data?.establishment?.photos?.map((value: any) => {
                        return(
                            <img 
                                src={`${API_HOST}/${value?.photo_url}`} 
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                                alt="img" />
                        )
                    })}
                </Carousel>}
                <Typography
                    variant="subtitle1"
                >
                    {detailMarker.title}
                </Typography>
                <Typography
                    variant="detail_list_subtitle"
                    sx={{
                        margin: '12px 0 16px 0'
                    }}
                >
                    {detailMarker.address}
                </Typography>
                <Typography
                    variant="detail_list_subtitle"
                    sx={{
                        margin: '12px 0 16px 0'
                    }}
                >
                     {data?.data?.establishment?.description}
                </Typography>
               
                <Button
                    variant="contained"
                    sx={{
                        width: 'calc(100% - 80px)',
                        position: 'absolute',
                        bottom: '20px',
                        left: '40px'
                    }}
                    onClick={()=>{
                        if (localStorage.getItem('username')){
                            setIsModalOpen(true)
                        } else {
                            dispatch(changeOpenState(true))
                        }
                    }}
                >
                    Допомогти
                </Button>
            </Box>
        </Box>
        }
        </>
    )
}
export default MarkerDetailView