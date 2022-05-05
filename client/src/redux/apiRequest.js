import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "./authSlice";

// Login api
export const loginUser = async(user, dispatch, navigate, formik, alert) => {
    dispatch(loginStart());
    await axios.post('http://localhost:3001/api/v1/signpage/signin/auth', user)
    .then((res) => {
        if(res.data.state=="not_found"){
            alert.error(<p style={{ color: 'crimson'}}>Incorrect username or password</p>);
            dispatch(loginFailed());
        }
        else {
            alert.success(<p style={{ color: 'green'}}>Login successfully</p>);
            dispatch(loginSuccess(res.data));
            navigate('/admin');
        }
    })
    .catch(() => {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        dispatch(loginFailed());
    })
    .finally(() => {
        formik.resetForm();
    })
}

// Register api
export const registerUser = async(user, dispatch, navigate, setWaitSubmit, formik, alert) => {

}