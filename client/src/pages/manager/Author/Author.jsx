import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Avatar, Button } from "@mui/material";
import Axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AuthorAdd from "./AuthorAdd";
import AuthorEdit from "./AuthorEdit";

import "./author.scss";

const Author = () => {
    const [searchInput, setSearchInput] = useState("");
    const [listRow, setListRow] = useState([]);
    const [seletedID, setSeletedID] = useState(-1);
    const [showAlert, setShowAlert] = useState(false);
    const [resState, setResState] = useState("");
    const [resMessage, setResMessage] = useState("");

    // Add author
    const [showAdd, setShowAdd] = useState(false);

    // // Delete author
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    // // Edit author
    const [showEdit, setShowEdit] = useState(false);

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
        { field: "author_description", headerName: "Description", width: 550 },
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
        await Axios.delete(
            `http://localhost:3001/api/v1/manager/authors/delete/${authorID}`
        )
            .then((res) => {
                console.log(res);
                setResState(res.data.state);
                setResMessage(res.data.message);
            })
            .catch((err) => {
                setResState("error");
                setResMessage("Error delete author");
            });
        setOpenDialogDelete(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
    };

    const getAllAuthor = async () => {
        try {
            const response = await Axios.get(
                `http://localhost:3001/api/v1/manager/authors?name=${searchInput}`
            );
            setListRow(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getAllAuthor();
    }, [searchInput, resState, showAlert]);

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
                <Stack sx={{ width: "100%" }} spacing={2}>
                    {showAlert && (
                        <Alert severity={resState}>{resMessage}</Alert>
                    )}
                </Stack>
                {
                  showAdd &&
                  <AuthorAdd
                    setShowAdd={setShowAdd}
                    setShowAlert={setShowAlert}
                    setResState={setResState}
                    setResMessage={setResMessage}
                    listRow={listRow}
                  />
                }
                {
                  showEdit && 
                  <AuthorEdit 
                    setShowEdit={setShowEdit}
                    setShowAlert={setShowAlert}
                    setResState={setResState}
                    setResMessage={setResMessage}
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