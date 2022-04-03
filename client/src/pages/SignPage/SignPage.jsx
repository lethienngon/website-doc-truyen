import { useState } from 'react';
import Axios from 'axios';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import './index.scss'

function SignPage(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [rePasswordReg, setRePasswordReg] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [nameReg, setNameReg] = useState("");

    const [changeForm, setChangeForm] = useState("signpage");

    const login = () => {
        Axios.post("http://localhost:3001/login", {
            username: username,
            password: password,
        }).then((response) => {
            console.log(response);
        });
    };

    const register = () => {
        Axios.post("http://localhost:3001/register", {
            username: usernameReg,
            password: passwordReg,
            email: emailReg,
        }).then((response) => {
            console.log(response);
        });
    };

    return (
        <div className="box-sign">
            <div className={changeForm} >
                <div className="form login">
                    <h3>Đăng Nhập</h3>
                    <label htmlFor="login-username">
                        <span>Username</span>
                        <input
                            type="text" 
                            id="login-username" 
                            name="login-username" 
                            placeholder="Vui lòng nhập Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label htmlFor="login-password">
                        <span>Password</span>
                        <input 
                            type="text" 
                            id="login-password" 
                            name="login-password" 
                            placeholder="Vui lòng nhập Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button onClick={login} className="submit">Đăng nhập</button>
                    <p className="forgot-password">Quên mật khẩu?</p>
                    <div className="social-media">
                        <FacebookIcon className="icon"/>
                        <GoogleIcon className="icon"/>
                    </div>
                </div>


                <div className="sub-signpage">
                    <div className="img">
                        <div className="img-text m-up">
                            <h2>Bạn chưa có tài khoản?</h2>
                            <p>Hãy tạo tài khoản để trải nghiệm nhiều tính năng</p>
                        </div>
                        <div className="img-text m-in">
                            <h2>Cám ơn bạn</h2>
                            <p>Chúc bạn có một ngày tốt lành</p>
                        </div>
                        <div className="img-btn">
                            <span className="m-up" onClick={(e) => setChangeForm("signpage s-register")}>Đăng kí</span>
                            <span className="m-in" onClick={(e) => setChangeForm("signpage")}>Đăng nhập</span>
                        </div>
                    </div>

                    <div className="form register">
                    <h3>Đăng kí</h3>
                    <label htmlFor="register-username">
                        <span>Username</span>
                        <input 
                            type="text" 
                            id="register-username" 
                            name="register-username" 
                            placeholder="Vui lòng nhập Username"
                            onChange={(e) => setUsernameReg(e.target.value)}
                    />
                    </label>
                    <label htmlFor="register-password">
                        <span>Password</span>
                        <input 
                            type="text" 
                            id="register-password" 
                            name="register-password" 
                            placeholder="Vui lòng nhập Password"
                            onChange={(e) => setPasswordReg(e.target.value)}
                    />
                    </label>
                    <label htmlFor="register-re-password">
                        <span>Confirm Password</span>
                        <input 
                            type="text" 
                            id="register-re-password" 
                            name="register-re-password" 
                            placeholder="Xác nhận lại mật khẩu"
                            onChange={(e) => setRePasswordReg(e.target.value)}
                    />
                    </label>
                    <label htmlFor="register-name">
                        <span>Name</span>
                        <input 
                            type="text" 
                            id="register-name" 
                            name="register-name" 
                            placeholder="Vui lòng nhập tên"
                            onChange={(e) => setNameReg(e.target.value)}
                    />
                    </label>
                    <label htmlFor="register-email">
                        <span>Email</span>
                        <input 
                            type="text" 
                            id="register-email" 
                            name="register-email" 
                            placeholder="Vui lòng nhập Email"
                            onChange={(e) => setEmailReg(e.target.value)}
                    />
                    </label>
                    <button onClick={register} className="submit">Đăng kí</button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default SignPage;