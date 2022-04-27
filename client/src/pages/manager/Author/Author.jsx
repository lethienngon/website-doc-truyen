import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { TextField, Avatar, Button } from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HideImageIcon from "@mui/icons-material/HideImage";
import Axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./author.scss";

const AuthorAdd = ({
  setShowAdd,
  name,
  setName,
  alertName,
  description,
  setDescription,
  selectedImage,
  setSelectedImage,
  alertSelectedImage,
  setShowAlert,
  setResState,
  setResMessage,
  imageChange,
  disable,
}) => {
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", selectedImage);

    await Axios({
      method: "post",
      url: "http://localhost:3001/api/v1/manager/authors/add",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setResState(res.data.state);
        setResMessage(res.data.message);
      })
      .catch(()=> {
        setResState("error");
        setResMessage("Có lỗi xãy ra!!!");
      });

    setShowAdd(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  return (
    <div className="authorForm">
      <div className="addAvatar">
        <label>
          <AddPhotoAlternateIcon className="iconAdd" />
          <input
            style={{ display: "none" }}
            id="inputAvatar"
            accept="image/*"
            type="file"
            onChange={imageChange}
          />
        </label>
        <p>{alertSelectedImage}</p>
        {selectedImage && (
          <div>
            <Avatar
              className="avatar"
              alt="Avatar of Author"
              src={URL.createObjectURL(selectedImage)}
            />
            <HideImageIcon
              className="iconRemove"
              onClick={(e) => setSelectedImage("")}
            />
          </div>
        )}
      </div>
      <div className="addTextField">
        <TextField
          value={name}
          id="outlined-name-input"
          label="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <p>{alertName}</p>
        <TextareaAutosize
          value={description}
          minRows={6}
          maxRows={10}
          placeholder="Description..."
          style={{
            width: 500,
            maxWidth: 770,
            maxHeight: 500,
            padding: 10,
            fontSize: 14,
          }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="buttonForm">
          <Button variant="contained" onClick={handleSubmit} disabled={disable}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => {setName(""); setDescription(""); setSelectedImage("")}}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

const AuthorEdit = ({
  setShowEdit,
  name,
  setName,
  alertName,
  description,
  setDescription,
  selectedImage,
  setSelectedImage,
  alertSelectedImage,
  setShowAlert,
  setResState,
  setResMessage,
  imageChange,
  disable,
  seletedID
}) => {
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", selectedImage);

    await Axios({
      method: "post",
      url: `http://localhost:3001/api/v1/manager/authors/edit/${seletedID}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setResState(res.data.state);
        setResMessage(res.data.message);
      })
      .catch(()=> {
        setResState("error");
        setResMessage("Có lỗi xãy ra!!!");
      });

    setShowEdit(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  return (
    <div className="authorForm">
      <div className="addAvatar">
        <label>
          <AddPhotoAlternateIcon className="iconAdd" />
          <input
            style={{ display: "none" }}
            id="inputAvatar"
            accept="image/*"
            type="file"
            onChange={imageChange}
          />
        </label>
        <p>{alertSelectedImage}</p>
        {selectedImage && (
          <div>
            <Avatar
              className="avatar"
              alt="Avatar of Author"
              src={URL.createObjectURL(selectedImage)}
            />
            <HideImageIcon
              className="iconRemove"
              onClick={(e) => setSelectedImage("")}
            />
          </div>
        )}
      </div>
      <div className="addTextField">
        <TextField
          value={name}
          id="outlined-name-input"
          label="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <p>{alertName}</p>
        <TextareaAutosize
          value={description}
          minRows={6}
          maxRows={10}
          placeholder="Description..."
          style={{
            width: 500,
            maxWidth: 770,
            maxHeight: 500,
            padding: 10,
            fontSize: 14,
          }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="buttonForm">
          <Button variant="contained" onClick={handleSubmit} disabled={disable}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => {setName(""); setDescription(""); setSelectedImage("")}}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

const Author = () => {
  const [searchInput, setSearchInput] = useState("");
  const [listRow, setListRow] = useState([]);
  const [seletedID, setSeletedID] = useState(-1);
  const [showAlert, setShowAlert] = useState(false);
  const [resState, setResState] = useState("");
  const [resMessage, setResMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [alertName, setAlertName] = useState("");
  const [alertSelectedImage, setAlertSelectedImage] = useState("");
  // we set it to true so that the form is disabled on first render
  const [disable, setDisabled] = useState(true);

  // we use the help of useRef to test if it's the first render
  const firstRender = useRef(true);

  // Add author
  const [showAdd, setShowAdd] = useState(false);

  // // Delete author
  const [ openDialogDelete, setOpenDialogDelete ] = useState(false);

  // // Edit author
  const [ showEdit, setShowEdit ] = useState(false);

  useEffect(() => {
    // we want to skip validation on first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // here we can disable/enable the save button by wrapping the setState function
    // in a call to the validation function which returns true/false
    setDisabled(() => {
      // get all author_name push into array author_name
      const author_name = [];
      listRow.map((row) => author_name.push(row.author_name));
      if (name === "" && selectedImage === "") {
        setAlertName("Tên tác giả không được trống!!!");
        setAlertSelectedImage("Avatar không được để trống!!!");
        return true;
      } else if (name === "" && selectedImage !== "") {
        setAlertName("Tên tác giả không được trống!!!");
        setAlertSelectedImage("");
        return true;
      }
      if (name !== "" && selectedImage === "") {
        setAlertName("");
        setAlertSelectedImage("Avatar không được để trống!!!");
        return true;
      } else if (author_name.find((lname) => lname === name)) {
        setAlertName("Tên tác giả đã tồn tại!!!");
        return true;
      } else {
        setAlertName("");
        setAlertSelectedImage("");
        return false;
      }
    });
  }, [name, selectedImage]);

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

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
                setSeletedID(params.row.author_id)
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
        setResMessage("Có lỗi xãy ra!!!");
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
  }, [searchInput, resState]);

  return (
    <>
      <Dialog
        open={openDialogDelete}
        keepMounted
        onClose={(e) => setOpenDialogDelete(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Xóa tác giả"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Bạn xác nhận xóa tác giả này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={(e) => handleDelete(seletedID)}>
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
              disabled={showAdd && "disable"}
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
          {showAlert && <Alert severity={resState}>{resMessage}</Alert>}
        </Stack>
        {showAdd && (
          <AuthorAdd
            setShowAdd={setShowAdd}
            name={name}
            setName={setName}
            alertName={alertName}
            description={description}
            setDescription={setDescription}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            alertSelectedImage={alertSelectedImage}
            setShowAlert={setShowAlert}
            setResState={setResState}
            setResMessage={setResMessage}
            imageChange={imageChange}
            disable={disable}
          />
        )}
        {showEdit && <AuthorEdit />}
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
