import axios from "axios";
import jwt_decode from 'jwt-decode';
import { store } from '../redux/store';
import { loginFailed, loginStart, loginSuccess, setRole, setId, setName, setImage,
        logOutStart, logOutSuccess, logOutFailed } from "./authSlice";
import { getUsersStart, getUsersSuccess, getUsersFailed, 
        deleteUserStart, deleteUserSuccess, deleteUserFailed, 
        closeDialogDelete } from "./userSlice";
const axiosJWT = axios.create();
// If you use cors in backend, you must withCredentials = true
// if you set { withCredentials = true } can have error
axios.defaults.withCredentials = true; 


// Call in axiosJWT
const refreshTokenAPI = async () => {
    try {
        const res = await axios.post('http://localhost:3001/api/v1/signpage/refresh');
        return res.data;
    }
    catch(err) {
        console.log(err);
    }
}
// Refresh token when accessToken expires
axiosJWT.interceptors.request.use( async config => {
    const user = store.getState().auth.login.currentUser;
    const decodeToken = jwt_decode(user.accessToken);
    let date = new Date();
    if( decodeToken.exp < date.getTime()/1000){
        const data = await refreshTokenAPI();
        const refreshUser = {
            ...user,
            accessToken: data.newAccessToken,
        }
        config.headers["token"] = "Bearer " + data.newAccessToken;
        store.dispatch(loginSuccess(refreshUser));
    }
    return config;        
},
(err) => {
    Promise.reject(err);
}
);

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
            const decodeToken = jwt_decode(res.data.accessToken);
            dispatch(setRole(decodeToken.role));
            dispatch(setId(decodeToken.id));
            dispatch(setName(res.data.name));
            dispatch(setImage(res.data.image));
            if(decodeToken.role == 'Admin') navigate('/admin');
            else if(decodeToken.role == 'Manager') navigate('/manager');
            else if(decodeToken.role == 'Translator') navigate('/translator');
            else if(decodeToken.role == 'Member') navigate('/member');
            else navigate('/');
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
        const response = await axiosJWT.get(`http://localhost:3001/api/v1/admin/users?name=${searchInput}`,
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

// Logout
export const logOutUser = async (dispatch, navigate, accessToken, alert) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post("http://localhost:3001/api/v1/signpage/logout", null, {
            headers: { token: `Bearer ${accessToken}` },
        });
        alert.success(<p style={{ color: 'green'}}>Logout successfully</p>);
        navigate('/signpage');
        dispatch(logOutSuccess());
    }
    catch(err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        dispatch(logOutFailed());
    }
}

