import React from 'react';
import './UnitComponent.css';
import PropTypes from 'prop-types'

const UnitComponent = ({ unit, onUnitChange }) => {

    const changeUnit = (e) => {
        const newUnit = e.target.textContent;
        onUnitChange(newUnit);
    }

    return (
        <div className="unit-container">
            <span className={`unit-value ${unit === 'C' ? 'active-unit' : ''}`} onClick={changeUnit}>C</span>
            <span className={`unit-value ${unit === 'F' ? 'active-unit' : ''}`} onClick={changeUnit}>F</span>
        </div>
    );
}


UnitComponent.propTypes = {
    unit: PropTypes.string,
    onUnitChange: PropTypes.func
}

export default UnitComponent;