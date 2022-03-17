import React from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import {Avatar, Badge} from '@mui/material';
import "./navbar.scss";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search..."/>
                    <SearchOutlinedIcon />
                </div>
                <div className="items">
                    <div className="item">
                        <DarkModeOutlinedIcon className="icon"/>
                    </div>
                    <div className="item">
                        <LanguageOutlinedIcon className="icon" />
                        Language
                    </div>
                    <div className="item">
                        <Badge color="info" badgeContent={10} max={9} className="badge">
                            <NotificationsNoneOutlinedIcon className="icon" />
                        </Badge>
                    </div>
                    <div className="item">
                        <Badge color="info" badgeContent={10} max={9} className="badge">
                            <ChatBubbleOutlineOutlinedIcon className="icon" />
                        </Badge>
                    </div>
                    <div className="item">
                        <Avatar alt="Avatar" src="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;