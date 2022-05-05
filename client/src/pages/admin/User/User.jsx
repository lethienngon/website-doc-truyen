import { useState, useEffect} from 'react';
import { DataGrid } from "@mui/x-data-grid";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Avatar } from "@mui/material";
import Axios from "axios";

import "./user.scss";
const User = () => {

    const [searchInput, setSearchInput] = useState("");
    const [listRow, setListRow] = useState([]);

    // Columns DataGrid
    const columns = [
        { field: "user_id", headerName: "ID", width: 100 },
        { field: "user_name", headerName: "Name", width: 330 },
        {
            field: "user_image",
            headerName: "Avatar",
            width: 100,
            renderCell: (params) => {
                return (
                    <Avatar
                        className="avatar"
                        alt="Avatar of User"
                        src={
                            params.row.user_image &&
                            "http://localhost:3001/" + params.row.user_image
                        }
                    />
                );
            },
        },
        { field: "user_email", headerName: "Email", width: 330 },
        { field: "user_status", headerName: "Status", width: 100 },
        { field: "role_name", headerName: "Role", width: 100 },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="action">
                        <div
                            className="viewButton"
                            onClick={(e) => {
                                // setShowEdit(true);
                                // setShowAdd(false);
                                // setSeletedID(params.row.author_id);
                            }}
                        >
                            View
                        </div>
                        <div
                            className="deleteButton"
                            onClick={(e) => {
                                // setOpenDialogDelete(true);
                                // setSeletedID(params.row.author_id);
                            }}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];

    const getAllAuthor = async () => {
        try {
            const response = await Axios.get(
                `http://localhost:3001/api/v1/admin/users?name=${searchInput}`
            );
            setListRow(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getAllAuthor();
        console.log(listRow);
    }, [searchInput]);

    return (
        <div className="userContainer">
            <div className='userHeader'>
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <SearchOutlinedIcon />
                </div>
            </div>
            <div className="userList">
                <DataGrid
                    rows={listRow}
                    columns={columns}
                    getRowId={(listRow) => listRow.user_id}
                    rowHeight={90}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    cell--textCenter
                />
            </div>
        </div>
    );
};

export default User;