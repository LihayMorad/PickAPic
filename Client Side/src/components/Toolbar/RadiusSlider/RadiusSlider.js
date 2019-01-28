import './RadiusSlider.css';

import React from 'react';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import { Button } from 'reactstrap';

import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';

import 'rc-slider/assets/index.css';
// https://github.com/react-component/slider v8.6.1

const sliderStyles = {
    height: 24, width: 24, backgroundColor: '#28a745',
    marginLeft: -12, marginTop: -10, borderColor: 'white',
};

const Handle = Slider.Handle;
let Radius = Slider.value;

const handle = props => {
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

const radiusSlider = props => {
    return (
        <div id="radius" title="Select radius from your location in kilometers (0: show all)">
            <Slider id="radiusSliderInput"
                min={0} max={500} step={10}
                defaultValue={0}
                handle={handle}
                handleStyle={sliderStyles}
                onAfterChange={() => { props.onRadiusChange(Radius); }}
            />
            <Button id="radiusSliderToggle" outline size="sm"
                title="Toggle search by radius ON/OFF (Not available when device's location turned off)">On/Off</Button>
        </div>
    );
}

// gets state from store
const mapStateToProps = state => { // console.log("​mapStateToProps");
    return state;
}

// onRadiusChange returns to props
// dispatch triggers reducer 
const mapDispatchToProps = dispatch => { // console.log("mapDispatchToProps");
    return {
        onRadiusChange: (radius) => dispatch({ type: actionTypes.CHANGE_RADIUS, rad: radius })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(radiusSlider);

