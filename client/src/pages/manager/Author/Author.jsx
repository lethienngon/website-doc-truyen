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
  const { getAllAuthor, listRow, setShow, setResStateValue, setShowAlert } = useContext(SearchInputContext);

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


  const handleSubmit = () => {

    const formData = new FormData();
    formData.append('name', nameAdd)
    formData.append('description', descriptionAdd)
    formData.append('image', selectedImage)

    Axios({
      method: "post",
      url: "http://localhost:3001/api/v1/manager/authors/add",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => {
      setResStateValue(res.data.state);
      console.log(res.data)
    })
    .catch(setResStateValue(0));

    getAllAuthor();
    setShow(false);

    setShowAlert(true);
    setTimeout(() => setShowAlert(false),2000);
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage("");
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
            <HideImageIcon className='iconRemove' onClick={removeSelectedImage}/>
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

const Author = () => {

  const [ show, setShow ] = useState(false);
  const [ searchInput, setSearchInput ] = useState("");
  const [ listRow, setListRow ] = useState([]);
  
  const [ seletedID, setSelectedID ] = useState();

  // Alert add author
  const [ showAlert, setShowAlert ] = useState(false);
  const [ resStateValue, setResStateValue ] = useState(-1);
  const resState = [
    {
      state: 'error',
      alert: "Có lỗi xảy ra!!!"
    },
    { 
      state: 'success',
      alert: "Thêm tác giả thành công"
    },
    { 
      state: 'success',
      alert: "Xóa tác giả thành công"
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
            <div className='viewButton'>View</div>
            <div className="deleteButton" 
              onClick={(e) => {
                setOpenDialogDelete(true);
                setSelectedID(params.row.author_id)
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
  }, [searchInput, resStateValue, resStateDeleteValue])

  return (
    <SearchInputContext.Provider value={{ getAllAuthor, listRow, setShow, setResStateValue, setShowAlert }}>
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
                disabled={show && 'disable'}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <SearchOutlinedIcon />
            </div>
            <div 
              className='addButton'
              style={{
                color: show ? "white" : "darkgreen",
                backgroundColor: show ? "darkgreen" : "white"
              }}
              onClick={(e) => {setSearchInput(""); setShow(!show)}}
            >
              Add Author</div>
          </div>
          <Stack sx={{ width: '100%' }} spacing={2}>
            { showAlert && <Alert severity={resState[resStateValue].state}>{resState[resStateValue].alert}</Alert> }
            { showAlertDelete && <Alert severity={resStateDelete[resStateDeleteValue].state}>{resStateDelete[resStateDeleteValue].alert}</Alert> }
          </Stack>
          {show && <AuthorAdd />}
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