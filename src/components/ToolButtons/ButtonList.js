import brushIcon from '../../Style/Icons/023-paint-brush.png';
import selectIcon from '../../Style/Icons/038-crop-1.png';
import clearIcon from '../../Style/Icons/042-bin.png';
import undoIcon from '../../Style/Icons/UndoIcon40x40.png';
import redoIcon from '../../Style/Icons/RedoIcon40x40.png';
import galleryIcon from '../../Style/Icons/037-gallery.png';
import saveIcon from '../../Style/Icons/030-file-2.png';
import pngIcon from '../../Style/Icons/032-file-3.png';


const ButtonList = [
    {
        id: 1,
        text: 'Draw',
        image: brushIcon
    },
    {
        id: 2,
        text: 'Select',
        image: selectIcon,
    },
    {
        id: 3,
        text: 'Clear',
        image: clearIcon
    },
    {
        id: 4,
        text: 'Undo',
        image: undoIcon
    },
    {
        id: 5,
        text: 'Redo',
        image: redoIcon
    },
    {
        id: 6,
        text: 'Save as svg',
        image: saveIcon
    },
    {
        id: 7,
        text: 'Save as Png',
        image: pngIcon
    },
    {
        id: 8,
        text: 'Upload to gallery',
        image: galleryIcon,
        forRegistered: true
    },
]

export default ButtonList;