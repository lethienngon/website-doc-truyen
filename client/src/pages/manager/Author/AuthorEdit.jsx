import { useState, useEffect, useRef } from "react";
import { TextField, Avatar, Button } from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HideImageIcon from "@mui/icons-material/HideImage";
import Axios from "axios";

const AuthorEdit = ({
    setShowEdit,
    setShowAlert,
    setResState,
    setResMessage,
    listRow,
    seletedID,
}) => {

    const [editDisable, setEditDisable] = useState(true);
    const [name, setName] = useState("");
    const [checkName, setCheckName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [alertName, setAlertName] = useState("");
    const [alertSelectedImage, setAlertSelectedImage] = useState("");
    // we set it to true so that the form is disabled on first render
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
                if (author_name.find((lname) => lname == name) && (checkName != name) && (checkName != "")) {
                    setDisabled(true);
                    return "Author is exist";
                }
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
            setImage("");
        }
    };

    const getAuthorByID = async () => {
        try {
            const response = await Axios.get(
                `http://localhost:3001/api/v1/manager/authors/${seletedID}`
            );
            setName(response.data.author_name);
            setCheckName(response.data.author_name);
            setDescription(response.data.author_description);
            setImage(response.data.author_image);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getAuthorByID();
    }, [seletedID]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if(selectedImage){
            formData.append("image", selectedImage);
        }

        await Axios({
            method: "put",
            url: `http://localhost:3001/api/v1/manager/authors/edit/${seletedID}`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                setResState(res.data.state);
                setResMessage(res.data.message);
                console.log(res.data);
            })
            .catch(() => {
                setResState("error");
                setResMessage("Error update author");
            });

        setShowEdit(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
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
                            src={(selectedImage) ? URL.createObjectURL(selectedImage) : ("http://localhost:3001/"+image)}
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
                </div>
            </div>
        </div>
    );
};

export default AuthorEdit;
