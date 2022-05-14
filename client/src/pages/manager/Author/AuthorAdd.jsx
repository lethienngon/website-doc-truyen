import { useState, useEffect, useRef } from "react";
import { TextField, Avatar, Button } from "@mui/material";
import { useAlert } from 'react-alert';
import TextareaAutosize from "@mui/base/TextareaAutosize";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HideImageIcon from "@mui/icons-material/HideImage";
import CircularProgress from '@mui/material/CircularProgress';

import { addAuthor } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';

const AuthorAdd = ({
    setShowAdd,
    listRow
}) => {

    const user = useSelector(state => state.auth.login.currentUser);
    const alert = useAlert();

    const [waitSubmit, setWaitSubmit] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [alertName, setAlertName] = useState("");
    const [alertSelectedImage, setAlertSelectedImage] = useState("");
    const [disable, setDisabled] = useState(true);

    // we use the help of useRef to test if it's the first render
    const firstRender = useRef(true);

    useEffect(() => {
        // we want to skip validation on first render
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        setDisabled(() => {
            // get all author_name push into array author_name
            const author_name = [];
            listRow.map((row) => author_name.push(row.author_name));
            if (name == "" && selectedImage == "") {
              setAlertName("The field name is required");
              setAlertSelectedImage("The field avatar is required");
              return true;
            } else if (name == "" && selectedImage != "") {
              setAlertName("The field name is required");
              setAlertSelectedImage("");
              return true;
            }
            if (name != "" && selectedImage == "") {
              setAlertName("");
              setAlertSelectedImage("The field avatar is required");
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

    const handleSubmit = async () => {
        try {
            setWaitSubmit(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("image", selectedImage);

            let status =  await addAuthor(formData, user.accessToken, alert);
                if(status) {
                    setSelectedImage('');
                }
        }
        catch(err){
            console.log(err);
            alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        }
        finally{
            setWaitSubmit(false);
            setShowAdd(false);
        }
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
                        onClick={e => {e.target.value=null}}
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
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={disable}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setName("");
                            setDescription("");
                            setSelectedImage("");
                        }}
                    >
                        Reset
                    </Button>
                    { waitSubmit && <CircularProgress className='waitSubmit'/>}
                </div>
            </div>
        </div>
    );
};

export default AuthorAdd;
