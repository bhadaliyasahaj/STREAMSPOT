import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axiosInstance from "../utils/axiosInstance.js";
import nProgress from 'nprogress'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Noticepara = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const Category = ({ category }) => {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      nProgress.start()
      try {
        if (category === "history") {
          const res = await axiosInstance.get(`/videos/history`);
          if (res && res.data && Array.isArray(res.data)) {
            setVideos(res.data);
          } else {
            setVideos([]);
          }
        } else {
          const res = await axiosInstance.get(`/videos/category/${category}`);
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
      finally {
        nProgress.done()
      }
    };
    fetchVideos();
  }, [category]);

  return (
    <Container>
      {videos && (videos.length > 0 ? (
        videos.map((video) => {
          return <Card key={video._id} video={video} />;
        })
      ) : (
        <Noticepara>
          No {category.split("")[0].toUpperCase() + category.slice(1)} Videos
          Yet
        </Noticepara>
      ))}
    </Container>
  );
};

export default Category;
