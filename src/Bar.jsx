const Bar = ({ value, maxValue, height, width, backgroundColor}) => {
    // Calculate the width of the bar based on the value and maxValue
    const barWidth = `${(value / maxValue) * 100}%`;

    // Set default styles
    const containerStyle = {
        height: height,
        width: width,
        backgroundColor: backgroundColor,
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
    };

    const barStyle = {
        width: barWidth,
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.3s ease',

        background: "linear-gradient(to right, red 0%, orange 25%, yellow 45%, lightgreen 65%, green 85%)",
        backgroundSize: width + " 100%"
    }
    const labelStyle = {
        marginLeft: '8px',
        fontSize: '14px',
    };

    return (
        <div style={containerStyle}>
            <div style={barStyle}></div>
            <span style={labelStyle}>{value}</span>
        </div>
    );
};

export default Bar;