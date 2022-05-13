import { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
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

import { useSelector } from 'react-redux';
import { getAllStorys } from '../../../redux/apiRequest';

import StoryAdd from "./StoryAdd";
import "./story.scss";

const Story = () => {

    const [searchInput, setSearchInput] = useState('');
    const [seletedID, setSeletedID] = useState(-1);
    const [listRow, setListRow] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const alert = useAlert();

    const user = useSelector(state => state.auth.login.currentUser);

    useEffect(async () => {
        const temp = await getAllStorys(searchInput, user.accessToken, alert);
        setListRow(temp);
    }, [searchInput, showAdd, showEdit, showDelete]);

    // Columns DataGrid
    const columns = [
        { field: "truyen_id", headerName: "ID", width: 100 },
        { 
            field: "truyen_type", 
            headerName: "Type", 
            width: 70,
            renderCell: (params) => {
                let type = '';
                if(params.row.truyen_type=='10'){
                    type = 'Truyện Tranh'
                }
                else if(params.row.truyen_type=='20'){
                    type = 'Truyện Chữ'
                }
                else type = '???';
                return (
                    <p>{type}</p>
                )
            }
        },
        { field: "truyen_name", headerName: "Name", width: 200 },
        {
            field: "truyen_image",
            headerName: "Avatar",
            width: 100,
            renderCell: (params) => {
                return (
                    <Avatar
                        className="avatar"
                        alt="Avatar of Story"
                        src={
                            params.row.truyen_image &&
                            "http://localhost:3001/" + params.row.truyen_image
                        }
                    />
                );
            },
        },
        { field: "category_name", headerName: "Categorys",  width: 150 },
        { field: "author_name", headerName: "Authors",  width: 120 },
        { 
            field: "truyen_status", 
            headerName: "Status", 
            width: 80,
            renderCell: (params) => {
                let type = '';
                let color = '';
                if(params.row.truyen_status=='01'){
                    type = 'Active';
                    color = 'green';
                }
                else if(params.row.truyen_status=='00'){
                    type = 'Clock';
                    color = 'crimson'
                }
                else type = '???';
                return (
                    <span style={{  padding: '10px',
                                    backgroundColor: color, 
                                    borderRadius: '30px'}}>
                        <p style={{ color: 'white'}}>{type}</p>
                    </span>
                )
            },
        },
        { field: "truyen_view", headerName: "View", width: 100 },
        { field: "user_name", headerName: "User create",  width: 120 },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="action">
                        <div
                            className="viewButton"
                            // onClick={async (e) => {
                            //     let temp = await getStoryByID(params.row.Story_id, user.accessToken, alert)
                            //     setSeletedID(params.row.Story_id);
                            //     setName(temp.Story_name);
                            //     setDescription(temp.Story_description);
                            //     setShowEdit(true);
                            // }}
                        >
                            Edit
                        </div>
                        <div
                            className="deleteButton"
                            // onClick={(e) => {
                            //     setShowDelete(true);
                            //     setSeletedID(params.row.Story_id);
                            // }}
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
            {/* <Dialog open={showDelete} onClose={(e) => setShowDelete(false)}>
                <DialogTitle>{"DELETE Story"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You confirm Story deletion with id {seletedID}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={async (e) => {
                            await deleteStory(seletedID, user.accessToken, alert); 
                            setShowDelete(false);
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
            </Dialog> */}
            <div className="storyContainer">
                <div className="storyHeader">
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
                        Add Story
                    </div>
                </div>
                <StoryAdd />
                <div className="storyList">
                    <DataGrid
                        rows={listRow}
                        columns={columns}
                        getRowId={(listRow) => listRow.truyen_id}
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

export default Story;