import { useState, useEffect} from 'react';
import { DataGrid } from "@mui/x-data-grid";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Avatar, Button } from "@mui/material";
import { useAlert } from 'react-alert';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../../redux/apiRequest';
import { openDialogDelete, closeDialogDelete } from '../../../redux/userSlice';


import "./user.scss";

const User = () => {

    const [searchInput, setSearchInput] = useState("");
    const [seletedID, setSeletedID] = useState(-1);

    // react-alert
    const alert = useAlert();

    // get accessToken
    const user = useSelector(state => state.auth.login.currentUser);
    // get list Users
    const listRow = useSelector(state => state.users.users.allUsers);
    const stateDialogDelete = useSelector(state => state.users.openDialog.delete);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!user || !user.accessToken){
            navigate('/signpage');
        }
        else {
            getAllUsers(user.accessToken, dispatch, searchInput);
        }
    }, [searchInput, stateDialogDelete]);


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
                                setSeletedID(params.row.user_id);
                            }}
                        >
                            View
                        </div>
                        <div
                            className="deleteButton"
                            onClick={(e) => {
                                dispatch(openDialogDelete());
                                setSeletedID(params.row.user_id);
                            }}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];

    return (
        <>
        <Dialog
                open={stateDialogDelete}
                keepMounted
                onClose={(e) => dispatch(closeDialogDelete())}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"DELETE USER"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You confirm user deletion with id {seletedID}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => deleteUser(user.accessToken, dispatch, alert, seletedID)}
                    >
                        YES
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={(e) => dispatch(closeDialogDelete())}
                    >
                        NO
                    </Button>
                </DialogActions>
            </Dialog>
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
        </>
    );
};

export default User;