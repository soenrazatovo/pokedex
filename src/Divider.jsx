function Divider({width, height, borderRadius}) {
    width = width.toString().replace("px","")
    height = height.toString().replace("px","")
    
    if (borderRadius){
        borderRadius = borderRadius.toString().replace("px","")
        if (!(width >= borderRadius*2 && height >= borderRadius*4 && borderRadius != undefined && borderRadius != "")) {
            borderRadius = Math.min(width/2,height/4)
        }
    } else {
        borderRadius = Math.min(width,height)/4
    }

    return(
        <>
            { (width >= borderRadius*2 && height >= borderRadius*4 && borderRadius != undefined && borderRadius != "") &&
                <svg width={width + "px"} height={height + "px"} >
                    <path d={
                    `
                    M ${width},${0}
                    Q ${width},${borderRadius} ${width-borderRadius},${borderRadius} 
                    L ${borderRadius},${borderRadius} 
                    Q ${0},${borderRadius} ${0},${borderRadius*2} 
                    L ${0},${height-borderRadius*2}
                    Q ${0},${height-borderRadius} ${borderRadius},${height-borderRadius}
                    L ${width-borderRadius},${height-borderRadius}
                    Q ${width},${height-borderRadius} ${width},${height}       
                    `
                    }
                    style={{fill: "#e26767"}} 
                    stroke={"#DD0000"}
                    strokeWidth={1}
                    ></path>
                </svg>
            }
        </>
    )
}

export default Divider;