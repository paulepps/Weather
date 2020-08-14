import React from 'react';
import './Navbar.css';
import SearchBox from '../SearchBox/SearchBox';
import UnitComponent from '../UnitComponent/UnitComponent';

const Navbar = (props) => {

    const sendNewUnitToParent = (newUnit) => {
        props.changeUnit(newUnit);
    }

    const sendQueryStringToParent = (query) => {
        props.searchSubmit(query);
    }

    return (
        <nav>
            <ul className="navbar-container">
                <li className="navbar-list-item">
                    <SearchBox searchSubmit={sendQueryStringToParent} />
                </li>
                <li className="navbar-list-item city-name">
                    <span>{props.data.city}</span>
                </li>
                <li className="navbar-list-item">
                    <UnitComponent unit={props.unit} onUnitChange={sendNewUnitToParent} />
                </li>
            </ul>
        </nav>
    );
}


export default Navbar;