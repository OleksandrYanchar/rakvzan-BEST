import { Box, Grid } from "@mui/material"
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"
import { compareComponents, CompareTypes } from "../assets/compareItems"

const ImagesComparing = () => {
    return (
        <Box
            sx={{
                width: 'calc(100% - 80px)',
                height: '50svh',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#09030D',
                borderRadius: '25px',
                position: 'relative',
                padding: '40px',
                '&.MuiBox-root> *: first-child, &.MuiBox-root> *: last-child': {
                    height: '80%'
                }
            }}
        >
            
           
                {compareComponents?.map((value: CompareTypes, index: number) => {
                    return (
                        <ReactCompareSlider
                            key={index}
                            itemOne={<ReactCompareSliderImage src={value.itemOne} srcSet={value.itemOne} alt="Image one" />}
                            itemTwo={<ReactCompareSliderImage src={value.itemTwo} srcSet={value.itemTwo} alt="Image two" />}
                        />
                    )
                })}
        </Box>
    )
}
export default ImagesComparing