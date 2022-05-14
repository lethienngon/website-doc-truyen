import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from 'react-alert';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from '@mui/material/CircularProgress';

import { useSelector } from 'react-redux';
import { addCategory, getAllCategorys, getCategoryByID, editCategory, deleteCategory } from '../../../redux/apiRequest';

import "./category.scss";

const Category = () => {

    const [searchInput, setSearchInput] = useState('');
    const [seletedID, setSeletedID] = useState(-1);
    const [listRow, setListRow] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [waitSubmit, setWaitSubmit] = useState(false);


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const alert = useAlert();

    const user = useSelector(state => state.auth.login.currentUser);

    useEffect(async () => {
        const temp = await getAllCategorys(searchInput, user.accessToken, alert);
        setListRow(temp);
    }, [searchInput, showAdd, showEdit, showDelete]);

    // Columns DataGrid
    const columns = [
        { field: "category_id", headerName: "ID", width: 100 },
        { field: "category_name", headerName: "Name", width: 350 },
        { field: "category_description", headerName: "Description", width: 600 },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="action">
                        <div
                            className="viewButton"
                            onClick={async (e) => {
                                let temp = await getCategoryByID(params.row.category_id, user.accessToken, alert)
                                setSeletedID(params.row.category_id);
                                setName(temp.category_name);
                                setDescription(temp.category_description);
                                setShowEdit(true);
                            }}
                        >
                            Edit
                        </div>
                        <div
                            className="deleteButton"
                            onClick={(e) => {
                                setShowDelete(true);
                                setSeletedID(params.row.category_id);
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
            <Dialog open={showAdd} onClose={(e)=> setShowAdd(false)}>
                <DialogTitle>ADD CATEGORY</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        onChange={(e)=> setName(e.target.value)}
                    />
                    <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder="Description"
                        style={{ marginTop: 10, padding: 10, maxWidth: 550, width: 550 }}
                        minRows={10}
                        onChange={(e)=> setDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    { waitSubmit && <CircularProgress className='waitSubmit'/>}
                    <Button onClick={(e)=> setShowAdd(false)}>Cancel</Button>
                    <Button onClick={async (e)=> {              
                        try {
                            setWaitSubmit(true);
                            await addCategory(name, description, user.accessToken, alert);
                        }catch{
                            alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
                        }
                        finally{
                            setWaitSubmit(false);
                            setShowAdd(false)
                        }
                    }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showEdit} onClose={(e)=> setShowEdit(false)}>
                <DialogTitle>EDIT CATEGORY</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        defaultValue={name}
                        label="Name"
                        fullWidth
                        variant="standard"
                        onChange={(e)=> setName(e.target.value)}
                    />
                    <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder="Description"
                        defaultValue={description}
                        style={{ marginTop: 10, padding: 10, maxWidth: 550, width: 550 }}
                        minRows={10}
                        onChange={(e)=> setDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e)=> setShowEdit(false)}>Cancel</Button>
                    <Button onClick={async (e)=> {
                        try {
                            setWaitSubmit(true);
                            await editCategory(name, description, seletedID, user.accessToken, alert); 
                        } catch{
                            alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
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
            <Dialog open={showDelete} onClose={(e) => setShowDelete(false)}>
                <DialogTitle>{"DELETE CATEGORY"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You confirm category deletion with id {seletedID}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={async (e) => {
                            try {
                                setWaitSubmit(true);
                                await deleteCategory(seletedID, user.accessToken, alert); 
                            } catch{
                                alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
                            }
                            finally{
                                setWaitSubmit(false);
                                setShowDelete(false)
                            }
                        }}
                    >
                        YES
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={(e) => setShowDelete(false)}
                    >
                        NO
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="categoryContainer">
                <div className="categoryHeader">
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchInput}
                            disabled={(showAdd && "disable")}
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
                        }}
                    >
                        Add Category
                    </div>
                </div>
                <div className="categoryList">
                    <DataGrid
                        rows={listRow}
                        columns={columns}
                        getRowId={(listRow) => listRow.category_id}
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

export default Category;