import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axiosInstance from "../utils/axiosInstance.js";
import { useLocation } from "react-router-dom";
// import Videoload from '../components/loadComponent/Videoload.jsx'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 768px){
    justify-content: center;
  }
  /* height: 100vh;
  overflow-y: scroll; */
`;

const Noticepara = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([1]);
  const path = useLocation().pathname.split("/")[2]

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (type === "playlist") { 
          const res = await axiosInstance.get(`/playlist/get/${path}`)
          if (res && res.data && Array.isArray(res.data)) {
            setVideos(res.data);
          } else {
            setVideos([]);
          }
        } else {
          const res = await axiosInstance.get(`/videos/${type}`);
          if (res && res.data && Array.isArray(res.data)) {
            setVideos(res.data);
          } else {
            setVideos([]);
          }
        }
      } catch (err) {
        if (err.response.data.message === "Token Is Not Valid!!")
          console.log(err);
        setVideos([]);
      }
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.length > 0 ? (
        videos.map((video) => {
          return <Card key={video._id} video={video} />;
        })
      ) : type === "sub" ? (
        <Noticepara>You Haven't Subscribed Yet</Noticepara>
      ) : (
        <Noticepara>No Videos Yet</Noticepara>
      )}
    </Container>
  );
};

export default Home;
