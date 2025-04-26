import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { FC, useState } from 'react';
import { CommonQuestionsType } from '../assets/commonQuestions';
import CircleIcon from '@mui/icons-material/Circle';
import { colors } from '@mui/material';

interface AccourdionComponentInterface {
    value: CommonQuestionsType
}

const AccourdionComponent: FC<AccourdionComponentInterface> = ({
    value
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleChange = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Accordion 
            onChange={handleChange}
            sx={{
                background: isOpen?'#1D62EC':'#f1f1f1',
                padding: '14px 30px',
                marginBottom: '10px',
                borderRadius: '20px',
                borderTopLeftRadius: '20px !important',
                borderBottomRightRadius: '20px !important',
                borderBottomLeftRadius: '20px !important',
                borderTopRightRadius: '20px !important',
                color: isOpen? colors.common.white: colors.common.black,
                '&.MuiPaper-root::before': {
                    display: 'none'
                }
            }}
            
        >
        <AccordionSummary
          expandIcon={isOpen?<RemoveIcon/>:<AddIcon/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            <CircleIcon
                sx={{
                    fill: colors.common.white,
                    marginRight: '30px'
                }}
            /> 
          <Typography variant='accurdionTitle'>{value.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography variant='h5'>
                {value.content}
            </Typography>
        </AccordionDetails>
      </Accordion>
    )
}
export default AccourdionComponent