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
import axios from "axios";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";
import Videoload from "../components/loadComponent/Videoload";
import Person from "@mui/icons-material/AccountCircleOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../components/Notification";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../firebaseConfig.js";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
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
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
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
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const More = styled.p`
  position: absolute;
  left: 10px;
  bottom: -10px;
  font-size: 15px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
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
  const [visible, setVisible] = useState(false);
  const [resp, setResp] = useState("");
  const [event, setEvent] = useState("");
  const [load, setLoad] = useState(false);
  const API_URL = process.env.REACT_APP_API_URI;

  const handleMore = () => {
    setMore((prevMore) => !prevMore);
  };

  useEffect(() => {
    dispatch(fetchSuccess(null));
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`${API_URL}/videos/find/${path}`);
        const channelRes = await axios.get(
          `${API_URL}/users/find/${videoRes.data.userId}`
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

        await axios.put(`${API_URL}/videos/view/${path}`);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(
      `${API_URL}/users/like/${currentVideo._id}`,
      {},
      { withCredentials: true }
    );
    dispatch(like(currentUser._id));
  };

  const handleDislike = async () => {
    await axios.put(
      `${API_URL}/users/dislike/${currentVideo._id}`,
      {},
      { withCredentials: true }
    );
    dispatch(dislike(currentUser._id));
  };

  const handleSubscription = async () => {
    if (event === "sub") return;
    setEvent("sub");
    try {
      if (currentUser.subscribedUsers.includes(channel._id)) {
        await axios.put(
          `${API_URL}/users/unsub/${channel._id}`,
          {},
          { withCredentials: true }
        );
        setChannel((prevChannel) => ({
          ...prevChannel,
          subscribers: prevChannel.subscribers - 1,
        }));
      } else {
        await axios.put(
          `${API_URL}/users/sub/${channel._id}`,
          {},
          { withCredentials: true }
        );
        setChannel((prevChannel) => ({
          ...prevChannel,
          subscribers: prevChannel.subscribers + 1,
        }));
      }
      dispatch(subscription(channel._id));
    } catch (err) {
      console.log(err);
    } finally {
      setEvent("");
    }
  };

  const handleShare = () => {};

  const handleVideoDelete = async () => {
    try {
      const storage = getStorage(app);

      const videoRef = ref(
        storage,
        `/users/${currentUser._id}/${decodeURIComponent(currentVideo.videoUrl)
          .split("/")
          .pop()
          .split("?")[0]
          .replace(/\s+/g, "")}`
      );
      const imgRef = ref(
        storage,
        `/users/${currentUser._id}/${decodeURIComponent(currentVideo.imgUrl)
          .split("/")
          .pop()
          .split("?")[0]
          .replace(/\s+/g, "")}`
      );

      deleteObject(videoRef)
        .then(async () => {
          await axios.delete(`${API_URL}/videos/${currentVideo._id}`, {
            withCredentials: true,
          });
          setResp("Video Has Been Successfully Deleted");
          setVisible(true);
          navigate("/");
        })
        .catch((error) => {});
      deleteObject(imgRef)
        .then(async () => {})
        .catch((error) => {});
    } catch (error) {
      console.log(error);
    }
  };

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
                <Button onClick={handleLike}>
                  {currentUser &&
                  currentVideo.likes?.includes(currentUser._id) ? (
                    <ThumbUpIcon />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}{" "}
                  {currentVideo.likes?.length}
                </Button>
                <Button onClick={handleDislike}>
                  {currentUser &&
                  currentVideo.dislikes?.includes(currentUser._id) ? (
                    <ThumbDownIcon />
                  ) : (
                    <ThumbDownOffAltOutlinedIcon />
                  )}{" "}
                  Dislike
                </Button>
                <Button>
                  <ReplyOutlinedIcon onClick={handleShare} /> Share
                </Button>
                <Button>
                  <AddTaskOutlinedIcon /> Save
                </Button>
                {allowDelete && (
                  <Button onClick={handleVideoDelete}>
                    <DeleteOutline /> Delete
                  </Button>
                )}
              </Buttons>
            </Details>
            <Hr />
            <Channel>
              <ChannelInfo>
                {channel.img ? (
                  <Image src={channel.img} />
                ) : (
                  <Person
                    style={{
                      minWidth: "50px",
                      height: "50px",
                      color: "gray",
                      borderRadius: "50%",
                    }}
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
              <Subscribe onClick={handleSubscription} disabled={event==="sub"}>
                {event==="sub" ? (currentUser &&
                currentUser.subscribedUsers?.includes(channel._id)
                  ? "SUBSCRIBED"
                  : "SUBSCRIBE"):("SUBSCRIBING..")}
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
      {resp && <Notification message={resp} visible={visible} />}
    </>
  );
};

export default Video;
