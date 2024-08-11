import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

function Search() {
  const [videos, setVideos] = useState([]);
  const [qavail, setQAvail] = useState(true);
  const query = useLocation().search;
  const navigator = useNavigate();
  const API_URL = process.env.REACT_APP_API_URI;

  useEffect(() => {
    if (query === "?q=") {
      setQAvail(false);
    } else {
      const fetchVideos = async () => {
        const res = await axios.get(`${API_URL}/videos/search${query}`,{withCredentials:true});
        setVideos(res.data);
        setQAvail(true);
      };
      fetchVideos();
    }
  }, [query]);

  return (
    <>
      {" "}
      {qavail ? (
        <Container>
          {videos.map((video) => (
            <Card key={video._id} video={video} />
          ))}
        </Container>
      ) : (
        navigator("/")
      )}
    </>
  );
}

export default Search;
