import './RadiusSlider.css';

import React from 'react';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import { Button } from 'reactstrap';

import { updateMap } from '../../../containers/GoogleMap/MapContainer';
import 'rc-slider/assets/index.css';

// https://github.com/react-component/slider

const Handle = Slider.Handle;
let Radius = Slider.value;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    Radius = value;

    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}>
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

const sliderStyles = {
    height: 24, width: 24, backgroundColor: '#28a745',
    marginLeft: -12, marginTop: -10, borderColor: 'white',
};

export const getRadius = () => {
    updateMap();
    return ( Radius );
}

const radiusSlider = (props) => {

    return (
        <div id="radius" title="Select radius from your location in kilometers (0: show all)">
            <Slider id="radiusSliderInput" min={0} max={500} step={10}
                defaultValue={0} 
                handle={handle} 
                handleStyle={sliderStyles} 
                onAfterChange={getRadius} 
                />
            <Button id="radiusSliderToggle" outline size="sm"
                title="Toggle search by radius ON/OFF (Not availible when device's location turned off)">On/Off</Button>
        </div>
    );

}

export default radiusSlider;

