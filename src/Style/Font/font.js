import BarlowRegular from './BarlowRegularwebfont.woff';
import BarlowBold from './BarlowBoldwebfont.woff';


const barlowRegularFont = {
    fontFamily: 'Barlow-Regular-webfont',
    fontWeight: 400,
    fontSize: 16,
    src: `local('BarlowRegularwebfont'),
        url(${BarlowRegular}) format ('woff')`,
}

const barlowBoldFont = {
    fontFamily: 'Barlow-Regular-webfont',
    fontWeight: 700,
    fontSize: 16,
    src: `local('BarlowBoldwebfont'),
        url(${BarlowBold}) format ('woff')`,
}

const fontArray = [barlowRegularFont, barlowBoldFont];
export default fontArray;