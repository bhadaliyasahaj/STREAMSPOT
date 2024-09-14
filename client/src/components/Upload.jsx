import React, { useState } from "react";
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
import PersonIcon from "@mui/icons-material/Person";
import UplaodBtn from "@mui/icons-material/UploadFileOutlined.js"
import PublishIcon from "@mui/icons-material/PublishOutlined.js"
import Done from "@mui/icons-material/CheckCircleOutline.js"
import VideoLoader from 'react-spinners/SyncLoader.js'
import ImageLoader from 'react-spinners/HashLoader.js'



const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  width: 90%;
  /* max-width: 1200px; */
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 10px;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 80%;
    align-items: center;
    padding:20px;
    gap: 20px;
  }
`;

const DetailsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  overflow-y: auto;
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  font-size: 16px;
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  font-size: 16px;
  resize: vertical;
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  font-size: 16px;
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
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
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  /* max-height:; */
  &:hover {
    background-color: ${({ theme }) => theme.bg};
  }
  
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.textSoft};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* flex-direction: column; */
  gap: 10px;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: normal;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  gap: 30px;
  @media (max-width: 768px) {
    width: 100%;
    /* padding: 10px; */
  }
`;

const VideoPreview = styled.video`
  width: 100%;
  max-width: 400px;
  height: 250px;
  border-radius: 15px;
  background-color: #000;
  object-fit: cover;
  @media (max-width: 768px) {
    max-width: 300px;
  }
  @media (max-width: 480px) {
    /* max-width: 200px; */
    height: 200px;
    /* width: 100%; */
  }
`;

const PreviewSkeleton = styled.div`
  width: 100%;
  max-width: 400px;
  height: 250px;
  border-radius: 15px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdbdbd;
  font-size: 18px;
  font-weight: 500;
  @media (max-width: 768px) {
    max-width: 300px;
  }
  @media (max-width: 480px) {
    /* width: 100%; */
    height:200px;
    /* max-width: 200px; */
  }
`;

const CardContainer = styled.div`
  width: 100%;
  max-width: 320px;
  border: 1px solid ${({ theme }) => theme.soft};
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }

  &:hover{
    transform: translateY(-2%);
    transition: all 0.2s linear;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdbdbd;
  font-size: 18px;
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 10px;
`;

const Details = styled.div`
  display: flex;
  margin-top: 10px;
  gap: 12px;
  /* align-items: center; */
  @media (max-width: 768px) {
    /* flex-direction: column; */
    align-items: flex-start;
  }
`;

const ChannelImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /* object-fit: cover; */
  background-color: #999;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  word-wrap: break-word;
`;

const ChannelName = styled.h3`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 5px 0;
`;

const Info = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const StyledUplaodBtn = styled(UplaodBtn)`
  color: ${({ theme }) => theme.text};
  font-size: 20px;
  cursor: pointer;
  border: 2px dashed ${({ theme }) => theme.soft};
  padding: 10px;
  border-radius: 10px;
`;

const UploadName = styled.span`
  
`;

const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProgressNum = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const ProgressBar = styled.progress`
  width: 100%;
  /* appearance: none; */
  height: 5px;
  border: none;
  /* border-radius: 10px; */
  background-color: #f0f0f0;
  transition: all 0.3s linear;


  &::-webkit-progress-bar {
    background-color: #f0f0f0;
    border-radius: 10px;
  }

  &::-webkit-progress-value {
    background-color: red;
    /* border-radius: 10px; */
    transition: width 0.3s linear;
  }

  &::-moz-progress-bar {
    background-color: red;
    /* border-radius: 10px; */
    transition: width 0.3s linear;
  }
