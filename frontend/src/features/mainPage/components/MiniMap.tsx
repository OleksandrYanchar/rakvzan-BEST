import { Box, colors, Typography } from "@mui/material"
import { cityCoords, CityCoordsType, maps } from '../assets/map/maps'
import { cloneElement, useState } from "react"
import { useNavigate } from "react-router-dom";

const MiniMap = () => {

    const [selectedText, setSelectedText] = useState<string | null>(null);

    const navigate = useNavigate();
    return (
        <Box
            sx={{
                width: '100%',
                height: '50svh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#09030D',
                borderRadius: '25px',
                position: 'relative'
            }}
        >
            <Typography
                sx={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    color: colors.common.white,
                    top: '0',
                    fontSize: "25px"
                }}
            >
                {selectedText}
            </Typography>
            <Typography
                sx={{
                    position: 'absolute',
                    color: colors.common.white,
                    bottom: '24px',
                    left: '24px',
                    fontSize: "24px"
                }}
            >
                На данній карті ви зможете <br/> обрати область котра вас<br/> цікавить і ознайомитись з<br/> наслідками.
            </Typography>
            <svg
            stroke={colors.common.white}
            strokeWidth={2}
                style={{
                    width: '50%',
                    height: '70%',
                }}
            >
                {maps.map((pathElement, i) =>
                    cloneElement(pathElement, {
                        key: pathElement.props.id ?? i,
                        onMouseEnter: (e: any) => {
                            e.target.style.fill = '#a74ddf'
                            setSelectedText(pathElement.props['data-name'])
                          },
                          // коли миша пішла
                          onMouseLeave: (e: any) => {
                            e.target.style.fill = ''
                            setSelectedText(null)
                          },
                          onClick: () => {
                            const foundedCoors: CityCoordsType | undefined = cityCoords.find((value: CityCoordsType) => value.id === pathElement.props.id)
                            localStorage.setItem('tempCoors', JSON.stringify(foundedCoors))
                            navigate('/map')
                          },
                          style: {
                            transition: 'fill 0.2s',
                            cursor: 'pointer',
                            ...pathElement.props.style
                          }
                    })
                )}
            </svg>
        </Box>

    )
}
export default MiniMap