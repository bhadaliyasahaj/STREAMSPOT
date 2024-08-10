import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
// import Videoload from '../components/loadComponent/Videoload.jsx'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const Noticepara = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      await axios.get(`/videos/${type}`).then((res) => {
        if (!res) return <h1>Data Not Exist</h1>;
        setVideos(res.data);
        console.log(videos);
      }).catch((err)=>{
        console.log(err);
        setVideos([])
      })
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.length > 0 ? (
        // videos.map((video) => {
        //   return <Card key={video._id} video={video} />;
        // })
        console.log(videos.length)
      ) : type === "sub" ? (
        <Noticepara>You Haven't Subscribed Yet</Noticepara>
      ) : (
        <Noticepara>No Videos Yet</Noticepara>
      )}
    </Container>
  );
};

export default Home;
