import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
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
  const [videos, setVideos] = useState([]);
  const API_URL = process.env.REACT_APP_API_URI;
  console.log(API_URL);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_URL}/videos/${type}`,{withCredentials:true});
        if (res && res.data && Array.isArray(res.data)) {
          setVideos(res.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
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
