import { Avatar, Box, Button, colors, Rating, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/baseStore";
import CreateComentModal from "./CreateComentModal";
import Comment from './Comment';
import { API_HOST } from "../../../app/config";
import { changeOpenState } from "../../../app/store/authMenuSlice";

const MarkerDetailView = () => {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const detailMarker = useSelector((state: RootState) => state.detailMarker);

    const dispatch = useDispatch()
    const [rating, setRating] = useState<number>(0)

    useEffect(() => {
        setRating(detailMarker.comments.reduce((reducer: number, value: any) => {return reducer+value.rating}, 0)/detailMarker.comments.length)
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
                    height: '100%'
                }}
            >

                <CreateComentModal
                    isOpen={isModalOpen}
                    handleClose={()=>{
                        setIsModalOpen(false)
                    }}
                />
                {detailMarker?.photos?.length > 0 &&
                    <img 
                        src={`${API_HOST}/${detailMarker?.photos[0]?.photo_url}`} 
                    style={{
                        width: '100%',
                        height: 'auto'
                    }}
                    alt="img" />
                }
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
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)'
                    }}
                >
                    <Typography variant="marker_title">
                        Доступність:
                    </Typography>
                    {detailMarker.accesabilityList?.filter((value) => Object.values(value)[0]).map((value) => {
                            return <Typography variant="detail_list_accessability">
                                {Object.keys(value)[0]}
                            </Typography>
                            
                        })}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography>
                        Відгуки:
                    </Typography>
                    <Rating name="read-only" value={rating} readOnly />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        marginBottom: '20px'
                    }}
                >
                    {detailMarker?.comments?.map((value) => {
                        return(
                            <Comment
                                value={value}
                            />
                        )
                    })}
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        width: 'calc(100% - 40px)',
                        position: 'absolute',
                        bottom: '20px'
                    }}
                    onClick={()=>{
                        if (localStorage.getItem('username')){
                            setIsModalOpen(true)
                        } else {
                            dispatch(changeOpenState(true))
                        }
                    }}
                >
                    Написати відгук
                </Button>
            </Box>
        </Box>
        }
        </>
    )
}
export default MarkerDetailView