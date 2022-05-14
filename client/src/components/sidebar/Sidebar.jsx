import "./sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CircularProgress from '@mui/material/CircularProgress';

import { logOutUser } from"../../redux/apiRequest";

const Sidebar = (props) => {

    const user = useSelector(state => state.auth.login.currentUser);
    const isFetching = useSelector(state => state.auth.login.isFetching);
    const accessToken = user?.accessToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();

    const handleLogOut = () => {
        logOutUser(dispatch, navigate, accessToken, alert);
    }
    return (
        <div className='sidebar'>
            <div className="top">
                <span className="logo">{props.logo}</span>
            </div>
            <div className="center">
                <ul>
                    {/* <p className="title">Main</p>
                    <li>
                        <Link to="">
                            <DashboardOutlinedIcon className="icon" />
                            <span>Dashboard</span>
                        </Link>
                    </li> */}
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
                    <li onClick={handleLogOut} className={isFetching ? "disabled" : ""}>
                        <LogoutOutlinedIcon className="icon" />
                        <span>Logout</span>
                        { isFetching && <CircularProgress size="1rem" className='waitSubmitSmallCircel'/>}
                    </li>
                </ul>
            </div>
            {/* <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div> */}
        </div>
    );
};

export default Sidebar;