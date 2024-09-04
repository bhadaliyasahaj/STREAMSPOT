import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance.js";
import nProgress from "nprogress";
import { setmessage } from "../redux/notificationSlice.js";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 100;
`;
const Wrapper = styled.div`
  width: 600px;
  /* height: 650px; */
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow-y: auto;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Option = styled.option`
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textHard};
`;

const Label = styled.label`
  font-size: 14px;
  border-radius: 3px;
  border: none;
  padding: 10px 10px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.textSoft};
`;

const ThumbnailPreview = styled.div`
  margin-bottom: 20px;
  img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
`;

const VideoPreview = styled.video`
   margin-bottom: 20px;
   border-radius:10px;
  source {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
`

function Upload() {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    const tags = e.target.value.split("#");
    tags.shift();
    setTags(tags);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `/users/${currentUser._id}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl" ? setImgPerc(progress) : setVideoPerc(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error, "Upload Failed");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          urlType==="imgUrl"?dispatch(setmessage("Thumbnail Uploaded")):dispatch(setmessage("Video Uploaded"))
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);
  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    nProgress.start()
    try {
      const res = await axiosInstance.post(`/videos`, { ...inputs, tags, category });
      setImg(undefined)
      setImgPerc(0)
      setVideo(undefined)
      setVideoPerc(0)
      setInputs({})
      res.status === 200 && navigate(`/video/${res.data._id}`);
    }catch(err){
      console.log(err);
    }
    finally{
      nProgress.done()
    }
  };

  return (
    <Container>
      <Wrapper>
        {/* <Close onClick={() => setOpen(false)}>X</Close> */}
        <Title>Upload Any Video</Title>
        <Label>Video:</Label>
        {videoPerc > 0 ? (
          "Uploading: " + Math.round(videoPerc) + "%"
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
        )}
        {videoPreview && (
          <VideoPreview width="400" controls>
            <source src={videoPreview} type={video.type}></source>
          </VideoPreview>
        )}
        <Input
          type="text"
          placeholder="Title"
          onChange={handleChange}
          name="title"
        />
        <Desc
          placeholder="Description"
          rows={8}
          onChange={handleChange}
          name="desc"
        />
        <Input
          type="text"
          placeholder="Separate the tags with hashtags"
          onChange={handleTags}
        />
        <Label>Category:</Label>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <Option value="">Select Category</Option>
          <Option value="music">Music</Option>
          <Option value="sports">Sports</Option>
          <Option value="gaming">Gaming</Option>
          <Option value="movies">Movies</Option>
          <Option value="news">News</Option>
        </Select>
        <Label>Thumbnail:</Label>
        {imgPerc > 0 ? (
          "Uploading: " + Math.round(imgPerc) + "%"
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        )}
        {thumbnailPreview && (
          <ThumbnailPreview>
            <img src={thumbnailPreview} alt="Thumbnail Preview" />
          </ThumbnailPreview>
        )}
        <Button
          onClick={handleUpload}
          disabled={!inputs.videoUrl || !inputs.imgUrl || !setCategory || nProgress.isStarted()}
        >
          Upload
        </Button>
      </Wrapper>
    </Container>
  );
}

export default Upload;
