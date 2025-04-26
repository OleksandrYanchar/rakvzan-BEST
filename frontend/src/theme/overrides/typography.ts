import { colors, createTheme } from "@mui/material";

export const theme = createTheme({
    typography: {
        h2: {
            fontWeight: 600,
            fontSize: '64px'
        },
        h3: {
            fontSize: '48px',
            color: colors.common.black,
            fontWeight: 700
        },
        h4: {
            fontSize: '40px',
            fontWeight: 700
        },
        subtitle2: {
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '100%'
        },
        subtitle1: {
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '100%'
        },
        h5:{
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            marginTop: '10px'
        },
        marker_title: {
            fontSize: '14px',
            fontWeight: 600,
        },
        marker_sub_title: {
            fontSize: '14px',
            fontWeight: 400,
            marginTop: '6px'
        },
        marker_list_component: {
            fontSize: '14px',
            fontWeight: 400,
            marginTop: '6px'
        },
        detail_list_subtitle: {
            fontSize: '12px',
            fontWeight: 400,
            marginTop: '6px'
        },
        detail_list_accessability: {
            fontSize: '10px',
            fontWeight: 500,
        },
        heshtagWords: {
            fontSize: '16px',
            fontWeight: '570',
            marginBottom: '40px'
        },
        title: {
            fontSize: '64px',
            marginBottom: '10px'
        },
        subTitle: {
            fontSize: '16px',
            color: '#AFAFAF',
            marginBottom: '46px'
        },
        accurdionTitle: {
            fontSize: '24px',
            fontWeight: 700
        }

    }
})