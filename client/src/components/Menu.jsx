import React from "react";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import MyvideoIcon from "@mui/icons-material/VideocamOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link, useLocation } from "react-router-dom";
import StreamSpot from "../img/StreamSpotLogo.png";
import { useSelector } from "react-redux";

const Container = styled.div`
  /* flex: 1; */
  width: 15vw;
  background-color: ${({ theme }) => theme.bgLighter};
  /* height: 100%; */
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  /* overflow-y: hidden; */
  /* flex: 0.6; */
  @media (max-width: 786px), (max-width: 825px) {
    min-width: 10%;
    max-width: 10%;
    height: 100vh;
    /* overflow: hidden; */
    /* position: fixed; */
    z-index: 500;
  }
`;
const Wrapper = styled.div`
  padding: 0px 26px 15px 26px;
  @media (max-width: 786px), (max-width: 825px) {
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const Item = styled.div`
  /* width: min-content; */
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 7.5px;
  background-color: ${({ theme, active }) =>
    active ? theme.soft : "transparent"};
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
  @media (max-width: 786px), (max-width: 825px) {
    /* width: 100px; */
    border-radius: 20px;
    gap: 0;
    padding: 5px 7px;
  }
`;

const Text = styled.span`
  @media (max-width: 786px), (max-width: 825px) {
    display: none;
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
  @media (max-width: 768px) {
    margin: 10px 0px;
    width: 80%;
  }
`;

const Login = styled.div`
  @media (max-width: 786px), (max-width: 825px) {
    display: none;
  }
`;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
  @media (max-width: 786px), (max-width: 825px) {
    display: none;
  }
`;

const Logo = styled.div`
  /* width: min-content; */
  position: sticky;
  top: 0;
  left: 0;
  height: 40px;
  padding-top: 14px;
  background-color: ${({ theme }) => theme.bgLighter};
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
  /* border: 2px solid red; */
  @media (max-width: 768px), (max-width: 825px) {
    margin-bottom: 6px;
    padding-top: 9px;
    /* height: ; */
  }
`;

const Img = styled.img`
  height: 25px;
`;


const Menu = ({ darkMode, setDarkMode }) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  return (
    <Container>
      <Wrapper>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Logo>
            <Img src={StreamSpot} style={{minWidth:"30px",minHeight:"30px"}}/>
            <Text style={{fontSize:"17px"}}>StreamSpot</Text>
          </Logo>
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/"}>
            <HomeIcon />
            <Text>Home</Text>
          </Item>
        </Link>
        <Link to="trends" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/trends"}>
            <ExploreOutlinedIcon />
            <Text>Explore</Text>
          </Item>
        </Link>
        <Link
          to="subscriptions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item active={location.pathname === "/subscriptions"}>
            <SubscriptionsOutlinedIcon />
            <Text>Subscriptions</Text>
          </Item>
        </Link>
        <Hr />
        <Link to="playlist" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname.split("/")[1] === "playlist"}>
            <VideoLibraryOutlinedIcon />
            <Text>Playlists</Text>
          </Item>
        </Link>
        <Link to="history" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/history"}>
            <HistoryOutlinedIcon />
            <Text>History</Text>
          </Item>
        </Link>
        <Hr />
        {!currentUser && (
          <>
            <Login>
              Sign in to like videos, comment, and subscribe.
              <Link to="signin" style={{ textDecoration: "none" }}>
                <Button>
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </Button>
              </Link>
              <Hr />
            </Login>
          </>
        )}
        <Title>BEST OF STREAMSPOT</Title>
        <Link to="/music" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/music"}>
            <LibraryMusicOutlinedIcon />
            <Text>Music</Text>
          </Item>
        </Link>
        <Link to="/sports" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/sports"}>
            <SportsBasketballOutlinedIcon />
            <Text>Sports</Text>
          </Item>
        </Link>
        <Link to="/gaming" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/gaming"}>
            <SportsEsportsOutlinedIcon />
            <Text>Gaming</Text>
          </Item>
        </Link>
        <Link to="/movies" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/movies"}>
            <MovieOutlinedIcon />
            <Text>Movies</Text>
          </Item>
        </Link>
        <Link to="/news" style={{ textDecoration: "none", color: "inherit" }}>
          <Item active={location.pathname === "/news"}>
            <ArticleOutlinedIcon />
            <Text>News</Text>
          </Item>
        </Link>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to="myvideos"
        >
          <Item active={location.pathname === "/myvideos"}>
            <MyvideoIcon />
            <Text>My Videos</Text>
          </Item>
        </Link>
        <Hr />
        <Item>
          <SettingsOutlinedIcon />
          <Text>Settings</Text>
        </Item>
        <Item>
          <FlagOutlinedIcon />
          <Text>Report</Text>
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          <Text>Help</Text>
        </Item>
        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          <Text>{darkMode ? "Light" : "Dark"} Mode</Text>
        </Item>
      </Wrapper>
    </Container>
  );
};

export default Menu;
