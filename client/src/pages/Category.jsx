import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
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

const Category = ({ category }) => {
  const [videos, setVideos] = useState([]);
  const API_URL = process.env.REACT_APP_API_URI;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (category === "history") {
          const res = await axios.get(`${API_URL}/videos/history`, {
            withCredentials: true,
          });
          if (res && res.data && Array.isArray(res.data)) {
            setVideos(res.data);
          } else {
            setVideos([]);
          }
        } else {
          const res = await axios.get(
            `${API_URL}/videos/category/${category}`,
            { withCredentials: true }
          );
          if (res && res.data && Array.isArray(res.data)) {
            setVideos(res.data);
          } else {
            setVideos([]);
          }
        }
      } catch (err) {
        console.log(err);
        setVideos([]);
      }
    };
    fetchVideos();
  }, [category]);

  return (
    <Container>
      {videos.length > 0 ? (
        videos.map((video) => {
          return <Card key={video._id} video={video} />;
        })
      ) : (
        <Noticepara>
          No {category.split("")[0].toUpperCase() + category.slice(1)} Videos
          Yet
        </Noticepara>
      )}
    </Container>
  );
};

export default Category;
