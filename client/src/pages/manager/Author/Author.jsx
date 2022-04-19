import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { TextField, Avatar, Button } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HideImageIcon from '@mui/icons-material/HideImage';
import Axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import "./author.scss";

// create object context
export const SearchInputContext = createContext();

const AuthorAdd = () => {

  const [ nameAdd, setNameAdd ] = useState("");
  const [ descriptionAdd, setDescriptionAdd ] = useState("");
  const [ selectedImage, setSelectedImage ] = useState("");
  const [ alertNameAdd, setAlertNameAdd ] = useState("");
  const [ alertSelectedImage, setAlertSelectedImage ] = useState("");
  // we set it to true so that the form is disabled on first render
  const [disable, setDisabled] = useState(true)

  // use object context
  const { listRow, setShowAdd, setResStateAddValue, setShowAlertAdd } = useContext(SearchInputContext);

  // we use the help of useRef to test if it's the first render
  const firstRender = useRef(true);

  useEffect(()=>{
    // we want to skip validation on first render
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    // here we can disable/enable the save button by wrapping the setState function
    // in a call to the validation function which returns true/false
    setDisabled(() => {
      // get all author_name push into array author_name
      const author_name = [];
      listRow.map(row => (
      author_name.push(row.author_name)
      ))
      if(nameAdd == "" && selectedImage == ""){
        setAlertNameAdd("Tên tác giả không được trống!!!");
        setAlertSelectedImage("Avatar không được để trống!!!");
        return true;
      }
      else if(nameAdd == "" && selectedImage != ""){
        setAlertNameAdd("Tên tác giả không được trống!!!");
        setAlertSelectedImage("");
        return true;
      }
      if(nameAdd != "" && selectedImage == ""){
        setAlertNameAdd("");
        setAlertSelectedImage("Avatar không được để trống!!!");
        return true;
      }
      else if(author_name.find(name => name == nameAdd)){
        setAlertNameAdd("Tên tác giả đã tồn tại!!!");
        return true;
      }
      else{
        setAlertNameAdd("");
        setAlertSelectedImage("");
        return false;
      }
      })
  }, [ nameAdd, selectedImage ])


  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append('name', nameAdd)
    formData.append('description', descriptionAdd)
    formData.append('image', selectedImage)

    await Axios({
      method: "post",
      url: "http://localhost:3001/api/v1/manager/authors/add",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => {
      console.log(res.data);
      setResStateAddValue(res.data.state);
    })
    .catch(setResStateAddValue(0));

    setShowAdd(false);
    setShowAlertAdd(true);
    setTimeout(() => setShowAlertAdd(false),2000);
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      console.log("test");
    }
  };

  return (
    <div className='authorAdd'>
      <div className='addAvatar'>
        <label>
          <AddPhotoAlternateIcon className='iconAdd'/>
          <input
            style={{display: "none"}}
            id='inputAvatar'
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
            <HideImageIcon className='iconRemove' onClick={(e) => setSelectedImage("")}/>
          </div>
        )}
      </div>
      <div className='addTextField'>
        <TextField
          value={nameAdd}
          id="outlined-name-input"
          label="Name"
          type="text"
          onChange={(e) => setNameAdd(e.target.value)}
        />
        <p>{alertNameAdd}</p>
        <TextareaAutosize
          value={descriptionAdd}
          minRows={6}
          maxRows={10}
          placeholder="Description..."
          style={{ 
                  width: 500,
                  maxWidth: 770,
                  maxHeight: 500,
                  padding: 10,
                  fontSize: 14
                }}
          onChange={(e) => setDescriptionAdd(e.target.value)}
        />
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={disable}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

