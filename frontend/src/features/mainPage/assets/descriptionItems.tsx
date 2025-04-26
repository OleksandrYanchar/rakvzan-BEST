import { DescritopnType } from "../../../types/descritopnType";
import { ReactComponent as FirstDescriptionImage } from './images/firstDescriptionImage.svg'
import { ReactComponent as SecondDescriptionImage } from './images/secondDescriptionImage.svg'

export const descritionItems: DescritopnType[] =[ 
    {
        title: 'Планувати ефективне відновлення',
        description: `Дані про масштаби руйнувань допомагають уряду та міжнародним організаціям розробити ефективні плани відбудови.`,
        image: <FirstDescriptionImage style={{ width: '100px', height: '100px' }}/>
    },
    {
        title: 'Прозора компенсація.',
        description: `Чіткий облік постраждалих об'єктів забезпечує справедливий розподіл коштів на компенсації для громадян та бізнесу.`,
        image: <SecondDescriptionImage style={{ width: '100px', height: '100px' }}/>
    },
    {
        title: 'Екологічна безпека.',
        description: `Оцінка екологічних збитків дає можливість швидше розпочати відновлення довкілля та запобігти подальшому забрудненню.`,
        image: <FirstDescriptionImage style={{ width: '100px', height: '100px' }}/>
    },
]