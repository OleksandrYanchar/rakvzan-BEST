import { Box, colors, Typography } from "@mui/material"
import { FC, ReactNode } from "react"
import { DescritopnType } from "../../../types/descritopnType"

interface DescriptionComponentInterface {
    item: DescritopnType
}

const DescriptionComponent: FC<DescriptionComponentInterface> = ({
    item
}) => {
    const { image, title, description } = item
    return(
        <Box
            sx={{
                display: 'flex'
            }}
        >
            {image}
            <Box>
                <Typography variant="subtitle1" sx={{ margin: '32px 0 12px 0' }}>
                    {title}
                </Typography>
                <Typography variant="subtitle2">
                    {description}
                </Typography>
            </Box>
        </Box>
    )
}

export default DescriptionComponent