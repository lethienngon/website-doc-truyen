import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from './components/login.jsx';
// import Register from './components/register.jsx';
import Home from "./pages/HomePage/Home";
import AdminLayout from "./layouts/admin/AdminLayout";
import { List, Login, New, Single } from "./pages/admin/index";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
              <Route index element={<Home />}></Route>
          </Route>
          <Route path="admin">
            <Route index element={<AdminLayout />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="users">
              <Route index element={<List />}></Route>
              <Route path=":userID" element={<Single />}></Route>
              <Route path="new" element={<New />}></Route>
            </Route>
            <Route path="products">
              <Route index element={<List />}></Route>
              <Route path=":productID" element={<Single />}></Route>
              <Route path="new" element={<New />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
