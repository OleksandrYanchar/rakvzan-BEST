import { Button, Grid, Typography } from "@mui/material"
import { ReactComponent as HowItWorksImage } from '../assets/images/howItWorksImage.svg'

const HowItWorks = () => {
    return(
        <Grid
            container
            spacing={2}
            sx={{
                margin: '100px 0',
                width: '100%'
            }}
        >
            <Grid
                size={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'center'
                }}
            >
                <Typography variant="heshtagWords">
                    #НЕ ЗВОЛІКАЙ
                </Typography>
                <Typography variant="h3">
                    Як працює <br/> підрахунок збитків
                </Typography>
                <Typography variant="h5">
                Наш алгоритм збирає дані про руйнування через офіційні<br/>
                 джерела та супутникові знімки. Після цього система автоматично<br/>
                  обраховує приблизні втрати, враховуючи тип об'єкта, площу<br/>
                   пошкодження та вартість відновлення.
                </Typography>
                <Button
                        variant="contained"
                        sx={{
                            padding: '16px 28px',
                            fontSize: '18px',
                            marginTop: '30px'
                        }}
                    >
                        Долучайся і відновлюй
                    </Button>
            </Grid>
            <Grid
                size={6}
            >
                <HowItWorksImage/>
            </Grid>
        </Grid>
    )
}
export default HowItWorks