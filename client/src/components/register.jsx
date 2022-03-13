import { useState } from 'react';
import Axios from 'axios';
import './index.css';

function Register() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const register = () => {
        Axios.post("http://localhost:3001/register", {
            username: usernameReg,
            password: passwordReg,
        }).then((response) => {
            console.log(response);
        });
    };

    return (
        <div id="form-register">
            <h3>Đăng kí</h3>
            <lable htmlFor="register-username">Username</lable>
            <input 
                type="text" 
                id="register-username" 
                name="register-username" 
                placeholder="Vui lòng nhập Username..."
                onChange={(e) => setUsernameReg(e.target.value)}
            />
            <label htmlFor="register-password">Password</label>
            <input 
                type="text" 
                id="register-password" 
                name="register-password" 
                placeholder="Vui lòng nhập Password..."
                onChange={(e) => setPasswordReg(e.target.value)}
            />
            <button onClick={register} id="register-submit">Đăng kí</button>
        </div>
    )
}

export default Register;