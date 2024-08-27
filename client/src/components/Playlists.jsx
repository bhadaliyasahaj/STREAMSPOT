import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import Homeload from "./loadComponent/Homeload";
import axiosInstance from "../utils/axiosInstance.js";
import PlaylistPlay from "@mui/icons-material/PlaylistPlay.js";
import Playlistload from "./loadComponent/Playlistload.jsx";

const Container = styled.div`
  width: 300px;
  /* margin-bottom: 45px; */
  cursor: pointer;
  /* display: ${(props) => props.type === "sm" && "flex"}; */
  gap: 10px;

  @media (max-width: 768px) {
    width: 300px;
  }
`;

const Image = styled.img`
  width: 240px;
  height: 160px;
  border-radius: 20px;
  background-color: #999;
  flex: 1;
  opacity: 0.8;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "5px"};
  gap: 12px;
  flex: 1;
`;


const Texts = styled.div`
  /* border:2px solid black; */
  padding: 0 15px;
`;

const ImageContainer = styled.div`
  width: 240px;
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


const PlaylistsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  /* width: 100%; */
`;

const Noticepara = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const Playlist = () => {
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [image, setImage] = useState([]);

  useEffect(() => {
    const getPlaylists = async () => {
      setLoading(true)
      try {
        const playlist = await axiosInstance.get("/playlist/get");
        setPlaylists(playlist.data.playlists);
        setImage(playlist.data.images)
        console.log(playlist.data);

        setLoading(false)
      } catch (err) {
        console.log(err);
        setLoading(false)
      }
    };
    getPlaylists();
  }, []);

  return (
    <>
      <PlaylistsContainer>
        {playlists.map((item, index) => (
          loading ? (<Playlistload />) : (playlists.length > 0 ? (
            <Link to={`/playlist/${item._id}`} style={{ textDecoration: "none" }} key={item._id}>
              <Container>
                <ImageContainer>
                  <PlaylistPlay style={{ position: "absolute", fontSize: "50px", color: "white" }} />
                  <Image src={image[index]} />
                </ImageContainer>
                <Details>
                  <Texts>
                    <Title>{item.name.toUpperCase()}</Title>
                  </Texts>
                </Details>
              </Container>
            </Link>) : (<Noticepara>No Playlist Found</Noticepara>))
        ))}
      </PlaylistsContainer>
    </>
  );
};

export default Playlist;
