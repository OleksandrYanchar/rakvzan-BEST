import { Box, Typography } from "@mui/material"
import { commonQuestions, CommonQuestionsType } from "../assets/commonQuestions"
import AccourdionComponent from "./AccourdionComponent"

const CommonQuestions = () => {
    return (
        <Box
            sx={{
                padding: '64px 0',
                marginBottom: '100px'
            }}
        >
            <Typography 
                variant='h2' 
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    marginBottom: '60px'
                }}
            >
                Поширені питання
            </Typography>
            <Box>
                {commonQuestions?.map((value: CommonQuestionsType, index: number) => {
                    return (
                        <AccourdionComponent
                            value={value}
                        />
                    )
                })}
            </Box>
        </Box>
    )
}
export default CommonQuestions