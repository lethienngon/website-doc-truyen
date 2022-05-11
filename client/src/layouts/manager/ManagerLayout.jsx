import { Outlet } from "react-router-dom";
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

// Role
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';

// Menu
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

import { useSelector } from 'react-redux';

import "./managerlayout.scss";

const ManagerLayout = () => {

    const user = useSelector(state => state.auth.login.currentUser);
    const role = useSelector(state => state.auth.login.role);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user || !user?.accessToken || (role != 'Manager' && role != 'Admin')){
            if(role == 'Translator') navigate('/translator');
            else navigate('/');
        }
    }, []);

    return (
        <div className="manager">
            <Sidebar
                logo="Manager"
                roleList={[
                    {
                        id: 3,
                        icon: <AccountBoxOutlinedIcon className="icon" />,
                        name: "Translator",
                        link: "/translator"
                    },
                    {
                        id: 4,
                        icon: <SupervisedUserCircleOutlinedIcon className="icon" />,
                        name: "Member",
                        link: "/member"
                    }
                ]}

                menuList={[
                    {
                        id: 1,
                        icon: <BrushOutlinedIcon className="icon" />,
                        name: "Author",
                        link: "author"
                    },
                    {
                        id: 2,
                        icon: <CategoryOutlinedIcon className="icon" />,
                        name: "Category",
                        link: "category"
                    },
                    {
                        id: 3,
                        icon: <MenuBookOutlinedIcon className="icon" />,
                        name: "Story",
                        link: "story"
                    }
                ]}
            />
            <div className="managerContainer">
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default ManagerLayout;