import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { TextField, Avatar, Button } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HideImageIcon from '@mui/icons-material/HideImage';
import Axios from 'axios';

import "./author.scss";

const AuthorAdd = () => {

  const [ nameAdd, setNameAdd ] = useState("");
  const [ descriptionAdd, setDescriptionAdd ] = useState("");
  const [ selectedImage, setSelectedImage] = useState();

  const handleSubmit = () => {

    const formData = new FormData();
    formData.append('name', nameAdd)
    formData.append('description', descriptionAdd)
    formData.append('image', selectedImage)

    const response = Axios({
      method: "post",
      url: "http://localhost:3001/api/v1/manager/authors/add",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    // console.log(selectedImage)
    console.log(response);

    setNameAdd("");
    setDescriptionAdd("");
    setSelectedImage();
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage();
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
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  )
}

const Author = () => {

  const [ show, setShow ] = useState(false);
  const [ colorAddButton, setColorAddButton] = useState(true);
  const [ searchInput, setSearchInput ] = useState("");
  const [ listRow, setListRow ] = useState([]);

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
      renderCell: () => {
        return (
          <div className='action'>
            <div className='viewButton'>View</div>
            <div className="deleteButton">Delete</div>
          </div>
        )
      }
    },
  ];

  useEffect(() => {
    ;(async () => {
        try {
            const response = await Axios.get(`http://localhost:3001/api/v1/manager/authors?name=${searchInput}`);
            setListRow(response.data);
        } catch (error) {
            console.log(error.message)
        }
    })()
  }, [searchInput])


    return (
        <div className='authorContainer'>
          <div className='authorHeader'>
            <div className="search">
              <input 
                type="text" 
                placeholder="Search..."
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <SearchOutlinedIcon />
            </div>
            <div 
              className='addButton'
              style={{
                color: colorAddButton ? "darkgreen" : "white",
                backgroundColor: colorAddButton ? "white" : "darkgreen"
              }}
              onClick={(e) => {
                setShow(!show);
                setColorAddButton(!colorAddButton);
              }}
            >
              Add Author</div>
          </div>
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
    );
};

export default Author;