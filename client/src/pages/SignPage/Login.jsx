import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import './index.scss'

function Login(){

    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");

    const [showPass, setShowPass] = useState(true);

    // const login = () => {
    //     Axios.post("http://localhost:3001/login", {
    //         username: username,
    //         password: password,
    //     }).then((response) => {
    //         console.log(response);
    //     });
    // };

    const formik = useFormik({
        initialValues: {
            loginUsername: "",
            loginPassword: "",
        },
        validationSchema: yup.object().shape({
            loginUsername: yup.string().required('This field username is required'),
            loginPassword: yup.string().required('This field password is required'),
        }),
        onSubmit: (values) => {
            console.log(values.loginUsername);
            console.log(values.loginPassword);
        }
    })

    return (
        <div className="form login">
            <h3>Đăng Nhập</h3>
            <label htmlFor="loginUsername">
                <input
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