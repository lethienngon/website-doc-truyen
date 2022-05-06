import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAlert } from 'react-alert';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CircularProgress from '@mui/material/CircularProgress';

import { loginUser } from '../../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAuth } from "../../redux/authSlice";


function Login(){

    const [showPass, setShowPass] = useState(true);

    // select waitSubmit (CircularProgress)
    let selectorUser = useSelector(selectAuth);
    // redux...
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // react-alert
    const alert = useAlert();

    // formik
    const formik = useFormik({
        initialValues: {
            loginUsername: "",
            loginPassword: "",
        },
        validationSchema: yup.object().shape({
            loginUsername: yup.string().required('This field username is required'),
            loginPassword: yup.string().required('This field password is required'),
        }),
        onSubmit: async (values) => {
            const newUser = {
                loginUsername: values.loginUsername,
                loginPassword: values.loginPassword,
            };
            // Call api (apiRequest)
            loginUser(newUser, dispatch, navigate, formik, alert);
        }
    })

    return (
        <div className="form login">
            { selectorUser.login.isFetching && <CircularProgress className='waitSubmit'/>}
            <h3>Đăng Nhập</h3>
            <label htmlFor="loginUsername">
                <input
                    value={formik.values.loginUsername}
                    type="text" 
                    id="loginUsername" 
                    name="loginUsername" 
                    placeholder="Vui lòng nhập Username"
                    onChange={formik.handleChange}
                />
                {
                    formik.errors.loginUsername && 
                    <p>{formik.errors.loginUsername}</p>
                }
            </label>
        
            <label htmlFor="loginPassword">
                <div>
                    <input
                        value={formik.values.loginPassword}
                        type={showPass ? 'password' : 'text'} 
                        id="loginPassword" 
                        name="loginPassword" 
                        placeholder="Vui lòng nhập Password"
                        onChange={formik.handleChange}
                    />
                    <button className='showPass' onClick={(e) => setShowPass(!showPass)}>
                        {(showPass) ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                </div>
                {
                    formik.errors.loginPassword && 
                    <p>{formik.errors.loginPassword}</p>
                }
            </label>
            
            <button type="submit" onClick={formik.handleSubmit} className="submit">Đăng nhập</button>
            <p className="forgot-password">Quên mật khẩu?</p>
            <div className="social-media">
                <FacebookIcon className="icon"/>
                <GoogleIcon className="icon"/>
            </div>
        </div>
    );
};

export default Login;