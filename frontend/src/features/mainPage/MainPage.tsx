import { Box } from "@mui/material"
import Greetings from "./components/Greetings"
import BenefitsList from "./components/BenefitsList"
import MiniMap from "./components/MiniMap"
import HowItWorks from "./components/HowItWorks"
import ImagesComparing from "./components/ImagesComparing"
import CommonQuestions from "./components/CommonQuestions"
import ContactUsBlock from "./components/ContactUsBlock"

const MainPage = () => {
    return(
        <Box
            sx={{
                overflow: 'hidden',
                padding: '3svw',
            }}
        >
            <Greetings/>
            <BenefitsList/>
            <MiniMap/>
            <HowItWorks/>
            <ImagesComparing/>
            <CommonQuestions/>
            <ContactUsBlock/>
        </Box>
    )
}
export default MainPage