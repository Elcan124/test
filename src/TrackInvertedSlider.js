import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiSlider from '@mui/material/Slider';
import {useEffect} from "react";

const Slider = styled(MuiSlider)({
    '& .MuiSlider-markLabel': {
        transform: "rotate(325deg)",marginLeft:"-15px",fontSize:"12px"
    }
});

const marks = [
    { value: 0,label: ''},
    { value: 5.8,label: ''},
    { value: 15,label: ''},
    { value: 36.2,label: ''},
    { value: 1556,label: ''},
    { value: 2556,label: ''}

];

function valuetext(value) {
    return `${value}°C`;
}


export default function TrackInvertedSlider(props) {
    const [value, setValue] = React.useState();

    useEffect(() => {
        props.sendToParent(value);
    }, [value]);
    const handleChange = (event, newValue) => {
        setValue(newValue);


    };
    return (
        <Box sx={{ width: 600 }}>

            {/*<Slider
                track="inverted"
                aria-labelledby="track-inverted-range-slider"
                getAriaValueText={valuetext}
                defaultValue={props.olcu}
                marks={marks}
                aria-orientation={"horizontal"}
                //style={{transform: "rotate(90deg)"}}
            />*/}
            <Slider
                aria-label="Temperature"
                defaultValue={1556}
                getAriaValueText={null}
                valueLabelDisplay="auto"
                step={null}
                marks={marks}
                min={0}
                max={5000}
                value={props.selected}
                onChange={handleChange}
            />
        </Box>
    );
}
