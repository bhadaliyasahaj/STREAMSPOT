import axios from "axios";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import Homeload from "./loadComponent/Homeload";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "300px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: ${(props) => props.type !== "sm" ? "100%":"100px"};
  height: ${(props) => (props.type === "sm" ? "120px" : "200px")};
  background-color: #999;
  border-radius: 20px;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "5px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(true);
  const API_URL = process.env.REACT_APP_API_URI;
  console.log(API_URL);
  
  useEffect(() => {
    const fetchChannel = async () => {
      await axios.get(`${API_URL}/users/find/${video.userId}`).then((res) => {
        setChannel(res.data);
        setLoading(false);
        setTitle(vidtitle(video.title));
      });
    };
    fetchChannel();
  }, [video.userId]);

  const vidtitle = (str) => {
    if (type !== "sm") {
      if (str.length <= 80) {
        return str;
      }
      return str.slice(0, 80) + "...";
    } else {
      if (str.length <= 50) {
        return str;
      }
      return str.slice(0, 50) + "...";
    }
  };

  return (
    <>
      {" "}
      {loading ? (
        <Homeload type={type}/>
      ) : (
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
          <Container type={type}>
            <Image type={type} src={video.imgUrl} />
            <Details type={type}>
              {type !== "sm" &&
                (channel.img ? (
                  <ChannelImage type={type} src={channel.img} />
                ) : (
                  <PersonIcon
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      color: "gray",
                      border: "1px solid gray",
                      padding: "3px",
                    }}
                  />
                ))}
              <Texts>
                <Title>{title}</Title>
                <ChannelName>{channel.name}</ChannelName>
                <Info>
                  {video.views} views • {format(video.createdAt)}
                </Info>
              </Texts>
            </Details>
          </Container>
        </Link>
      )}
    </>
  );
};

export default Card;
