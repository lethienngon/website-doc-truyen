import "./sidebar.scss";

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import GTranslateOutlinedIcon from '@mui/icons-material/GTranslateOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="top">
                <span className="logo">Admin</span>
            </div>
            <hr/>
            <div className="center">
                <ul>
                    <p className="title">Main</p>
                    <li>
                        <DashboardOutlinedIcon className="icon" />
                        <span>Dashboard</span>
                    </li>
                    <p className="title">List</p>
                    <li>
                        <PersonOutlineOutlinedIcon className="icon" />
                        <span>Users</span>
                    </li>
                    <li>
                        <BrushOutlinedIcon className="icon" />
                        <span>Author</span>
                    </li>
                    <li>
                        <CategoryOutlinedIcon className="icon" />
                        <span>Category</span>
                    </li>
                    <li>
                        <MenuBookOutlinedIcon className="icon" />
                        <span>Storys</span>
                    </li>
                    <li>
                        <GridViewOutlinedIcon className="icon" />
                        <span>Chapters</span>
                    </li>
                    <li>
                        <GridOnOutlinedIcon className="icon" />
                        <span>Contents</span>
                    </li>
                    <li>
                        <GTranslateOutlinedIcon className="icon" />
                        <span>Tranlation</span>
                    </li>
                    <li>
                        <CommentOutlinedIcon className="icon" />
                        <span>Comments</span>
                    </li>
                    <p className="title">User</p>
                    <li>
                        <AccountCircleOutlinedIcon className="icon" />
                        <span>Profile</span>
                    </li>
                    <li>
                        <LogoutOutlinedIcon className="icon" />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div>
        </div>
    );
};

export default Sidebar;