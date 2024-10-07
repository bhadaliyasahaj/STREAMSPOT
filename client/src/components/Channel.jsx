import React, { useEffect, useState } from "react";
import styled from "styled-components";
import image from "../img/temp.jpeg";
import Logo from "../img/temp2.jpg";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { subscription } from "../redux/userSlice";
import Card from "./Card";
import Playlist from "./Playlists";
import nProgress from "nprogress";

const Container = styled.div`
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChannelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const PosterContainer = styled.div`
  height: 200px;
`;

const Image = styled.img`
  border-radius: 20px;
  width: 100%;
  height: 100%;
`;

const ChannelDetailContainer = styled.div`
  display: flex;
  gap: 20px;
  width: fit-content;
`;

const ChannelImage = styled.img`
  width: 150px;
  height: 150px;
  /* border: 2px solid yellow; */
  border-radius: 50%;
  /* display: flex; */
`;

const ChannelTitle = styled.h1`
  margin: 0 7px;
`;

const ChannelText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ChannelInfo = styled.p`
  color: ${({ theme }) => theme.textSoft};
  margin: 0 7px;

`;

const ChannelNavContainer = styled.div`
  /* border: 2px solid green; */
  /* height: 100px; */
`;

const ChannelNavBar = styled.div`
  border-top: 1px solid ${({ theme }) => theme.textSoft};
  border-bottom: 1px solid ${({ theme }) => theme.textSoft};
  padding: 5px;
  display: flex;
  gap: 15px;
`;

const NavElement = styled.div`
    /* border: 2px solid red; */
    width: fit-content;
    padding: 5px 10px;
    border-radius: 10px;
    background-color: ${({ theme, active }) => active ? theme.text : theme.soft};
    color: ${({ theme, active }) => active ? theme.bg : theme.text} ;
    cursor: pointer;
    &:hover{
      background-color: ${({ theme }) => theme.text};
      color: ${({ theme }) => theme.bg} ;
      transition: all 0.3s ease-in;
    }
`;

const ChannelContent = styled.div`  
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Subscribe = styled.button`
  background-color: ${({ theme, subscribed }) => subscribed ? theme.soft : theme.text};
  font-weight: 500;
  color:${({ theme, subscribed }) => subscribed ? theme.text : theme.bg};
  border: none;
  border-radius: 50px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s linear;
  
`;

const PlaylistContainer = styled.div`
`

function Channel({ type }) {
  const [active, setActive] = useState("video");
  const [channel, setChannel] = useState(null);
  const [event, setEvent] = useState("");
  const location = useLocation()
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [videoType, setVideoType] = useState("latest");

  useEffect(() => {
    const channelId = location.pathname.split("/")[2];
    const findVideo = async () => {
      try {
        const res = await axiosInstance(`/users/find/${channelId}`);
        setChannel(res.data)
        if (active === "video") {
          nProgress.start()
          const chvideos = await axiosInstance(`/videos/channel/video/${res.data._id}`);
          console.log(chvideos.data);
          setVideos(chvideos.data)
          nProgress.done()
        }
        // console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    findVideo();
    handleVideoType("latest");
  }, [active]);



  const handleSubscription = async () => {
    if (event === "sub") return;
    setEvent("sub");
    try {
      dispatch(subscription(channel._id));
      if (currentUser.subscribedUsers.includes(channel._id)) {
        setChannel((prevChannel) => ({
          ...prevChannel,
          subscribers: prevChannel.subscribers - 1,
        }));
        await axiosInstance.put(
          `/users/unsub/${channel._id}`);
      } else {
        setChannel((prevChannel) => ({
          ...prevChannel,
          subscribers: prevChannel.subscribers + 1,
        }));
        await axiosInstance.put(
          `/users/sub/${channel._id}`
        );
      }
    } catch (err) {
      dispatch(subscription(channel._id));
      console.log(err);
    } finally {
      setEvent("");
    }
  };

  const removeVideo = (id) => {
    setVideos((prev) => {
      const update = prev.filter((video) => video.id !== id && video._id !== id);
      console.log(update);
      return update
    });
  };

  const handleVideoType = (vtype) => {
    if (vtype === "latest") {
      setVideoType("latest");
      setVideos((prev) => (prev.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
    } else if (vtype === "popular") {
      setVideoType("popular");
      setVideos((prev) => (prev.sort((a, b) => b.views - a.views)));
    } else if (vtype === "oldest") {
      setVideoType("oldest");
      setVideos((prev) => (prev.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))))
    }
  }

  return (
    <>{channel &&
      <Container>
        <Wrapper>
          <ChannelContainer>
            <PosterContainer>
              <Image src={image}></Image>
            </PosterContainer>
            <ChannelDetailContainer>
              {channel.img && <ChannelImage src={channel.img}></ChannelImage>}
              <ChannelText>
                <ChannelTitle>{channel.name}</ChannelTitle>
                <ChannelInfo>@{channel.name}</ChannelInfo>
                <ChannelInfo>{channel.subscribers} subscribers</ChannelInfo>
                <ChannelInfo>Description</ChannelInfo>
                <Subscribe onClick={handleSubscription} disabled={event === "sub"} subscribed={currentUser?.subscribedUsers?.includes(channel._id)}>
                  {(currentUser &&
                    currentUser.subscribedUsers?.includes(channel._id)
                    ? "SUBSCRIBED"
                    : "SUBSCRIBE")}
                </Subscribe>
              </ChannelText>
            </ChannelDetailContainer>
          </ChannelContainer>
          <ChannelNavContainer>
            <ChannelNavBar>
              <NavElement onClick={() => setActive("video")} active={active === "video"}>Videos</NavElement>
              <NavElement onClick={() => setActive("details")} active={active === "details"}>Details</NavElement>
              <NavElement onClick={() => setActive("playlist")} active={active === "playlist"}>Playlists</NavElement>
            </ChannelNavBar>
          </ChannelNavContainer>
          <ChannelContent>
            {active === "video" && <>
              <ChannelNavBar style={{ border: "none", marginBottom: "10px" }}>
                <NavElement onClick={() => handleVideoType("latest")} active={videoType === "latest"}>Latest</NavElement>
                <NavElement onClick={() => handleVideoType("popular")} active={videoType === "popular"}>Popular</NavElement>
                <NavElement onClick={() => handleVideoType("oldest")} active={videoType === "oldest"}>Oldest</NavElement>
              </ChannelNavBar>
              <VideoContainer>
                {
                  videos ? videos.map((video) => (
                    <Card
                      key={video._id || video.id}
                      video={video}
                      removed={video.id}
                      onRemove={removeVideo}
                      type={type}
                    />
                  )) : <p>Videos Are Not Available</p>
                }
              </VideoContainer>
            </>}
            {active === "playlist" && <PlaylistContainer>
              <Playlist pubList={channel}></Playlist>
            </PlaylistContainer>}
          </ChannelContent>
        </Wrapper>
      </Container>
    }
    </>
  );
}

export default Channel;
