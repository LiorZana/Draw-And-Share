// import React from 'react';


// const ReactStyleSvg = ({ svgproperties }) => {
//     if (svgproperties !== undefined) {
//         const [chunkedLineStyles, backgroundProperties, paths] = [...svgproperties]
//         const [svgHeight, svgWidth, svgBackgroundColor, svgXmlns, svgClass] = backgroundProperties.map(prop => Object.values(prop)[0])
        

//         // const test = chunkedLineStyles.map(styleArr => {
//         //     return styleArr.map(style => console.log(style))
//         // })
//         //console.log(test)

//         return (
//             <div style={{
//                 width: '800px',
//                 height: '600px',
//                 border: '1px solid black',
//                 float: 'left',
//                 cursor: 'crosshair'
//               }}>
//                 <svg xmlns={svgXmlns} className={svgClass} style={{ height: svgHeight, width: svgWidth, backgroundColor: svgBackgroundColor }}>

//                     {paths.map((path, i) => {
                        
//                         return <path key={i} transform={path.transform} className={path.class} d={path.d} />
//                     })}
//                 </svg>
//             </div>
//         )
//     } else {
//         return (false);
//     }


// }

// const BufferImage = ({ drawCanvasRef }) => {


//     const getSvgProperties = () => {
//         if (drawCanvasRef !== '') {
//             const regex = /([\w-]*)\s*:\s*([^;]*)/g

//             const matchStyle = drawCanvasRef.match(regex);
//             const firstStyle = matchStyle[0].split('style="')[1]
//             const filteredStyle = matchStyle.filter((style, i) => i > 0)

//             const newStyle = [firstStyle, ...filteredStyle]
//             const camelize = (string) => string.replace(/-([a-z])/g, (s, group) => group.toUpperCase());
//             const camelizedStyles = newStyle.map(style => camelize(style));





//             const lineStyles = camelizedStyles.filter((s, i) => i > 2)


//             const style2object = (style) => style.split(';').filter(s => s.length)
//                 .reduce((a, b) => {
//                     const keyValue = b.split(':');
//                     a[camelize(keyValue[0])] = keyValue[1];
//                     return a;
//                 }, {});

//             const prop2object = (style) => style.split(';').filter(s => s.length)
//                 .reduce((a, b) => {
//                     const keyValue = b.slice(0, b.length - 1).split('="');
//                     a[camelize(keyValue[0])] = keyValue[1];
//                     return a;
//                 }, {});

//             const backgroundProperties = [...camelizedStyles.filter((s, i) => i < 3)].map(style => style2object(style))
//             const extraProps = drawCanvasRef.match(/(xmlns=")[\w]+([^"])+"\s[\w]+="[\w]+"/g)[0].split(' ').map(prop => prop2object(prop));
//             const svgProperties = [...backgroundProperties, ...extraProps]

//             const chunk = (arr, size) => {
//                 let mainArray = [];
//                 let subArray = [];
//                 for (let i = 0; i < arr.length; i++) {
//                     subArray.push(arr[i]);
//                     if ((i + 1) % size === 0 || i === (arr.length - 1)) {
//                         mainArray.push(subArray);
//                         subArray = [];
//                     }
//                 }
//                 return mainArray;
//             }

//             const chunkedObjectLineStyles = chunk(lineStyles.map(style => style2object(style)), 5);
//             const stringStyleTags = drawCanvasRef.replace(/(style=")[\w]+([^"])+"/g, { x: 10, y: 10 })
//             const element = document.createElement('div');
//             //const noStyleElement = drawCanvasRef.replace(/(style=")[\w]+([^"])+"/g, '')
//             element.innerHTML = drawCanvasRef;
//             const paths = Array.from(element.firstChild.childNodes).map(prop => {
//                 if(prop.hasAttributes){
//                     console.log(prop)
//                     return { transform: prop.getAttribute(prop.getAttributeNames()[0]), class: prop.getAttribute(prop.getAttributeNames()[1]), d: prop.getAttribute(prop.getAttributeNames()[2]) }
//                 } else {
//                     return prop;
//                 }
                
//             })
//             return [chunkedObjectLineStyles, svgProperties, paths];

//         }
//     }


//     return <>
//         <ReactStyleSvg svgproperties={getSvgProperties()} />
//         <img alt=''></img>
//     </>

// }

// export default BufferImage;