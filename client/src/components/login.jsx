import { useState } from 'react';
import Axios from 'axios';
import './index.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        Axios.post("http://localhost:3001/login", {
            username: username,
            password: password,
        }).then((response) => {
            console.log(response);
        });
    };
     return (
        <div id="form-login">
            <h3>Đăng Nhập</h3>
            <lable htmlFor="login-username">Username</lable>
            <input
                type="text" 
                id="login-username" 
                name="login-username" 
                placeholder="Vui lòng nhập Username..."
                onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="login-password">Password</label>
            <input 
                type="text" 
                id="login-password" 
                name="login-password" 
                placeholder="Vui lòng nhập Password..."
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login} id="login-submit">Đăng nhập</button>
        </div>
    )
}

export default Login;