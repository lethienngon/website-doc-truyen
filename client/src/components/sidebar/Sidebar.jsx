import "./sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useState } from "react";
import { Button } from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from '@mui/material/CircularProgress';

import { logOutUser } from"../../redux/apiRequest";

const Sidebar = (props) => {

    const [showLogOut, setShowLogOut] = useState(false);

    const user = useSelector(state => state.auth.login.currentUser);
    const isFetching = useSelector(state => state.auth.login.isFetching);
    const accessToken = user?.accessToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();

    return (
        <div className='sidebar'>
            <Dialog open={showLogOut} onClose={(e) => setShowLogOut(false)}>
                <DialogTitle>{"LOGOUT"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You confirm Logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={async (e) => {
                            try {
                                await logOutUser(dispatch, navigate, accessToken, alert);
                            } catch{
                                alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
                            }
                            finally{
                                setShowLogOut(false)
                            }
                        }}
                    >
                        YES
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={(e) => setShowLogOut(false)}
                    >
                        NO
                    </Button>
                </DialogActions>
            </Dialog>
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
                    <li onClick={(e)=> setShowLogOut(true)} className={isFetching ? "disabled" : ""}>
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