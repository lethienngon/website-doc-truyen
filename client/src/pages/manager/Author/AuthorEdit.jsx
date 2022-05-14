import { useState, useEffect, useRef } from "react";
import { TextField, Avatar, Button } from "@mui/material";
import { useAlert } from 'react-alert';
import TextareaAutosize from "@mui/base/TextareaAutosize";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HideImageIcon from "@mui/icons-material/HideImage";
import CircularProgress from '@mui/material/CircularProgress';

import { getAuthorByID, editAuthor } from '../../../redux/apiRequest';
import { useSelector } from 'react-redux';

const AuthorEdit = ({
    setShowEdit,
    listRow,
    seletedID,
}) => {

    const user = useSelector(state => state.auth.login.currentUser);
    const alert = useAlert();

    const [waitSubmit, setWaitSubmit] = useState(false);
    const [editDisable, setEditDisable] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [alertName, setAlertName] = useState("");
    const [alertSelectedImage, setAlertSelectedImage] = useState("");
    const [disable, setDisabled] = useState(true);

    // we use the help of useRef to test if it's the first render
    const firstRender = useRef(true);

    useEffect(() => {
        // we want to skip validation on first render
        if (firstRender.current) {
            firstRender.current = true;
            return;
        }
        setAlertName(() => {
            // get all author_name push into array author_name
            const author_name = [];
            listRow.map((row) => author_name.push(row.author_name));

            if (name == "") {
                setDisabled(true);
                return "The field name is required";
            }
            else {
                setDisabled(false);
                return "";
            }
        });
    }, [name]);

    useEffect(() => {
        // we want to skip validation on first render
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        setAlertSelectedImage(() => {
            if (selectedImage == "" && image == "") {
                setDisabled(true);
                return "The field avatar is required";
            }
             else {
                setDisabled(false);
                return "";
            }
        });
    }, [selectedImage, image]);

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
            setImage('');
        }
    };

    useEffect( async () => {
        const response = await getAuthorByID(seletedID, user.accessToken, alert)
            setName(response.author_name);
            setDescription(response.author_description);
            setImage(response.author_image);
    }, [seletedID]);

    const handleSubmit = async () => {
        try {
            setWaitSubmit(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            if(!image) {
                formData.append('image', selectedImage);
            }else {
                formData.append('image', null);
            }

            let status = await editAuthor(seletedID, formData, user.accessToken, alert);
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
            setShowEdit(false);
        }
    };

    return (
        <div className="authorForm">
            <div className="addAvatar">
                <label>
                    <AddPhotoAlternateIcon 
                        className="iconAdd"
                        style={{  color: editDisable ?  "gray" : "black"}}
                    />
                    <input
                        style={{ display: "none" }}
                        id="inputAvatar"
                        accept="image/*"
                        type="file"
                        onClick={e => {e.target.value=null}}
                        onChange={imageChange}
                        disabled={editDisable}
                    />
                </label>
                <p>{alertSelectedImage}</p>
                {(selectedImage || image) && (
                    <div>
                        <Avatar
                            className="avatar"
                            alt="Avatar of Author"
                            src={(image) ? "http://localhost:3001/"+image : URL.createObjectURL(selectedImage)}
                        />
                        <HideImageIcon
                            className="iconRemove"
                            onClick={() => setSelectedImage("")}
                            style={{  color: (editDisable || image) ?  "gray" : "black"}}
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
                    disabled={editDisable}
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
                    disabled={editDisable}
                />
                <div className="buttonForm">
                    {   editDisable ? 
                        <Button
                            variant="outlined"
                            onClick={e => setEditDisable(false)}
                        >
                            Edit
                        </Button> 
                        :
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={disable}
                        >
                            Save
                        </Button>
                    }
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setName("");
                            setDescription("");
                            setSelectedImage("");
                        }}
                        disabled={editDisable}
                    >
                        Reset
                    </Button>
                    { waitSubmit && <CircularProgress className='waitSubmit'/>}
                </div>
            </div>
        </div>
    );
};

export default AuthorEdit;
