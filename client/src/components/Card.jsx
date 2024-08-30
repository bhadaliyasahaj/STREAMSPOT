import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import Homeload from "./loadComponent/Homeload";
import axiosInstance from "../utils/axiosInstance.js";
import More from "@mui/icons-material/MoreVert.js";
import Playlistpopup from "./Playlistpopup.jsx";
import Notification from "./Notification.jsx";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "300px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
  position: relative;
  @media (max-width: 768px) {
    width: 300px;
  }
`;

const Image = styled.img`
  width: ${(props) => (props.type !== "sm" ? "100%" : "100px")};
  height: ${(props) => (props.type === "sm" ? "120px" : "200px")};
  background-color: #999;
  border-radius: 20px;
  flex: 1;
`;

const Details = styled.div`
  width: ${(props) => props.type === "sm" ? "100%":"90%"};
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "5px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 5px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const MoreContainer = styled.div`
display: ${(props)=>props.type!=="sm"?"flex":"none"};
position: absolute;
right: 0;
justify-content: center;
flex-direction: column;
align-items: center;
  .more-icon {
    /* position: absolute; */
    color: white;
    /* bottom: 40px; */
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    border-radius: 50%;
    padding: 5px;

    &:hover {
      background-color: #555;
    }
  }

  .delete-option {
    display: ${(props) => (props.enremove ? "block" : "none")};
    position: absolute;
    top: 100%; 
    background-color: #333;
    color: white;
    padding: 7px 3px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #555;
    }
  }
`;

const List = styled.li`
      display: ${(props) => (props.enable ? "block" : "none")};
      list-style: none;
      border-bottom: 1px solid;
      padding: 3px 10px;
      border-radius: 1.5px;
`

const Card = ({ type, video, removed, onRemove }) => {
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(true);
  const [enremove, setEnremove] = useState(false);
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [resp, setResp] = useState("");
  const [save, setSave] = useState(false);



  useEffect(() => {
    const fetchChannel = async () => {
      console.log(video.userId);
      try {
        const res = await axiosInstance.get(`/users/find/${video.userId}`);
        setChannel(res.data);
        console.log(res.data);
        setLoading(false);
        setTitle(vidtitle(video.title));
      } catch (err) {
        setLoading(false);
        // console.log(err);
      }
    };
    if (video) {
      fetchChannel();
    } else {
      setLoading(false);
    }
  }, [video]);

  const vidtitle = (str) => {
    if (type !== "sm") {
      if (str.length <= 80) {
        return str;
      }
      return str.slice(0, 80) + "...";
    } else {
      if (str.length <= 50) {
        return str;
      }
      return str.slice(0, 50) + "...";
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const playlistid = location.pathname.split("/")[2];
      await axiosInstance.put("/playlist/remove", {
        vidid: id,
        plid: playlistid,
      });
      onRemove(id);
    } catch (err) {
      console.log(err);
    }
  };

  const isPlaylistPage = location.pathname.split("/")[1] === "playlist";


  const handleMore = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setEnremove(!enremove);
    console.log(isPlaylistPage);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSave(true)
  }

  return (
    <>
      {loading ? (
        <Homeload type={type} />
      ) : !removed ? (
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
          <Container type={type}>
            <Image type={type} src={video.imgUrl} />
            <MoreContainer enremove={enremove} type={type}>
              <More className="more-icon" onClick={handleMore} />
              <Info className="delete-option">
                <List enable={!isPlaylistPage} onClick={handleSave}>Save</List>
                <List enable={isPlaylistPage} onClick={(e) => handleDelete(e, video._id)} >UnSave</List>
              </Info>
            </MoreContainer>
            <Details type={type}>
              {type !== "sm" &&
                (channel.img ? (
                  <ChannelImage type={type} src={channel.img} />
                ) : (
                  <PersonIcon
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      color: "gray",
                      border: "1px solid gray",
                      padding: "3px",
                    }}
                  />
                ))}
              <Texts>
                <Title>{title}</Title>
                <ChannelName>{channel.name}</ChannelName>
                <Info>
                  {video.views} views • {format(video.createdAt)}
                </Info>
              </Texts>
            </Details>
          </Container>
        </Link>
      ) : (
        <Container>
          <Image />
          <MoreContainer enremove={enremove}>
            <More className="more-icon" onClick={handleMore} style={{bottom:"10px"}}/>
            <Info className="delete-option">
              <List enable={!isPlaylistPage} onClick={handleSave}>Save</List>
              <List enable={isPlaylistPage} onClick={(e) => handleDelete(e, video.id)} >UnSave</List>
            </Info>
          </MoreContainer>
          <Details style={{ justifyContent: "space-evenly" }}>
            <Texts>
              <Title>Removed By Owner</Title>
            </Texts>
          </Details>
        </Container>
      )}
      {save && (<Playlistpopup setSave={setSave} setResp={setResp} setVisible={setVisible} vidId={video._id} />)}
      {resp && <Notification message={resp} visible={visible} setVisible={setVisible}/>}
    </>
  );
};

export default Card;
