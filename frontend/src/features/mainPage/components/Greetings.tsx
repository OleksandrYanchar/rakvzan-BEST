import { Box, Button, colors, Typography } from "@mui/material"
import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { AnimatedModel } from '../components/AnimatedModel'

const Greetings = () => {
    const modelRef = useRef(null)
    
    
    return(
        <Box
            sx={{
            }}
        >
            <Box
                sx={{
                    borderRadius: '25px',
                    height: '70svh',
                    position: 'relative'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        color: colors.common.white,
                        zIndex: 10,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'start',
                        left: '60px'
                    }}
                >
                    <Typography variant="heshtagWords">
                        #СЛАВА УРКАЇНІ
                    </Typography>
                    <Typography variant="title">
                    Підрахунок <br/>
                    збитків внаслідок <br/>
                     війни в Україні
                    </Typography>
                    <Typography variant="subTitle">
                    Наш проєкт допомагає фіксувати збитки для справедливої компенсації, <br/>
                    планування відновлення та залучення міжнародної підтримки.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            padding: '16px 28px',
                            fontSize: '18px'
                        }}
                    >
                        Скористатися картою
                    </Button>
                </Box>
                <Canvas style={{ borderRadius: '25px' }}>
                    <ambientLight intensity={0.5} />
                    {/* <directionalLight position={[5, 10, 7]} /> */}
                    <AnimatedModel />
                    <color attach="background" args={['#09030D']} />
                </Canvas>

            </Box>
        </Box>
    )
}
export default Greetings