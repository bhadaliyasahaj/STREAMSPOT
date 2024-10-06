import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";
import Videoload from "../components/loadComponent/Videoload";
import Person from "@mui/icons-material/AccountCircleOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../components/Notification";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../firebaseConfig.js";
import axiosInstance from "../utils/axiosInstance.js";
import Playlistpopup from "../components/Playlistpopup.jsx";
import nProgress from "nprogress";
import { setmessage } from "../redux/notificationSlice.js";

const Container = styled.div`
  display: flex;
  gap: 24px;
  /* padding: 1px; */
  @media (max-width: 1024px) {
    flex-direction: column;
    gap:20px;
    padding:0px 10px;
  }
`;

const Content = styled.div`
  flex: 5;
`;

const VideoWrapper = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12px;
    margin:0px 0px 15px 7px;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
  @media (max-width: 768px) {
    margin: auto;
    width: 100%;
    justify-content: space-between;
  }
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
  @media (max-width: 768px) {
    min-width: 40px;
    height: 40px;
  }
  cursor: pointer;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
  @media (max-width: 768px) {
    position: relative;
  }
`;

const ChannelName = styled.span`
  font-weight: 500;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.div`
  position: relative;
  padding: 0px 0px 10px 0px;
  font-size: 14px;
  @media (max-width: 768px) {
    left:-10%;
    width:100%;
    font-size: 12px;
  }
`;

const Desc = styled.div`
  max-height: ${(props) => (props.more ? "none" : "67px")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  white-space: pre-wrap;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    position: absolute;
    /* width: 100%; */
    padding: 8px 8px;
    right: 10px;
  }
`;

const VideoFrame = styled.video`
  height: 500px;
  max-height: 720px;
  width: 100%;
  object-fit: cover;
  @media (max-width: 1024px) {
    height: 350px;
  }
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const More = styled.p`
  position: absolute;
  left: 10px;
  bottom: -10px;
  font-size: 15px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Span = styled.span`
  @media (max-width: 768px) {
    display:none;
  }
`;


