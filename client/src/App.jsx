import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignPage from './pages/SignPage/SignPage';

// Role Admin
import AdminLayout from "./layouts/admin/AdminLayout";
import HomeAdmin from "./pages/admin/HomeAdmin/HomeAdmin";
import User from "./pages/admin/User/User";

// Role Manager
import ManagerLayout from "./layouts/manager/ManagerLayout";
import HomeManager from "./pages/manager/HomeManager/HomeManager";
import Author from "./pages/manager/Author/Author";
import Category from "./pages/manager/Category/Category";
import Story from "./pages/manager/Story/Story";
import Comment from "./pages/manager/Comment/Comment";

// Role Translator
import TranslatorLayout from "./layouts/translator/TranslatorLayout";
import HomeTranslator from "./pages/translator/HomeTranslator/HomeTranslator";
import Chapter from "./pages/translator/Chapter/Chapter";
import Content from "./pages/translator/Content/Content";
import Translation from "./pages/translator/Translation/Translation";

// Role Member

// Role Guest
import HomeGuest from "./pages/guest/HomeGuest/HomeGuest";

import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
              <Route index element={<HomeGuest />}></Route>
              <Route path="signpage" element={<SignPage />}></Route>
          </Route>
          
          {/* Role Admin */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<HomeAdmin />} ></Route>
            <Route path="user">
              <Route index element={<User />}></Route>
              <Route path=":userID" ></Route>
            </Route>
            <Route path="comment">
              <Route index element={<Comment />}></Route>
              <Route path=":commentID" ></Route>
            </Route>
          </Route>

          {/* Role Manager */}
          <Route path="manager" element={<ManagerLayout />}>
            <Route index element={<HomeManager />}></Route>
            <Route path="author">
              <Route index element={<Author />}></Route>
              <Route path=":authorID"></Route>
            </Route>
            <Route path="category">
              <Route index element={<Category />}></Route>
              <Route path=":categoryID"></Route>
            </Route>
            <Route path="story">
              <Route index element={<Story />}></Route>
              <Route path=":storyID"></Route>
            </Route>
            <Route path="comment">
              <Route index element={<Comment />}></Route>
              <Route path=":commentID"></Route>
            </Route>
          </Route>

          {/* Role Translator */}
          <Route path="translator" element={<TranslatorLayout />}>
            <Route index element={<HomeTranslator />}></Route>
            <Route path="chapter">
              <Route index element={<Chapter />}></Route>
              <Route path=":chapterID"></Route>
            </Route>
            <Route path="content">
              <Route index element={<Content />}></Route>
              <Route path=":contentID"></Route>
            </Route>
            <Route path="translation">
              <Route index element={<Translation />}></Route>
              <Route path=":TranslationID"></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
