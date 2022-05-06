import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "./authSlice";
import { getUsersStart, getUsersSuccess, getUsersFailed, deleteUserStart, deleteUserSuccess, deleteUserFailed, closeDialogDelete } from "./userSlice";

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

// Get all user
export const getAllUsers = async (accessToken, dispatch, searchInput) => {
    dispatch(getUsersStart());
    try {
        const response = await axios.get(`http://localhost:3001/api/v1/admin/users?name=${searchInput}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(response.data));
    } catch (err) {
        dispatch(getUsersFailed());
    }
}

// Delete user
export const deleteUser = async(accessToken, dispatch, alert, selectedID) => {
    dispatch(deleteUserStart());
    try {
        const res = await axios.delete(`http://localhost:3001/api/v1/admin/users/delete/${selectedID}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        if(res.data.state=='success'){
            alert.success(<p style={{ color: 'green'}}>Delete successfully</p>);
            dispatch(deleteUserSuccess());
        }
        else {
            alert.error(<p style={{ color: 'crimson'}}>Not found user wit id {selectedID}</p>);
            dispatch(deleteUserFailed());
        }
    }
    catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        dispatch(deleteUserFailed());
    }
    finally {
        dispatch(closeDialogDelete());
    }
}