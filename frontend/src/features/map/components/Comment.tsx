import { Avatar, Box, colors, Rating, Typography } from "@mui/material"
import { FC } from "react"
import { API_HOST } from "../../../app/config"

interface CommentInterface {
    value: any
}

const Comment: FC<CommentInterface> = ({ value }) => {
    return(
        <Box
            sx={{
                background: colors.grey[200],
                borderRadius: '20px',
                padding: '12px',
                width: 'calc(100% - 50px)',
                marginBottom: '15px'
            }}
        >
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <Avatar 
                    alt={value.user_name} 
                    src="/static/images/avatar/1.jpg"
                    />
                    <Box
                        sx={{
                            marginLeft: '10px'
                        }}
                    >
                        <Typography>
                            {value.user_name}
                        </Typography>
                        <Box>
                            <Rating name="read-only" value={value.rating} readOnly />
                        </Box>
                    </Box>
            </Box>
            {value.comment}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    overflowX: 'auto'
                }}
            >
                {value?.images?.map((image: any) => {
                    return(
                        <img src={`${API_HOST}/${image.image_url}`} style={{ width: '90px', height: '90px' }} alt="" />
                    )
                })}
            </Box>
        </Box>
    )
}
export default Comment