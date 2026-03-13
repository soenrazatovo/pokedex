import "./Divider.css"

function Divider({width, height, borderRadius, text = "", textSize, textColor = "black", backgroundColor, borderColor = "black", borderSize = 0, topCorner = true, bottomCorner = true, zIndex = 0, onClick}) {
    width = parseInt(width.toString().replace("px",""),10)
    height = parseInt(height.toString().replace("px",""),10)
    borderSize = parseInt(borderSize.toString().replace("px",""), 10)

    if (borderRadius){
        borderRadius = parseInt(borderRadius.toString().replace("px",""),10)
        if (!(width >= borderRadius*2 && height >= borderRadius*4 && borderRadius != undefined && borderRadius != "")) {
            borderRadius = Math.min(width/2,height/4)
        }
    } else {
        borderRadius = Math.min(width/2,height/4)
    }

    return(
        <>
            { (width >= borderRadius*2 && height >= borderRadius*4 && borderRadius != undefined && borderRadius != "") &&
                <div onClick={onClick} className={"divider-wrapper"} style={{width : width + borderSize/2 + "px", height : height-borderRadius*2 + "px", zIndex : zIndex}}>
                    <svg className={"divider-svg"} style={{width : width + borderSize/2 + "px", height : height + "px"}}>
                        <line x1={width} y1={topCorner ? 0 : borderRadius} x2={width} y2={bottomCorner ? height : height-borderRadius} stroke={backgroundColor} strokeWidth={borderSize}/>
                        <path d={
                        (topCorner ?
                            `
                            M ${width},${0}
                            Q ${width},${borderRadius} ${width-borderRadius},${borderRadius} 
                            `
                        :
                            `
                            M ${width+borderSize},${borderRadius}
                            `
                        )
                        +
                        `
                        L ${borderRadius+borderSize/2},${borderRadius} 
                        Q ${0+borderSize/2},${borderRadius} ${0+borderSize/2},${borderRadius*2} 
                        L ${0+borderSize/2},${height-borderRadius*2}
                        Q ${0+borderSize/2},${height-borderRadius} ${borderRadius+borderSize/2},${height-borderRadius}
                        `
                        +
                        (bottomCorner ?
                            `
                            L ${width-borderRadius},${height-borderRadius}
                            Q ${width},${height-borderRadius} ${width},${height}       
                            `
                        :
                            `
                            L ${width+borderSize},${height-borderRadius}
                            `
                        )
                        }
                        style={{fill: backgroundColor}} 
                        stroke={borderColor}
                        strokeWidth={borderSize}
                        ></path>
                    </svg>
                    <p className={"divider-text"} style={{fontSize: textSize, color: textColor}}>{text}</p>
                </div>
            }
        </>
    )
}

export default Divider;