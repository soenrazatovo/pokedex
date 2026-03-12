import { useState } from "react"
import "./Divider.css"

function Divider({width, height, borderRadius, text = "", textSize, textColor = "black", backgroundColor, borderColor = "black", borderSize = "0px", topCorner = true, bottomCorner = true, zIndex = 0, onClick}) {
    width = width.toString().replace("px","")
    height = height.toString().replace("px","")
    
    if (borderRadius){
        borderRadius = borderRadius.toString().replace("px","")
        if (!(width >= borderRadius*2 && height >= borderRadius*4 && borderRadius != undefined && borderRadius != "")) {
            borderRadius = Math.min(width/2,height/4)
        }
    } else {
        borderRadius = Math.min(width/2,height/4)
    }

    return(
        <>
            { (width >= borderRadius*2 && height >= borderRadius*4 && borderRadius != undefined && borderRadius != "") &&
                <div onClick={onClick} className={"divider-wrapper"} style={{width : width + "px", height : height-borderRadius*2 + "px", zIndex : zIndex}}>
                    <svg className={"divider-svg"} style={{width : width + "px", height : height + "px"}}>
                        <path d={
                        (topCorner ?
                            `
                            M ${width},${0}
                            Q ${width},${borderRadius} ${width-borderRadius},${borderRadius} 
                            `
                        :
                            `
                            M ${width},${borderRadius}
                            `
                        )
                        +
                        `
                        L ${borderRadius},${borderRadius} 
                        Q ${0},${borderRadius} ${0},${borderRadius*2} 
                        L ${0},${height-borderRadius*2}
                        Q ${0},${height-borderRadius} ${borderRadius},${height-borderRadius}
                        `
                        +
                        (bottomCorner ?
                            `
                            L ${width-borderRadius},${height-borderRadius}
                            Q ${width},${height-borderRadius} ${width},${height}       
                            `
                        :
                            `
                            L ${width},${height-borderRadius}
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