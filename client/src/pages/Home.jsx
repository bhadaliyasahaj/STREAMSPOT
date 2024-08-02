import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from 'axios'
import Videoload from '../components/loadComponent/Videoload.jsx'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type}) => {
  const [videos,setVideos] = useState([])

  useEffect(()=>{
    const fetchVideos = async ()=>{
      await axios.get(`/videos/${type}`).then((res)=>{
        if(!res) return <h1>Data Not Exist</h1>
        setVideos(res.data)
      })
    }
    fetchVideos()
  },[type])

  return (
    <Container>
     {      videos.map((video)=>{
        return(<Card key={video._id} video={video} />)
      }) 
     }
    </Container>
  );
};

export default Home;