const AuthorEdit = () => {
  const [ nameEdit, setNameEdit ] = useState("");
  const [ descriptionEdit, setDescriptionEdit ] = useState("");
  const [ selectedImage, setSelectedImage ] = useState("");
  const [ alertNameEdit, setAlertNameEdit ] = useState("");
  const [ alertSelectedImage, setAlertSelectedImage ] = useState("");
  // we set it to true so that the form is disabled on first render
  const [disable, setDisabled] = useState(true)

  // use object context
  const { listRow, setShowEdit, setResStateEditValue, setShowAlertEdit, seletedID } = useContext(SearchInputContext);

  // we use the help of useRef to test if it's the first render
  const firstRender = useRef(true);

  useEffect(()=>{
    // we want to skip validation on first render
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    // here we can disable/enable the save button by wrapping the setState function
    // in a call to the validation function which returns true/false
    setDisabled(() => {
      // get all author_name push into array author_name
      const author_name = [];
      listRow.map(row => (
      author_name.push(row.author_name)
      ))
      if(nameEdit == "" && selectedImage == ""){
        setAlertNameEdit("Tên tác giả không được trống!!!");
        setAlertSelectedImage("Avatar không được để trống!!!");
        return true;
      }
      else if(nameEdit == "" && selectedImage != ""){
        setAlertNameEdit("Tên tác giả không được trống!!!");
        setAlertSelectedImage("");
        return true;
      }
      if(nameEdit != "" && selectedImage == ""){
        setAlertNameEdit("");
        setAlertSelectedImage("Avatar không được để trống!!!");
        return true;
      }
      else if(author_name.find(name => name == nameEdit)){
        setAlertNameEdit("Tên tác giả đã tồn tại!!!");
        return true;
      }
      else{
        setAlertNameEdit("");
        setAlertSelectedImage("");
        return false;
      }
      })
  }, [ nameEdit, selectedImage ])


  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append('name', nameEdit)
    formData.append('description', descriptionEdit)
    formData.append('image', selectedImage)

    await Axios({
      method: "post",
      url: `http://localhost:3001/api/v1/manager/authors/edit/${seletedID}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => {
      console.log(res.data);
      setResStateEditValue(res.data.state);
    })
    .catch(setResStateEditValue(0));

    setShowEdit(false);
    setShowAlertEdit(true);
    setTimeout(() => setShowAlertEdit(false),2000);
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className='authorAdd'>
      <div className='addAvatar'>
        <label>
          <AddPhotoAlternateIcon className='iconAdd'/>
          <input
            style={{display: "none"}}
            id='inputAvatar'
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
            <HideImageIcon className='iconRemove' onClick={(e) => setSelectedImage("")}/>
          </div>
        )}
      </div>
      <div className='addTextField'>
        <TextField
          value={nameEdit}
          id="outlined-name-input"
          label="Name"
          type="text"
          onChange={(e) => setNameEdit(e.target.value)}
        />
        <p>{alertNameEdit}</p>
        <TextareaAutosize
          value={descriptionEdit}
          minRows={6}
          maxRows={10}
          placeholder="Description..."
          style={{ 
                  width: 500,
                  maxWidth: 770,
                  maxHeight: 500,
                  padding: 10,
                  fontSize: 14
                }}
          onChange={(e) => setDescriptionEdit(e.target.value)}
        />
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={disable}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
const Author = () => {

  const [ searchInput, setSearchInput ] = useState("");
  const [ listRow, setListRow ] = useState([]);
  const [ seletedID, setSeletedID ] = useState();

  // Add author
  const [ showAdd, setShowAdd ] = useState(false);
  const [ showAlertAdd, setShowAlertAdd ] = useState(false);
  const [ resStateAddValue, setResStateAddValue ] = useState(-1);
  const resStateAdd = [
    {
      state: 'error',
      alert: "Có lỗi xảy ra!!!"
    },
    { 
      state: 'success',
      alert: "Thêm tác giả thành công"
    }
  ];

  // Delete author
  const [ openDialogDelete, setOpenDialogDelete ] = useState(false);
  const [ showAlertDelete, setShowAlertDelete ] = useState(false);
  const [ resStateDeleteValue, setResStateDeleteValue ] = useState(-1);
  const resStateDelete = [
    {
      state: 'error',
      alert: "Có lỗi xảy ra!!!"
    },
    { 
      state: 'success',
      alert: "Xóa tác giả thành công"
    },
    { 
      state: 'warning',
      alert: "Tác giả có id = " + seletedID + " không tồn tại"
    }
  ];

  // Edit author
  const [ showEdit, setShowEdit ] = useState(false);

  // Columns DataGrid
  const columns = [
    { field: 'author_id', headerName: 'ID', width: 100 },
    { field: 'author_name', headerName: 'Name', width: 300 },
    { 
      field: 'author_image', 
      headerName: 'Avatar', 
      width: 100,
      renderCell: (params) => {
        return (
          <Avatar className="avatar" alt="Avatar of Author" src={ params.row.author_image && 'http://localhost:3001/'+params.row.author_image} />
        )
      }
    },
    { field: 'author_description', headerName: 'Description', width: 550 },
    { 
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: (params) => {

        return (
          <div className='action'>
            <div className='viewButton'
              onClick={(e) => {
                setShowEdit(true);
                setShowAdd(false);
                setSeletedID(params.row.author_id)
              }}
            >
              View
              </div>
            <div className="deleteButton" 
              onClick={(e) => {
                setOpenDialogDelete(true);
                setSeletedID(params.row.author_id)
              }}
            >
              Delete
            </div>
          </div>
        )
      }
    },
  ];

  const handleDelete = async (authorID) => {
    await Axios.delete(`http://localhost:3001/api/v1/manager/authors/delete/${authorID}`)
    .then(res => {
      console.log(res.data);
      setResStateDeleteValue(res.data.state);
    })
    .catch(err => {
      console.log(err);
    });
    setOpenDialogDelete(false);
    setShowAlertDelete(true);
    setTimeout(() => setShowAlertDelete(false),2000);
  }

  const getAllAuthor = async () => {
    try {
      const response = await Axios.get(`http://localhost:3001/api/v1/manager/authors?name=${searchInput}`);
        setListRow(response.data);
    } catch (error) {
        console.log(error.message)
    }
  }

  useEffect(() => {
    getAllAuthor();
  }, [searchInput, resStateAddValue, resStateDeleteValue])

  return (
    <SearchInputContext.Provider value={{ listRow, setShowAdd, setResStateAddValue, setShowAlertAdd, seletedID }}>
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
          <Button variant="contained" onClick={(e) => handleDelete(seletedID)}>YES</Button>
          <Button variant="outlined" onClick={(e) => setOpenDialogDelete(false)}>NO</Button>
        </DialogActions>
      </Dialog>
        <div className='authorContainer'>
          <div className='authorHeader'>
            <div className="search">
              <input 
                type="text" 
                placeholder="Search..."
                value={searchInput}
                disabled={showAdd && 'disable'}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <SearchOutlinedIcon />
            </div>
            <div 
              className='addButton'
              style={{
                color: showAdd ? "white" : "darkgreen",
                backgroundColor: showAdd ? "darkgreen" : "white"
              }}
              onClick={(e) => {
                setSearchInput("");
                setShowAdd(!showAdd);
                setShowEdit(false);
              }}
            >
              Add Author</div>
          </div>
          <Stack sx={{ width: '100%' }} spacing={2}>
            { showAlertAdd && <Alert severity={resStateAdd[resStateAddValue].state}>{resStateAdd[resStateAddValue].alert}</Alert> }
            { showAlertDelete && <Alert severity={resStateDelete[resStateDeleteValue].state}>{resStateDelete[resStateDeleteValue].alert}</Alert> }
          </Stack>
          {showAdd && <AuthorAdd />}
          {showEdit && <AuthorEdit />}
          <div className='authorList'>
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
      </SearchInputContext.Provider>
    );
};

export default Author;