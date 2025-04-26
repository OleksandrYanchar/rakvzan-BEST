import { Box, Button, Typography } from "@mui/material"

const ContactUsBlock = () => {
    return(
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
            }}
        >
            <Typography 
                variant='h5'
                sx={{
                    marginBottom: '30px'
                }}
            >
                Приєднюйся до нас
            </Typography>
            <Typography 
                variant='h3'
                sx={{
                    marginBottom: '10px'
                }}
            >
                Хочете побачити масштаби руйнувань?
            </Typography>
            <Typography 
                variant='subtitle1'
                sx={{
                    marginBottom: '30px'
                }}
            >
                Дізнайся детальніше про різні випадки
            </Typography>
            <Button
                variant='contained'
            >
                Підписуйтесь
            </Button>
        </Box>
    )
}
export default ContactUsBlock