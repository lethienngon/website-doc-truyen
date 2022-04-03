import { Outlet } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

// Role
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';

// Menu
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import GTranslateOutlinedIcon from '@mui/icons-material/GTranslateOutlined';

import "./translatorlayout.scss";

const TranslatorLayout = () => {
    return (
        <div className="translator">
            <Sidebar
                logo="Translator"
                roleList={[
                    {
                        id: 1,
                        icon: <AdminPanelSettingsOutlinedIcon className="icon" />,
                        name: "Admin",
                        link: "/admin"
                    },
                    {
                        id: 2,
                        icon: <ManageAccountsOutlinedIcon className="icon" />,
                        name: "Manager",
                        link: "/manager"
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
                        icon: <GridViewOutlinedIcon className="icon" />,
                        name: "Chapter",
                        link: "chapter"
                    },
                    {
                        id: 2,
                        icon: <GridOnOutlinedIcon className="icon" />,
                        name: "Content",
                        link: "content"
                    },
                    {
                        id: 3,
                        icon: <GTranslateOutlinedIcon className="icon" />,
                        name: "Translation",
                        link: "translation"
                    }
                ]}
            />
            <div className="translatorContainer">
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default TranslatorLayout;