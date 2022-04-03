import "./sidebar.scss";
import { Link } from 'react-router-dom';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Sidebar = (props) => {
    return (
        <div className='sidebar'>
            <div className="top">
                <span className="logo">{props.logo}</span>
            </div>
            <div className="center">
                <ul>
                    <p className="title">Main</p>
                    <li>
                        <Link to="">
                            <DashboardOutlinedIcon className="icon" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <p className="title">Role</p>
                    {props.roleList.map(role => (
                        <li key={role.id}>
                            <Link to={role.link}>
                                {role.icon}
                                <span>{role.name}</span>
                            </Link>
                        </li>
                    ))}
                    <p className="title">Menu</p>
                    {props.menuList.map(menu => (
                        <li key={menu.id}>
                            <Link to={menu.link}>
                                {menu.icon}
                                <span>{menu.name}</span>
                            </Link>
                        </li>
                    ))}
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