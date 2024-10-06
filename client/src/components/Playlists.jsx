import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import Homeload from "./loadComponent/Homeload";
import axiosInstance from "../utils/axiosInstance.js";
import PlaylistPlay from "@mui/icons-material/PlaylistPlay.js";
import Playlistload from "./loadComponent/Playlistload.jsx";
import More from "@mui/icons-material/MoreVert.js";
import nProgress from "nprogress";

const Container = styled.div`
  width: 240px;
  /* margin-bottom: 45px; */
  cursor: pointer;
  /* display: ${(props) => props.type === "sm" && "flex"}; */
  position: relative;
  /* border: 2px solid black; */

  @media (max-width: 768px) {
    width: 270px;
    gap:20px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 160px;
  border-radius: 20px;
  background-color: #999;
  flex: 1;
  opacity: 0.8;
  @media (max-width: 768px) {
    height: 180px;
  }
`;

const Details = styled.div`
  margin-top: 10px;
`;


const Texts = styled.div`
display: flex;
flex-direction: column;
gap: 5px;
  /* border:2px solid black; */
  padding: 0 15px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 20px;
  overflow: hidden;
  background-color: black;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color:${({ theme }) => theme.soft};
  /* opacity: 0.8; */
  :hover img{
    background-color: black;
    opacity: 0.5;
  }
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;


const PlaylistsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap:20px;
  }
  /* width: 100%; */
`;

const Noticepara = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const MoreContainer = styled.div`
position: absolute;
z-index: 10;
right: 0;
display: flex;
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
      /* display: ${(props) => (props.enable ? "block" : "none")}; */
      list-style: none;
      border-bottom: 1px solid;
      padding: 3px 10px;
      border-radius: 1.5px;
`

const Playlist = () => {
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState(null);
  const [image, setImage] = useState([]);
  const [activelist, setActivelist] = useState("");


  useEffect(() => {
    nProgress.start()
    const getPlaylists = async () => {
      setLoading(true)
      try {
        const playlist = await axiosInstance.get("/playlist/get");
        setPlaylists(playlist.data.playlists);
        setImage(playlist.data.images)
        // console.log(playlist.data);

        setLoading(false)
      } catch (err) {
        console.log(err);
        setLoading(false)
      }
      finally {
        nProgress.done()
      }
    };
    getPlaylists();
  }, []);

  const handleRemove = async (e, id,index) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(index);
    try {
      const res = await axiosInstance.delete(`/playlist/deletelist/${id}`)
      console.log(res.data);
      setPlaylists((prev) => prev.filter((list) => list._id !== id))      
      setImage((prev)=>prev.splice(index,1));
    } catch (error) {
      console.log(error);
    }
  };



  const handleMore = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setActivelist((prev) => prev === id ? null : id)
    // console.log(isPlaylistPage);
  };


  return (
    <>
      <PlaylistsContainer>
        {playlists && (playlists.length > 0 ? (playlists.map((item, index) => (
          loading ? (<Playlistload />) : (
            <Link to={`/playlist/${item._id}`} style={{ textDecoration: "none" }} key={item._id}>
              <Container>
                <ImageContainer>
                  <PlaylistPlay style={{ position: "absolute", fontSize: "50px", color: "white" }} />
                  <Image src={image[index]} />
                </ImageContainer>
                <MoreContainer enremove={activelist === item._id}>
                  <More className="more-icon" onClick={(e) => handleMore(e, item._id)} style={{ bottom: "10px" }} />
                  <div className="delete-option">
                    <List onClick={(e) => handleRemove(e, item._id,index)}>Remove</List>
                  </div>
                </MoreContainer>
                <Details>
                  <Texts>
                    <Title>{item.name.toUpperCase()}</Title>
                    <Info>
                      Updated {format(item.updatedAt)}
                    </Info>
                    <Info>
                      {item.type}
                    </Info>
                  </Texts>
                </Details>
              </Container>
            </Link>)
        ))) : (<Noticepara>No Playlist Found</Noticepara>))}
      </PlaylistsContainer>
    </>
  );
};

export default Playlist;
