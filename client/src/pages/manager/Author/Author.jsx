import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { TextField, Avatar, Button } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HideImageIcon from '@mui/icons-material/HideImage';
import Axios from 'axios';

import "./author.scss";

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 300 },
  { 
    field: 'avatar', 
    headerName: 'Avatar', 
    width: 100,
    renderCell: (params) => {
      return (
        <Avatar className="avatar" alt="Avatar of Author" src={params.row.avatar} />
      )
    }
  },
  { field: 'description', headerName: 'Description', width: 550 },
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

const rows = [
  { id: 1, name: 'Đường gia tam thiếu', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 35},
  { id: 2, name: 'Lannister', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 'Tables display information in a way thats easy to scan, so that users can look for patterns and insights. They can be embedded in primary content, such as cards. They can include:' },
  { id: 3, name: 'Lannister', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 45 },
  { id: 4, name: 'Stark', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 16 },
  { id: 5, name: 'Targaryen', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: null },
  { id: 6, name: 'Melisandre', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 150 },
  { id: 7, name: 'Clifford', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 44 },
  { id: 8, name: 'Frances', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 36 },
  { id: 9, name: 'Roxie', avatar: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg', description: 65 },
];

const AuthorAdd = () => {

  const [ nameAdd, setNameAdd ] = useState("");
  const [ descriptionAdd, setDescriptionAdd ] = useState("");
  const [selectedImage, setSelectedImage] = useState();

  const handleSubmit = () => {
    Axios.post("http://localhost:3001/manager/author/add", {
            name: nameAdd,
            description: descriptionAdd,
        }).then((response) => {
            console.log(response);
        });

    setNameAdd("");
    setDescriptionAdd("");
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

    return (
        <div className='authorContainer'>
          <div className='authorHeader'>
            <div className="search">
              <input type="text" placeholder="Search..."/>
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
                rows={rows}
                columns={columns}
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