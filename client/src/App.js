import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { Routes, Route,HashRouter } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Profile from "./components/Profile";
import UploadPage from "./components/Upload";
import Category from "./pages/Category";
import axiosInstance from "./utils/axiosInstance";
import Playlist from './components/Playlists'
import './nprogress.css'
import Notification from "./components/Notification";
import { useDispatch } from "react-redux";
import { setmessage } from "./redux/notificationSlice";
// import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Main = styled.div`
  /* flex: 7; */
  width: 100%;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 22px 40px;
  @media (max-width: 768px) {
    padding: 20px 0px;
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axiosInstance.get("/users/verify");
      } catch (error) {
        // console.log(error);
      }
    };
    verifyUser();
  }, []);
  const dispatch = useDispatch()
  // dispatch(setmessage("It is Working"))

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <HashRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="music" element={<Category category="music" />} />
                  <Route path="playlist" >
                    <Route index element={<Playlist />} />
                    <Route path=":id" element={<Home type="playlist"/>} />
                  </Route>
                  <Route
                    path="sports"
                    element={<Category category="sports" />}
                  />
                  <Route
                    path="gaming"
                    element={<Category category="gaming" />}
                  />
                  <Route
                    path="movies"
                    element={<Category category="movies" />}
                  />
                  <Route path="news" element={<Category category="news" />} />
                  <Route
                    path="history"
                    element={<Category category="history" />}
                  />
                  <Route path="search" element={<Search />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="upload" element={<UploadPage />} />
                  <Route path="myvideos" element={<Home type="myvideos" />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </HashRouter>
        <Notification/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