`



function Upload() {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
    e.preventDefault();
    e.stopPropagation()
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : e.dataTransfer.files[0];
    if (file.type.split("/")[0] === "image") {
      setImg(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : e.dataTransfer.files[0];
    if (file.type.split("/")[0] === "video") {
      setVideo(undefined);
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handlePreviewChange = (e) => {
    e.preventDefault()
    if (e.target.files[0]||e.dataTransfer.files[0]) {
      setVideoPreview(null)
    }
  }

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
          urlType === "imgUrl"
            ? dispatch(setmessage("Thumbnail Uploaded"))
            : dispatch(setmessage("Video Uploaded"));
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  const handleVideoUpload = () => {
    video && uploadFile(video, "videoUrl");
  };

  const handleImageUpload = () => {
    img && uploadFile(img, "imgUrl");
  };

  const handleUpload = async (e) => {
    if (!tags || !inputs || !category || !inputs.imgUrl || !inputs.videoUrl) {
      dispatch(setmessage("Enter All Details"))
      return
    }
    e.preventDefault();
    nProgress.start();
    try {
      const res = await axiosInstance.post(`/videos`, {
        ...inputs,
        tags,
        category,
      });
      setImg(undefined);
      setImgPerc(0);
      setVideo(undefined);
      setVideoPerc(0);
      setInputs({});
      res.status === 200 && navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.log(err);
    } finally {
      nProgress.done();
    }
  };

  return (
    <Container>
      <Wrapper>
        <DetailsWrapper>
          <Title>Upload Any Video</Title>
          <Label>Video:</Label>
          {videoPerc > 0 ? (
            <ProgressWrapper>
              <ProgressNum>{videoPerc < 100 ? (<><span>Uploading: </span><span>{Math.round(videoPerc) + "%"}</span></>) : <span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Done style={{ color: "green" }} /> Done</span>}</ProgressNum>{videoPerc < 100 && <ProgressBar max="100" value={Math.round(videoPerc)}></ProgressBar>}
            </ProgressWrapper>
          ) : (
            <InputWrapper>
              <label onDrop={handleVideoChange} onDragOver={(e) => e.preventDefault()} htmlFor="vidoeInput" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <StyledUplaodBtn /> <UploadName>{video && video.name}</UploadName>
              </label>
              <input
                id="vidoeInput"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                onInput={handlePreviewChange}
                style={{ display: 'none' }}
                required
              />
              {video && <Button onClick={handleVideoUpload}>Upload Video</Button>}
            </InputWrapper>
          )}

          <Input
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
            required
          />
          <Desc
            placeholder="Description"
            rows={8}
            onChange={handleChange}
            name="desc"
            required
          />
          <Input
            type="text"
            placeholder="Separate the tags with hashtags"
            onChange={handleTags}
            required
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
            <ProgressWrapper>
              <ProgressNum>{imgPerc < 100 ? (<><span>Uploading: </span><span>{Math.round(imgPerc) + "%"}</span></>) : <span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Done style={{ color: "green" }} /> Done</span>}</ProgressNum>{imgPerc < 100 && <ProgressBar max="100" value={Math.round(imgPerc)}></ProgressBar>}
            </ProgressWrapper>
          ) : (
            <InputWrapper>
              <label onDrop={handleThumbnailChange} onDragOver={(e) => e.preventDefault()} htmlFor="thumbnailInput" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <StyledUplaodBtn /> <UploadName>{img && img.name}</UploadName>
              </label>
              <input
                id="thumbnailInput"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{ display: 'none' }}
              />
              {img && <Button onClick={handleImageUpload}>Upload Thumbnail</Button>}
            </InputWrapper>
          )}

          <Button
            onClick={handleUpload}
            type="submit"
            style={{ gap: "5px" }}
          >
            <PublishIcon /> Publish
          </Button>
        </DetailsWrapper>
        <ContentWrapper>
          <Title>Preview</Title>
          {videoPreview ? (
            <VideoPreview controls>
              <source src={videoPreview} type={video.type} />
            </VideoPreview>
          ) : (
            <PreviewSkeleton><VideoLoader color="red"/></PreviewSkeleton>
          )}
          <CardContainer>
            {thumbnailPreview ? <Image src={thumbnailPreview} /> : <ImageContainer><ImageLoader color="red"/></ImageContainer>}
            <Details>
              {currentUser.img ? (
                <ChannelImage src={currentUser.img} />
              ) : (
                <PersonIcon
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    color: "gray",
                    border: "1px solid gray",
                    padding: "3px",
                  }}
                />
              )}
              <Texts>
                <CardTitle>{inputs.title || "Title goes here"}</CardTitle>
                <ChannelName>{currentUser.name}</ChannelName>
                <Info>Category: {category}</Info>
                <Info>Tags: {tags}</Info>
              </Texts>
            </Details>
          </CardContainer>
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
}

export default Upload;
