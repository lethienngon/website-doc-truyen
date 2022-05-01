import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Avatar } from "@mui/material";
import * as yup from "yup";
import Axios from 'axios';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

function Register() {

    // const [usernameReg, setUsernameReg] = useState("");
    // const [passwordReg, setPasswordReg] = useState("");
    // const [rePasswordReg, setRePasswordReg] = useState("");
    // const [emailReg, setEmailReg] = useState("");
    // const [nameReg, setNameReg] = useState("");

    const [showPass, setShowPass] = useState(true);
    const [showRePass, setShowRePass] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [userName, setUserName] = useState('');

    // const register = () => {
    //     Axios.post("http://localhost:3001/register", {
    //         username: usernameReg,
    //         password: passwordReg,
    //         email: emailReg,
    //     }).then((response) => {
    //         console.log(response);
    //     });
    // };

    const formik = useFormik({
        initialValues: {
            registerUsername: "",
            registerPassword: "",
            registerRePassword: "",
            registerName: "",
            registerEmail: "",
            registerImage: "",
        },
        validationSchema: yup.object().shape({
            registerUsername: yup.string()
                            .required('This field username is required')
                            .min(6,'Must be 6 characters or more')
                            .max(100, 'Must be less than 100 characters')
                            .matches(/^(?=.*[A-Za-z])[A-Za-z\d]{6,100}$/,'Only contains alphanumeric characters'),
            registerPassword: yup.string()
                            .required('This field password is required')
                            .min(8,'Must be 8 characters or more')
                            .max(200, 'Must be less than 200 characters')
                            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,200}$/,'At least one letter and one number'),
            registerRePassword: yup.string()
                            .required('This field confirm password is required')
                            .oneOf([yup.ref("registerPassword"), null],'Password must match'),
            registerName: yup.string()
                            .required('This field name is required')
                            .min(6,'Must be 6 characters or more')
                            .max(250, 'Must be less than 250 characters'),
            registerEmail: yup.string()
                            .required('This field email is required')
                            .email('Please enter a valid email address')
                            .max(250, 'Must be less than 250 characters'),
            registerImage: yup.string().required('This field avatar is required'),
        }),
        onSubmit: async (values, actions) => {
            await Axios.get('http://localhost:3001/api/v1/signpage/signup/findusername/'+userName)
            .then((res) => {
                if(res.data.user_username == formik.values.registerUsername){
                    // actions.setSubmitting(false);
                    formik.errors.registerUsername="Username already is use";
                }
                else {
                    // formik.errors.registerUsername="";
                }
                console.log(formik.errors.registerUsername);
        })
        }
    })

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    return (
        <div className="form register">
            <h3>Đăng kí</h3>
            <label htmlFor="registerUsername">
                <input
                    value={formik.values.registerUsername}
                    type="text" 
                    id="registerUsername" 
                    name="registerUsername" 
                    placeholder="Vui lòng nhập Username"
                    onChange={(e)=>{formik.handleChange(e);
                                    setUserName(e.target.value)}}
                />
                {
                    formik.errors.registerUsername && 
                    <p title="/^(?=.*[A-Za-z])[A-Za-z\d]{6,100}$/">{formik.errors.registerUsername}</p>
                }
            </label>
            <label htmlFor="registerPassword">
                <div>
                    <input 
                        value={formik.values.registerPassword}
                        type={showPass ? 'password' : 'text'} 
                        id="registerPassword" 
                        name="registerPassword" 
                        placeholder="Vui lòng nhập Password"
                        onChange={formik.handleChange}
                    />
                    <button className='showPass' onClick={(e) => setShowPass(!showPass)}>
                        {(showPass) ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                </div>
                {
                    formik.errors.registerPassword && 
                    <p title="/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,200}$/">{formik.errors.registerPassword}</p>
                }
            </label>
            <label htmlFor="registerRePassword">
                <div>
                    <input 
                    value={formik.values.registerRePassword}
                        type={showRePass ? 'password' : 'text'} 
                        id="registerRePassword" 
                        name="registerRePassword" 
                        placeholder="Xác nhận lại mật khẩu"
                        onChange={formik.handleChange}
                    />
                    <button className='showRePass' onClick={(e) => setShowRePass(!showRePass)}>
                        {(showRePass) ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                </div>
                {
                    formik.errors.registerRePassword && 
                    <p>{formik.errors.registerRePassword}</p>
                }
            </label>
            <label htmlFor="registerName">
                <input 
                    value={formik.values.registerName}
                    type="text" 
                    id="registerName" 
                    name="registerName" 
                    placeholder="Vui lòng nhập tên"
                    onChange={formik.handleChange}
                />
                {
                    formik.errors.registerName && 
                    <p>{formik.errors.registerName}</p>
                }
            </label>
            <label htmlFor="registerEmail">
                <input 
                    value={formik.values.registerEmail}
                    type="text" 
                    id="registerEmail" 
                    name="registerEmail" 
                    placeholder="Vui lòng nhập Email"
                    onChange={formik.handleChange}
                />
                {
                    formik.errors.registerEmail && 
                    <p>{formik.errors.registerEmail}</p>
                }
            </label>
            <label htmlFor="registerImage">
                <div className="inputImage">
                    {(selectedImage) ?
                        <Avatar
                            className="iconImage"
                            alt="Avatar of Author"
                            src={URL.createObjectURL(selectedImage)}
                        />
                        :
                        <AddPhotoAlternateIcon className="iconImage" />
                    }
                    <input
                        style={{ display: "none" }}
                        type="file"
                        id="registerImage"
                        name="registerImage"
                        accept="image/*"
                        onClick={(e) => {setSelectedImage("");
                                         e.target.value=null;
                                         formik.handleChange(e)}}
                        onChange={(e) => {imageChange(e);
                                         formik.handleChange(e)}}
                    />
                    {
                        formik.errors.registerImage ?
                        <p>{formik.errors.registerImage}</p>
                        :
                        <p title={formik.values.registerImage} style={{ color: 'blueviolet'}}>{formik.values.registerImage}</p>
                    }
                </div>
            </label>
            <button type='submit' onClick={formik.handleSubmit} className="submit">Đăng kí</button>
        </div>
    );
}

export default Register;