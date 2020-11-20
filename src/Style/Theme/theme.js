import { createMuiTheme } from "@material-ui/core/styles";
import barlowFontArray from '../Font/font.js'
import './theme.css';


const Theme = createMuiTheme({
    palette: {
        primary: {
            main: '#45A9BF'
        },
        secondary: {
            main: '#7A4F8C'
        },
        teriary: {
            main: '#F2DB94',
            light: '#ffffc5',
            dark: '#beaa65',
            contrastText: '#000000'
        },
        quaternary: {
            main: '#F25252',
            light: '#ff857e',
            dark: '#b91529',
            contrastText: '#000000'
        }

    },
    typography: {
        body1: {
            fontFamily: 'Barlow-Regular-webfont, David',
            fontSize: 20
        },
        button: {
            fontFamily: 'Helvetica'
        }

    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [...barlowFontArray],
                'body': { 
                    lineHeight: 'normal',
                 }
            },
        }
    },
});
export default Theme;
