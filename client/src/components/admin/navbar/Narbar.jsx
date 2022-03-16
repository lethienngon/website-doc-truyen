import React from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Narbar = () => {
    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search..."/>
                    <SearchOutlinedIcon />
                </div>
            </div>
        </div>
    );
};

export default Narbar;