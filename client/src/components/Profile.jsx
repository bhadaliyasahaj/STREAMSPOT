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
import Person from "@mui/icons-material/Person";
import Camera from "@mui/icons-material/PhotoCameraOutlined.js";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/userSlice.js";
import axiosInstance from "../utils/axiosInstance.js";
import nProgress from "nprogress";
import { setmessage } from "../redux/notificationSlice.js";

const Container = styled.div`
  padding: 0 20px;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Column = styled.div`
  width: 100%;
  flex: ${(props) => (props.fullWidth ? "100%" : "25%")};
  background-color: ${({ theme }) => theme.bgLighter};
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 20px;
`;

const AvatarWrapper = styled.div`
  width: 150px;
  height: 150px;
  text-align: center;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0px 0px 10px 0px black;
`;

const AvatarImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const AvatarLabel = styled.label`
  background-color: rgba(18, 18, 18, 0.512);
  width: 100%;
  height: 30%;
  /* z-index: 100; */
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledCamera = styled(Camera)`
  /* border: 2px solid red; */
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const Label = styled.label`
  align-self: flex-start;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const InputWrapper = styled.div`
  width: 100%;
  align-self: flex-start;
  margin-left: 20px;
  @media (max-width: 768px) {
    /* width: 100%; */
    margin-left: 0;
  }
`;

const Input = styled.input`
  width: 95%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${({ primary, theme }) =>
    primary ? "#007bff" : theme.soft};
  color: ${({ primary, theme }) => (primary ? "#fff" : theme.text)};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const FormGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 20px;
  padding: 20px;
`;

function Profile() {
  const [img, setImg] = useState(undefined);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const uploadFile = (file) => {
    // nProgress.start();
    if (!file || !file.type.startsWith("image/")) return;

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `/users/${currentUser._id}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setImgPerc(progress);
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
          // setImgUrl(downloadURL);
          const handleUploadImage = async () => {
            if (!currentUser) {
              console.error("No user logged in");
              return;
            }
            if (!currentUser.img || currentUser.img === "") {
              try {
                const res = await axiosInstance.put(
                  `/users/${currentUser._id}`,
                  {
                    img: downloadURL,
                  }
                );
                dispatch(loginSuccess({ ...currentUser, img: downloadURL }));
                dispatch(setmessage("Profile Image Updated"));
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
                  }`
                );

                deleteObject(imgRef)
                  .then(async () => {
                    // setImgPerc(0);
                    // console.log(downloadURL);

                    dispatch(
                      loginSuccess({ ...currentUser, img: downloadURL })
                    );
                    const res = await axiosInstance.put(
                      `/users/${currentUser._id}`,
                      {
                        img: downloadURL,
                      }
                    );
                    dispatch(setmessage("Profile Image Updated"));
                  })
                  .catch((error) => { });
              } catch (error) {
                console.log(error);
              }
            }
          };
          handleUploadImage();
        });
      }
    );
  };
  useEffect(() => {
    if (img) {
      uploadFile(img, "img");
    }
  }, [img]);

  const handleCancel = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const validatePassword = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    return pattern.test(password);
  };

  const handleSaveChanges = async () => {
    try {
      if (!username || !password || !confirmPassword || !validatePassword(confirmPassword)) {
        !validatePassword(confirmPassword) ? dispatch(setmessage("Enter Valid Password")) : dispatch(setmessage("Enter All Details"))
        return
      }
      if (password === confirmPassword) {
        const res = await axiosInstance.put(`/users/${currentUser._id}`, {
          name: username,
          password: confirmPassword,
        });
        console.log(res);

        dispatch(loginSuccess({ ...currentUser, name: username }))
        dispatch(setmessage("Profile Updated"))
      } else {
        dispatch(setmessage("Enter Password Carefully"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // nProgress.done();
  return (
    <Container>
      <Title>Edit Your Profile</Title>
      <hr />
      <Row>
        <Column>
          <AvatarWrapper>
            <AvatarImage src={currentUser.img || ""} alt="avatar" />
            <AvatarLabel htmlFor="AvatarUpload">
              <StyledCamera />
            </AvatarLabel>
            <Input
              type="file"
              style={{ display: "none" }}
              id="AvatarUpload"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </AvatarWrapper>
        </Column>

        <Column>
          <h3>Personal Info</h3>
          <Form>
            <FormGroupContainer>
              <FormGroup>
                <Label>Username:</Label>
                <InputWrapper>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputWrapper>
              </FormGroup>
              <FormGroup>
                <Label>New Password:</Label>
                <InputWrapper>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputWrapper>
              </FormGroup>
              <FormGroup>
                <Label>Confirm New Password:</Label>
                <InputWrapper>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputWrapper>
              </FormGroup>
              <FormGroup>
                <Label />
                <div>
                  <Button type="button" primary onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                  <Button type="reset" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </FormGroup>
            </FormGroupContainer>
          </Form>
        </Column>
      </Row>
      <hr />
    </Container>
  );
}

export default Profile;
