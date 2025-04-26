import { descritionItems } from "../assets/descriptionItems"
import { DescritopnType } from "../../../types/descritopnType"
import DescriptionComponent from "./DescriptionComponent"
import { Box } from "@mui/material"

const BenefitsList = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                margin: '100px 0'
            }}
        >
            {descritionItems?.map((value: DescritopnType, index: number) => {
                return(
                    <DescriptionComponent
                        key={index}
                        item={value}
                    />
                )
            })}
        </Box>
    )
}
export default BenefitsList