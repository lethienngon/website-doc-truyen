import { useState, useEffect } from "react";
import { TextField, Avatar, Button } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAlert } from 'react-alert';
import TextareaAutosize from "@mui/base/TextareaAutosize";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HideImageIcon from "@mui/icons-material/HideImage";
import CircularProgress from '@mui/material/CircularProgress';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { useSelector } from 'react-redux';
import { getAllIdNameCategorys, editStory, getStoryByID } from '../../../redux/apiRequest';

import "./story.scss";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StoryEdit = ({setShowEdit, seletedID}) => {

    const [listCategory, setListCategory] = useState([]);
    const [listAuthor, setListAuthor] = useState([]);

    const user = useSelector(state => state.auth.login.currentUser);
    const alert = useAlert();

    const [selectedImage, setSelectedImage] = useState("");
    const [editImage, setEditImage] = useState('');
    const [waitSubmit, setWaitSubmit] = useState(false);

    let storyByID = [];
    const [load, setLoad] = useState(false);

    useEffect(async () => {
        let categoryTemp = await getAllIdNameCategorys(user.accessToken, alert);
        setListCategory(categoryTemp.categorys);
        // let authorTemp = await getAllIdNameAuthors(user.accessToken, alert);
        setListAuthor(categoryTemp.authors);
        storyByID = await getStoryByID(seletedID, user.accessToken, alert);
        formik.values.type = storyByID[0].truyen_type;
        formik.values.status = storyByID[0].truyen_status;
        formik.values.name = storyByID[0].truyen_name;
        formik.values.category = storyByID[0].arrayCategory;
        formik.values.author = storyByID[0].arrayAuthor;
        formik.values.description = storyByID[0].truyen_description;
        formik.values.image = storyByID[0].truyen_image
        setEditImage(storyByID[0].truyen_image);
        setLoad(true);
    },[load, seletedID])

    const handleChangeCategory = (e) => {
        formik.values.category = () => {e.target.value.split(',')}
    };

    const handleChangeAuthor = (e) => {
        formik.values.author = () => {e.target.value.split(',')}
    };

    const formik = useFormik({
        initialValues: {
            type: '',
            status: '',
            name: '',
            category: [],
            author: [],
            description: '',
            image: '',
        },
        validationSchema: yup.object().shape({
            type: yup.string().required('This field type is required'),
            status: yup.string().required('This field status is required'),
            name: yup.string()
                            .required('This field name is required')
                            .min(6,'Must be 6 characters or more')
                            .max(250, 'Must be less than 250 characters'),
            category: yup.array().min(1,'This field category is required'),
            author: yup.array().min(1,'This field author is required'),
            description: yup.string().required('This field description is required'),
            image: yup.string().required('This field avatar is required'),
        }),
        onSubmit: async (values) => {
            try{
                    setWaitSubmit(true);
                    const formData = new FormData();
                    formData.append('type', values.type);
                    formData.append('name', values.name);
                    formData.append('status', values.status);
                    formData.append('category', values.category);
                    formData.append('author', values.author);
                    formData.append('description', values.description);
                    if(!editImage) {
                        formData.append('image', selectedImage);
                    }else {
                        formData.append('image', null);
                    }
                    
                    let status =  await editStory(seletedID, formData, user.accessToken, alert);
                    if(status) {
                        formik.resetForm();
                        setSelectedImage('');
                    }
            }
            catch(err){
                console.log(err);
                alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
            }
            finally{
                setWaitSubmit(false);
            }
        }
    })

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
            setEditImage(false);
        }
    };

    return (
        <div className="storyForm">
            <div className="addAvatar">
                <label>
                    <AddPhotoAlternateIcon className="iconAdd" />
                    <input
                        style={{ display: "none" }}
                        id="image"
                        name="image"
                        accept="image/*"
                        type="file"
                        onClick={(e) => {setSelectedImage("");
                                         e.target.value=null;
                                         formik.handleChange(e)}}
                        onChange={(e) => {imageChange(e);
                                         formik.handleChange(e)}}
                    />
                </label>
                { formik.errors.image && <p>{formik.errors.image}</p> }
                {(selectedImage || editImage) && (
                    <div>
                        <Avatar
                            className="avatar"
                            alt="Avatar of Author"
                            src={ editImage ? 'http://localhost:3001/'+editImage : URL.createObjectURL(selectedImage) }
                        />
                        <HideImageIcon
                            className="iconRemove"
                            onClick={(e) => {setSelectedImage("");
                                            formik.values.image=''}}
                        />
                    </div>
                )}
            </div>
            <div className="addTextField">
                <div className="box">
                    <div className="textField">
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl fullWidth>
                                <InputLabel id="typeStory">Type Story</InputLabel>
                                <Select
                                    labelId="typeStory"
                                    id="type"
                                    name="type"
                                    value={formik.values.type}
                                    label="Type Story"
                                    onChange={(e)=>formik.handleChange(e)}
                                >
                                    <MenuItem value={10}>Truyện Tranh</MenuItem>
                                    <MenuItem value={20}>Truyện Chữ</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        { formik.errors.type && <p>{formik.errors.type}</p> }
                    </div>
                    <div className="textField">
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl fullWidth>
                                <InputLabel id="statusStory">Status Story</InputLabel>
                                <Select
                                    labelId="statusStory"
                                    id="status"
                                    name="status"
                                    defaultValue={formik.values.status}
                                    value={formik.values.status}
                                    label="Status Story"
                                    onChange={(e)=>formik.handleChange(e)}
                                >
                                    <MenuItem value={10}>Active</MenuItem>
                                    <MenuItem value={20}>Lock</MenuItem>
                                    <MenuItem value={30}>Error</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        { formik.errors.status && <p>{formik.errors.status}</p> }
                    </div>
                    <div className="textField">
                        <TextField
                            value={formik.values.name}
                            sx={{ minWidth: 300 }}
                            name="name" 
                            label="Name"
                            type="text"
                            onChange={(e)=>formik.handleChange(e)}
                        />
                        { formik.errors.name && <p>{formik.errors.name}</p> }
                    </div>
                </div>
                <div className="box">
                    <div className="textField">
                        <Box sx={{ minWidth: 250 }}>
                            <FormControl fullWidth>
                                <InputLabel id="categoryStory">Category Story</InputLabel>
                                <Select
                                    labelId="categoryStory"
                                    id="category"
                                    name="category"
                                    multiple
                                    value={formik.values.category}
                                    label="Category Story"
                                    MenuProps={MenuProps}
                                    renderValue={(selected) => selected.join(', ')}
                                    onChange={(e)=>{formik.handleChange(e); handleChangeCategory(e)}}
                                >
                                    { listCategory.map(category => (
                                        <MenuItem key={category.category_id} value={category.category_id}>
                                            <Checkbox checked={formik.values.category.indexOf(category.category_id) > -1} />
                                            <ListItemText primary={ category.category_id+' - '+category.category_name}/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        { formik.errors.category && <p>{formik.errors.category}</p> }
                    </div>
                    <div className="textField">
                        <Box sx={{ minWidth: 250 }}>
                            <FormControl fullWidth>
                                <InputLabel id="authorStory">Author Story</InputLabel>
                                <Select
                                    labelId="authorStory"
                                    id="author"
                                    name="author"
                                    multiple
                                    value={formik.values.author}
                                    label="Author Story"
                                    MenuProps={MenuProps}
                                    renderValue={(selected) => selected.join(', ')}
                                    onChange={(e)=>{formik.handleChange(e); handleChangeAuthor(e)}}
                                >
                                    { listAuthor.map(author => (
                                        <MenuItem key={author.author_id} value={author.author_id}>
                                            <Checkbox checked={formik.values.author.indexOf(author.author_id) > -1} />
                                            <ListItemText primary={ author.author_id+' - '+author.author_name}/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        { formik.errors.author && <p>{formik.errors.author}</p> }
                    </div>
                </div>
                <div className="textField">
                    <TextareaAutosize
                        value={formik.values.description}
                        name="description"
                        minRows={6}
                        maxRows={10}
                        placeholder="Description..."
                        style={{
                            width: 520,
                            maxWidth: 770,
                            maxHeight: 500,
                            padding: 10,
                            fontSize: 14,
                        }}
                        onChange={(e)=>formik.handleChange(e)}
                    />
                    { formik.errors.description && <p>{formik.errors.description}</p> }
                </div>
                <div className="buttonForm">
                    <Button
                        variant="contained"
                        onClick={(e) => {formik.handleSubmit(e); setShowEdit(false)}}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            formik.resetForm();
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

export default StoryEdit;