const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const [more, setMore] = useState(false);
  const [allowDelete, setAllowDelete] = useState(false);
  const [event, setEvent] = useState("");
  const [save, setSave] = useState(false);

  const handleMore = () => {
    setMore((prevMore) => !prevMore);
  };

  useEffect(() => {
    nProgress.start()
    dispatch(fetchSuccess(null));
    const fetchData = async () => {
      try {
        const videoRes = await axiosInstance.get(`/videos/find/${path}`);
        const channelRes = await axiosInstance.get(
          `/users/find/${videoRes.data.userId}`
        );

        setChannel(channelRes.data);
        dispatch(
          fetchSuccess({ ...videoRes.data, views: videoRes.data.views + 1 })
        );

        if (
          channelRes &&
          currentUser &&
          channelRes.data._id === currentUser._id
        ) {
          setAllowDelete(true);
        } else setAllowDelete(false);

        await axiosInstance.put(`/videos/view/${path}`);
        if (currentUser) {
          const res = await axiosInstance.put(`/users/history/${path}`);
          // console.log(res); 
        }


      } catch (error) {
        console.log(error);
      }
      finally {
        nProgress.done()
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    try {
      dispatch(like(currentUser._id));
      await axiosInstance.put(
        `/users/like/${currentVideo._id}`);
    } catch (err) {
      dispatch(like(currentUser._id))
    }
  };

  const handleDislike = async () => {
    try {
      dispatch(dislike(currentUser._id));
      await axiosInstance.put(
        `/users/dislike/${currentVideo._id}`);
    } catch (err) {
      dispatch(dislike(currentUser._id))
    }
  };

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

  const handleShare = () => { };

  const handleSave = () => {
    setSave(true)
  }

  const handleVideoDelete = async () => {
    nProgress.start()
    try {
      const storage = getStorage(app);

      const videoRef = ref(storage, `/users/${currentUser._id}/${decodeURIComponent(currentVideo.videoUrl).split("/").pop().split("?")[0].replace(/\s+/g, "")}`);
      const imgRef = ref(storage, `/users/${currentUser._id}/${decodeURIComponent(currentVideo.imgUrl).split("/").pop().split("?")[0].replace(/\s+/g, "")}`);

      deleteObject(videoRef)
        .then(async () => {
        })
        .catch((error) => { });
      deleteObject(imgRef)
        .then(async () => {
          await axiosInstance.delete(`/videos/${currentVideo._id}`);
          dispatch(setmessage("Video Has Been Successfully Deleted"))
          navigate("/");
        })
        .catch((error) => { });
    } catch (error) {
      console.log(error);
    }
    finally {
      nProgress.done()
    }
  };

  const handleChannel = (e,channelId)=>{
    e.preventDefault();
    e.stopPropagation();
    navigate(`/channel/${channelId}`)
  }

  return (
    <>
      {channel && currentVideo ? (
        <Container>
          <Content>
            <VideoWrapper>
              <VideoFrame src={currentVideo.videoUrl} controls />
            </VideoWrapper>
            <Title>{currentVideo.title}</Title>
            <Details>
              <Info>
                {currentVideo.views} views • {format(currentVideo.createdAt)}
              </Info>
              <Buttons>
                <Button onClick={handleLike} aria-disabled={!currentUser}>
                  {currentUser &&
                    currentVideo.likes?.includes(currentUser._id) ? (
                    <ThumbUpIcon />
                  ) : (
                    <ThumbUpOutlinedIcon titleAccess="I Like It" />
                  )}
                  {currentVideo.likes?.length}
                </Button>
                <Button onClick={handleDislike} aria-disabled={!currentUser}>
                  {currentUser &&
                    currentVideo.dislikes?.includes(currentUser._id) ? (
                    <ThumbDownIcon />
                  ) : (
                    <ThumbDownOffAltOutlinedIcon titleAccess="I Dislike It" />
                  )}
                  Dislike
                </Button>
                <Button>
                  <ReplyOutlinedIcon onClick={handleShare} /><Span>Share</Span>
                </Button>
                <Button onClick={handleSave}>
                  <AddTaskOutlinedIcon /><Span>Save</Span>
                </Button>
                {allowDelete && (
                  <Button onClick={handleVideoDelete}>
                    <DeleteOutline /> <Span>Delete</Span>
                  </Button>
                )}
              </Buttons>
            </Details>
            <Hr />
            <Channel>
              <ChannelInfo>
                {channel.img ? (
                  <Image src={channel.img} onClick={(e)=>handleChannel(e,channel._id)}/>
                ) : (
                  <Person
                    style={{
                      minWidth: "50px",
                      height: "50px",
                      color: "gray",
                      borderRadius: "50%",
                      cursor:"pointer"
                    }}
                    onClick={(e)=>handleChannel(e,channel._id)}
                  />
                )}
                <ChannelDetail>
                  <ChannelName>{channel.name}</ChannelName>
                  <ChannelCounter>
                    {channel.subscribers} subscribers
                  </ChannelCounter>
                  <Description>
                    <Desc more={more}>{currentVideo.desc}</Desc>
                    <More onClick={handleMore}>
                      <strong>{more ? "Show Less" : "...More"}</strong>
                    </More>
                  </Description>
                </ChannelDetail>
              </ChannelInfo>
              <Subscribe onClick={handleSubscription} disabled={event === "sub"}>
                {(currentUser &&
                  currentUser.subscribedUsers?.includes(channel._id)
                  ? "SUBSCRIBED"
                  : "SUBSCRIBE")}
              </Subscribe>
            </Channel>
            <Hr />
            <Comments videoId={currentVideo._id} />
          </Content>
          <Recommendation tags={currentVideo.tags} />
        </Container>
      ) : (
        <Videoload />
      )}
      {save && (<Playlistpopup setSave={setSave} vidId={currentVideo._id} />)}
    </>
  );
};

export default Video;
