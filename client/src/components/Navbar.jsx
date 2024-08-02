import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOff";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Upload from './Upload'
import axios from "axios";
import { loginSuccess } from "../redux/userSlice";
// import { Avatar } from "@mui/material";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 10;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display:flex;
  align-items: center;
  gap:10px;
  font-weight:500;
  color: ${({ theme }) => theme.text};
`

const Avatar = styled.img`
  width:32px;
  height:32px;
  border-radius:50%;
  background-color:#999;
  cursor: pointer;
`
const Name = styled.text`
  width:32px;
  cursor: pointer;
`

const Dropdown = styled.div`
  position: absolute;
  top: 55px;
  right: 5px;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Navbar = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAvatarClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    // Implement logout logic here
    await axios.post(`/users/logout/${currentUser._id}`).then((res)=>{
      console.log(res.data);
      dispatch(loginSuccess(null));
    })
    setDropdownOpen(false);
    navigate("/")
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input placeholder="Search" onChange={(e) => setQ(e.target.value)} />
            <SearchOutlinedIcon onClick={() => { navigate(`/search/?q=${q}`) }} />
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon onClick={() => setOpen(true)} style={{ cursor: "pointer", fontSize: "35px" }} />
              <Avatar onClick={handleAvatarClick} for="dropdown"/>
              {dropdownOpen && (
              <Dropdown>
                <DropdownItem onClick={() => navigate('/profile')}>Profile</DropdownItem>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </Dropdown>
            )}
              <Name onClick={handleAvatarClick}>{currentUser.name}</Name>
            </User>
          ) : <Link to="signin" style={{ textDecoration: "none" }}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>
          }
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
