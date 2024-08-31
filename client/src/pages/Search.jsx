import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import axiosInstance from "../utils/axiosInstance.js";
import nProgress from "nprogress";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Noticepara = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

function Search() {
  const [videos, setVideos] = useState(null);
  const [qavail, setQAvail] = useState(true);
  const query = useLocation().search;
  const navigator = useNavigate();

  useEffect(() => {
    nProgress.start();
    try {
      if (query === "?q=") {
        setQAvail(false);
      } else {
        const fetchVideos = async () => {
          const res = await axiosInstance.get(`/videos/search${query}`);
          console.log(res.data);

          setVideos(res.data);
          setQAvail(true);
        };
        fetchVideos();
      }
    } catch (error) {
      console.log(error);
      setVideos([]);
    } finally {
      nProgress.done();
    }
  }, [query]);

  return (
    <>
      {qavail ? (
        <Container>
          {videos &&
            (videos.length > 0 ? (
              videos.map((video) => <Card key={video._id} video={video} />)
            ) : (
              <Noticepara>No Search Result Found</Noticepara>
            ))}
        </Container>
      ) : (
        navigator("/")
      )}
    </>
  );
}

export default Search;
