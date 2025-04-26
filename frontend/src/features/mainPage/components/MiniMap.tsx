import { Box, colors, Typography } from "@mui/material"
import { maps } from '../assets/map/maps'
import { cloneElement, useState } from "react"

const MiniMap = () => {

    const [selectedText, setSelectedText] = useState<string | null>(null)
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
                            console.log('Hover on', pathElement.props['data-name'])
                            setSelectedText(pathElement.props['data-name'])
                          },
                          // коли миша пішла
                          onMouseLeave: (e: any) => {
                            e.target.style.fill = ''
                            setSelectedText(null)
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