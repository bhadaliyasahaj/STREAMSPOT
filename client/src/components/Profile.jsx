import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../firebaseConfig.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Person from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/userSlice.js";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bgLighter};
`;

const Wrapper = styled.div`
  width: 90%;
  display: flex;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  gap: 80px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const ImageSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  border-right: 1px solid ${({ theme }) => theme.hard};
`;

const DetailsSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const Image = styled.img`
  width: 100%;
  height: 100%;
  transform: scale(1.5);
`;

const ImageContainer = styled.div`
  width: 50%;
  height: 50%;
  border: 2px solid ${({ theme }) => theme.hard};
  border-radius: 30%;
  overflow: hidden;
`;

function Profile() {
  const [img, setImg] = useState(undefined);
  const [imgurl, setImgUrl] = useState("");
  const [imgPerc, setImgPerc] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const uploadFile = (file, urlType) => {
    if (!file) return;

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `/users/${currentUser._id}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(progress);
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
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };
  useEffect(() => {
    if (img) {
      uploadFile(img, "img");
    }
  }, [img]);

  const handleUploadImage = async () => {
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }
    if (!currentUser.img || currentUser.img === "") {
      try {
        dispatch(loginSuccess({ ...currentUser, img: imgurl }));
        const res = await axios.put(`/users/${currentUser._id}`, {
          img: imgurl,
        });
      } catch (error) {
        console.error("Update failed:", error);
      }
    } else {
      try {
        const storage = getStorage(app);

        const imgRef = ref(
          storage,
          `/users/${currentUser._id}/${decodeURIComponent(currentUser.img)
            .split("/")
            .pop()
            .split("?")[0]
            .replace(/\s+/g, "")}`
        );

        deleteObject(imgRef)
          .then(async () => {
            setImgPerc(0);
            dispatch(loginSuccess({ ...currentUser, img: "" }));
            const res = await axios.put(`/users/${currentUser._id}`, {
              img: "",
            });
          })
          .catch((error) => {});
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <ImageSection>
          <Title>Profile Image</Title>
          {currentUser?.img && currentUser?.img !== "" ? (
            <>
              <ImageContainer>
                <Image src={currentUser.img} />
              </ImageContainer>
              <Button onClick={handleUploadImage}>Update Image</Button>
            </>
          ) : (
            <>
              <Person
                style={{
                  fontSize: "7rem",
                  border: "1px solid white",
                  borderRadius: "30%",
                }}
              />
              {imgPerc > 0 ? (
                "Uploading: " + Math.round(imgPerc) + "%"
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              )}
              <Button disabled={!imgurl} onClick={handleUploadImage}>
                Upload Image
              </Button>
            </>
          )}
        </ImageSection>
        <DetailsSection>
          <Title>Manage Your Profile</Title>
          <Label>Username:</Label>
          <Input type="text" name="username" />
          <Label>Email:</Label>
          <Input type="email" name="email" />
          <Button>Update Profile</Button>
        </DetailsSection>
      </Wrapper>
    </Container>
  );
}

export default Profile;
