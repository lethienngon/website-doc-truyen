import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './index.scss'

function SignPage(){

    const [changeForm, setChangeForm] = useState("signpage");

    return (
        <div className="box-sign">
            <div className={changeForm} >

                <Login />

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

                    <Register />
                </div>
            </div>
        </div>
    );
};

export default SignPage;