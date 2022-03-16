import Sidebar from "../../components/admin/sidebar/Sidebar";
import Navbar from "../../components/admin/navbar/Narbar";
import "./adminlayout.scss";

const AdminLayout = () => {
    return (
        <div className="admin">
            <Sidebar />
            <div className="adminContainer">
                <Navbar />
                container
            </div>
        </div>
    )
}

export default AdminLayout;