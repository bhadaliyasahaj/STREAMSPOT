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
  @media (max-width: 768px) {
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
  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (type === "playlist") {
          const res = await axiosInstance.get(`/playlist/get/${path}`);

          if (res && res.data && Array.isArray(res.data)) {
            console.log(res.data);
            setVideos(res.data);
          } else {
            setVideos([]);
          }
        } else {
          const res = await axiosInstance.get(`/videos/${type}`);
          console.log(res.data);

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

  const removeVideo = (id) => {
    console.log("running");
    console.log(id);
    
    setVideos((prev) => {
      const update = prev.filter((video) =>  video.id !== id && video._id !== id);
      console.log(update);
      return update
    });
  };

  return (
    <Container>
      {videos.length > 0 ? (
        videos.map((video) => (
          <Card
            key={video._id || video.id}
            video={video}
            removed={video.id}
            onRemove={removeVideo}
            type={type}
          />
        ))
      ) : type === "sub" ? (
        <Noticepara>You Haven't Subscribed Yet</Noticepara>
      ) : (
        <Noticepara>No Videos Yet</Noticepara>
      )}
    </Container>
  );
};

export default Home;
