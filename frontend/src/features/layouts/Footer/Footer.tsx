import { Box, Button, colors, Divider, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <Box
            sx={{
                background: colors.blue[700],
                padding: '32px 0',
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <Typography
                sx={{ 
                    width: '100%',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                }}
                variant="h3"
            >
                Приєднуйся до спільноти, <br />
                що змінює міста!
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '18px'
                }}
            >
                <Link to='/contact'>
                    <Button 
                        variant='outlined'
                        color='info'
                        sx={{ 
                            color: colors.common.white,
                            width: 'auto',
                            borderColor: colors.common.white,
                        }}
                    >
                        Стати частиною платформи
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};
export default Footer;