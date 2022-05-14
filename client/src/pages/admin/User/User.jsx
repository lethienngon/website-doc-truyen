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
import CircularProgress from '@mui/material/CircularProgress';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, setStatusOrRole } from '../../../redux/apiRequest';
import { openDialogDelete, closeDialogDelete } from '../../../redux/userSlice';


import "./user.scss";

const User = () => {

    const [searchInput, setSearchInput] = useState("");
    const [seletedID, setSeletedID] = useState(-1);
    const [showEdit, setShowEdit] = useState('');
    const [status, setStatus] = useState('');
    const [role, setRole] = useState('');
    const [roleBegin, setRoleBegin]= useState('');
    const [waitSubmit, setWaitSubmit] = useState(false);

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
    }, [searchInput, stateDialogDelete, showEdit]);


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
        { field: "user_email", headerName: "Email", width: 310 },
        { 
            field: "user_status", 
            headerName: "Status", 
            width: 100,
            renderCell: (params) => {
                let type = '';
                let color = '';
                if(params.row.user_status=='10'){
                    type = 'Active';
                    color = 'green';
                }
                else if(params.row.user_status=='20'){
                    type = 'Lock';
                    color = 'crimson'
                }
                else type = '???';
                return (
                    <span style={{  padding: '6px',
                                    width: '80px',
                                    height: '30px',
                                    textAlign: 'center',
                                    backgroundColor: color, 
                                    borderRadius: '30px'}}>
                        <p style={{ color: 'white'}}>{type}</p>
                    </span>
                )
            },
        },
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
                                setStatus(params.row.user_status);
                                setRole(params.row.role_id);
                                setRoleBegin(params.row.role_id);
                                setShowEdit(true);
                            }}
                        >
                            Change
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
            <Dialog open={showEdit} onClose={(e)=> setShowEdit(false)}>
                <DialogTitle>CHANGE ROLE or STATUS</DialogTitle>
                <DialogContent>
                    <Box sx={{ minWidth: 200, margin: 5 }}>
                        <FormControl fullWidth>
                            <InputLabel id="statusUser">Status User</InputLabel>
                            <Select
                                labelId="statusUser"
                                id="status"
                                name="status"
                                value={status}
                                label="Status User"
                                onChange={(e)=>setStatus(e.target.value)}
                            >
                                <MenuItem value={10}>Active</MenuItem>
                                <MenuItem value={20}>Lock</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 200, margin: 5 }}>
                        <FormControl fullWidth>
                            <InputLabel id="roleUser">Role User</InputLabel>
                            <Select
                                labelId="roleUser"
                                id="role"
                                name="role"
                                value={role}
                                label="Role User"
                                onChange={(e)=>setRole(e.target.value)}
                            >
                                {/* <MenuItem value='00'>Admin</MenuItem> */}
                                <MenuItem value='01'>Manager</MenuItem>
                                <MenuItem value='02'>Translator</MenuItem>
                                <MenuItem value='03'>Member</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    { waitSubmit && <CircularProgress className='waitSubmit'/>}
                    <Button onClick={(e)=> setShowEdit(false)}>Cancel</Button>
                    <Button variant="contained" onClick={async (e)=> {
                        try {
                            setWaitSubmit(true);
                            await setStatusOrRole(roleBegin, status, role, seletedID, user.accessToken, alert); 
                        } catch{
                            if(roleBegin=='00'){
                                alert.error(<p style={{ color: 'crimson'}}>Don't change with role Admin</p>);
                            }
                            else {
                                alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
                            }
                        }
                        finally{
                            setWaitSubmit(false);
                            setShowEdit(false)
                        }
                    }}
                    >
                        Save
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