// Add Category
export const addCategory = async (name, description, accessToken, alert) => {
    try{
        const res = await axiosJWT.post('http://localhost:3001/api/v1/manager/categorys/add',
        {
            name: name,
            description: description
        },
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        alert.success(<p style={{ color: 'green'}}>Add Category successfully</p>);
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Get all Categorys
export const getAllCategorys = async (searchInput, accessToken, alert) => {
    try {
        const response = await axiosJWT.get(`http://localhost:3001/api/v1/manager/categorys?name=${searchInput}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Get all Id Name of Categorys
export const getAllIdNameCategorys = async (accessToken, alert) => {
    try {
        const response = await axiosJWT.get("http://localhost:3001/api/v1/manager/categorys/idname",
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Get Category by ID
export const getCategoryByID = async (selectedID, accessToken, alert) => {
    try{
        const res = await axiosJWT.get('http://localhost:3001/api/v1/manager/categorys/'+selectedID,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return res.data;
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Edit Category
export const editCategory = async (name, description, selectedID, accessToken, alert) => {
    try{
        const res = await axiosJWT.patch('http://localhost:3001/api/v1/manager/categorys/edit/'+selectedID,
        {
            name: name,
            description: description
        },
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        alert.success(<p style={{ color: 'green'}}>Edit Category successfully</p>);
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Delete Category
export const deleteCategory = async(selectedID, accessToken, alert) => {
    try {
        const res = await axiosJWT.delete(`http://localhost:3001/api/v1/manager/categorys/delete/${selectedID}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        if(res.data.state=='success'){
            alert.success(<p style={{ color: 'green'}}>Delete successfully</p>);
        }
        else {
            alert.error(<p style={{ color: 'crimson'}}>Not found category with id {selectedID}</p>);
        }
    }
    catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Add Author
export const addAuthor= async (formData, accessToken, alert) => {
    try{
        await axiosJWT({
                method: 'post',
                url: 'http://localhost:3001/api/v1/manager/authors/add',
                data: formData,
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    token: `Bearer ${accessToken}`
                },
            });
            alert.success(<p style={{ color: 'green'}}>Add Author successfully</p>);
            return true;
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        return false;
    }
}

// Get all Authors
export const getAllAuthors = async (searchInput, accessToken, alert) => {
    try {
        const response = await axiosJWT.get(`http://localhost:3001/api/v1/manager/authors?name=${searchInput}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Get Author by ID
export const getAuthorByID = async (selectedID, accessToken, alert) => {
    try{
        const res = await axiosJWT.get('http://localhost:3001/api/v1/manager/authors/'+selectedID,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return res.data;
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Edit Author
export const editAuthor = async (selectedID, formData, accessToken, alert) => {
    try{
        await axiosJWT({
            method: 'patch',
            url: 'http://localhost:3001/api/v1/manager/authors/edit/'+selectedID,
            data: formData,
            headers: { 
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${accessToken}`
            },
        });
        alert.success(<p style={{ color: 'green'}}>Edit Author successfully</p>);
        return true;
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Get all Id Name of Author
export const getAllIdNameAuthors = async (accessToken, alert) => {
    try {
        const response = await axiosJWT.get("http://localhost:3001/api/v1/manager/authors/idname",
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Delete Author
export const deleteAuthor = async(selectedID, accessToken, alert) => {
    try {
        const res = await axiosJWT.delete(`http://localhost:3001/api/v1/manager/authors/delete/${selectedID}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        if(res.data.state=='success'){
            alert.success(<p style={{ color: 'green'}}>Delete successfully</p>);
        }
        else {
            alert.error(<p style={{ color: 'crimson'}}>Not found author with id {selectedID}</p>);
        }
    }
    catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Add Story
export const addStory = async (formData, accessToken, alert) => {
    try{
        await axiosJWT({
                method: 'post',
                url: 'http://localhost:3001/api/v1/manager/storys/add',
                data: formData,
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    token: `Bearer ${accessToken}`
                },
            });
            alert.success(<p style={{ color: 'green'}}>Add Category successfully</p>);
            return true;
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
        return false;
    }
}

// Get all Storys
export const getAllStorys = async (searchInput, accessToken, alert) => {
    try {
        const response = await axiosJWT.get(`http://localhost:3001/api/v1/manager/storys?name=${searchInput}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Get Story by ID
export const getStoryByID = async (selectedID, accessToken, alert) => {
    try {
        const response = await axiosJWT.get('http://localhost:3001/api/v1/manager/storys/'+selectedID,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Edit Category
export const editStory = async (selectedID, formData, accessToken, alert) => {
    try{
        await axiosJWT({
            method: 'patch',
            url: 'http://localhost:3001/api/v1/manager/storys/edit/'+selectedID,
            data: formData,
            headers: { 
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${accessToken}`
            },
        });
        alert.success(<p style={{ color: 'green'}}>Edit Story successfully</p>);
        return true;
    }catch (err){
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}

// Delete Story
export const deleteStory = async(selectedID, accessToken, alert) => {
    try {
        const res = await axiosJWT.delete(`http://localhost:3001/api/v1/manager/storys/delete/${selectedID}`,
        {
            headers: { token: `Bearer ${accessToken}` },
        });
        if(res.data.state=='success'){
            alert.success(<p style={{ color: 'green'}}>Delete successfully</p>);
        }
        else {
            alert.error(<p style={{ color: 'crimson'}}>Not found story with id {selectedID}</p>);
        }
    }
    catch (err) {
        alert.error(<p style={{ color: 'crimson'}}>Have some error...</p>);
    }
}