import { useState, useEffect } from "react";
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

import { getAllAuthors, deleteAuthor } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';

import AuthorAdd from "./AuthorAdd";
import AuthorEdit from "./AuthorEdit";

import "./author.scss";

const Author = () => {

    const user = useSelector(state => state.auth.login.currentUser);
    const alert = useAlert();

    const [waitSubmit, setWaitSubmit] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [listRow, setListRow] = useState([]);
    const [seletedID, setSeletedID] = useState(-1);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    // Columns DataGrid
    const columns = [
        { field: "author_id", headerName: "ID", width: 100 },
        { field: "author_name", headerName: "Name", width: 300 },
        {
            field: "author_image",
            headerName: "Avatar",
            width: 100,
            renderCell: (params) => {
                return (
                    <Avatar
                        className="avatar"
                        alt="Avatar of Author"
                        src={
                            params.row.author_image &&
                            "http://localhost:3001/" + params.row.author_image
                        }
                    />
                );
            },
        },
        { field: "author_description", headerName: "Description", width: 530 },
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
                                setShowEdit(false);
                                setShowEdit(true);
                                setShowAdd(false);
                                setSeletedID(params.row.author_id);
                            }}
                        >
                            View
                        </div>
                        <div
                            className="deleteButton"
                            onClick={(e) => {
                                setOpenDialogDelete(true);
                                setSeletedID(params.row.author_id);
                            }}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];

    const handleDelete = async (authorID) => {
        try {
            setWaitSubmit(true);
            await deleteAuthor(seletedID, user.accessToken, alert);
        } catch(err){
            alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        } finally{
            setOpenDialogDelete(false);
            setWaitSubmit(false);
        }
    };

    useEffect( async () => {
        try {
            const response = await getAllAuthors(searchInput, user.accessToken, alert);
            setListRow(response);
        } catch(err){
            alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        }
    }, [searchInput, openDialogDelete, showAdd, showEdit]);

    return (
        <>
            <Dialog
                open={openDialogDelete}
                keepMounted
                onClose={(e) => setOpenDialogDelete(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"DELETE AUTHOR"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You confirm author deletion with id {seletedID}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <span style={{maginLeft: '10px'}}>{ waitSubmit && <CircularProgress className='waitSubmit'/>}</span>
                    <Button
                        variant="contained"
                        onClick={(e) => handleDelete(seletedID)}
                    >
                        YES
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={(e) => setOpenDialogDelete(false)}
                    >
                        NO
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="authorContainer">
                <div className="authorHeader">
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchInput}
                            disabled={(showEdit && "disable") || (showAdd && "disable")}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <SearchOutlinedIcon />
                    </div>
                    <div
                        className="addButton"
                        style={{
                            color: showAdd ? "white" : "darkgreen",
                            backgroundColor: showAdd ? "darkgreen" : "white",
                        }}
                        onClick={(e) => {
                            setSearchInput("");
                            setShowAdd(!showAdd);
                            setShowEdit(false);
                        }}
                    >
                        Add Author
                    </div>
                </div>
                {
                  showAdd &&
                  <AuthorAdd
                    setShowAdd={setShowAdd}
                    listRow={listRow}
                  />
                }
                {
                  showEdit && 
                  <AuthorEdit 
                    setShowEdit={setShowEdit}
                    listRow={listRow}
                    seletedID={seletedID}
                  />
                }
                <div className="authorList">
                    <DataGrid
                        rows={listRow}
                        columns={columns}
                        getRowId={(listRow) => listRow.author_id}
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

export default Author;