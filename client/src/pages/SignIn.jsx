import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification.jsx";
import validator from "validator";
import axiosInstance from "../utils/axiosInstance.js";
import InfoIcon from "@mui/icons-material/InfoOutlined.js";
import Visibility from "@mui/icons-material/Visibility.js";
import VisibilityOff from "@mui/icons-material/VisibilityOff.js";
import nProgress from "nprogress";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  padding: 20px; /* Add padding for smaller screens */

  @media (max-width: 768px) {
    height: auto; /* Adjust height for mobile screens */
    padding: 20px; /* Add padding for smaller screens */
  }
`;

// Wrapper styles
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  width: 100%;
  max-width: 500px;

  @media (max-width: 768px) {
    padding: 20px; /* Reduce padding for mobile screens */
  }

  @media (max-width: 480px) {
    padding: 15px; /* Further reduce padding for very small screens */
  }
`;

// Title styles
const Title = styled.h1`
  font-size: 24px;

  @media (max-width: 480px) {
    font-size: 20px; /* Reduce font size on small screens */
  }
`;

// SubTitle styles
const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;

  @media (max-width: 480px) {
    font-size: 18px; /* Reduce font size on small screens */
  }
`;

// Input styles
const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};

  @media (max-width: 480px) {
    padding: 8px; /* Adjust padding for smaller screens */
  }
`;

// Button styles
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};

  @media (max-width: 480px) {
    padding: 8px 16px; /* Adjust padding for smaller screens */
  }
`;

// More, Links, and Link styles
const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};

  @media (max-width: 480px) {
    font-size: 10px; /* Adjust font size for smaller screens */
  }
`;

const Links = styled.div`
  margin-left: 50px;

  @media (max-width: 480px) {
    margin-left: 20px; /* Adjust margin for smaller screens */
  }
`;

const Link = styled.span`
  margin-left: 30px;

  @media (max-width: 480px) {
    margin-left: 15px; /* Adjust margin for smaller screens */
  }
`;

// InputWrapper styles
const InputWrapper = styled.div`
  width: 105%;
  gap: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  @media (max-width: 480px) {
    flex-direction: column; /* Stack elements vertically on small screens */
    gap: 5px;
  }
`;

const Inputtag = styled.div`
  width: 86%;
  /* height: 100%; */
  position: relative;
`;

// Info styles
const Info = styled.div`
  width: 50%;
  padding: 20px 15px;
  color: ${({ theme }) => theme.bg};
  background-color: ${({ theme }) => theme.textSoft};
  border-radius: 20px;
  position: absolute;
  right: -25%;
  top: 2.5rem;

  li {
    padding: 2px 0;
  }

  @media (max-width: 768px) {
    width: 70%;
    right: -10%;
    top: 2.5rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    position: relative;
    top: 0;
    right: 0;
    margin-top: 10px;
  }
`;

const SignIn = () => {
  // const [name, setName] = useState("")
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  const [resp, setResp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState("");
  const [orgcode, setorgCode] = useState("");
  const [verify, setVerify] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [send, setSend] = useState("Send Code");
  const [info, setInfo] = useState(false);
  const [passawail, setPassawail] = useState(false);

  const user = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };


  const handleLogin = async (e) => {
    nProgress.start()
    e.preventDefault();
    dispatch(loginStart());
    try {
      await axiosInstance
        .post(`/auth/signin`, {
          name: details.name,
          password: details.password,
        })
        .then((res) => {
          console.log(res);
          dispatch(loginSuccess(res.data));
          setResp("Successfully Logged In");
          setVisible(true);
          navigate("/");
        });
    } catch (resp) {
      console.log(resp);
      setResp(resp.response.data.message);
      setVisible(true);
      dispatch(loginFailure());
    }
    finally{
      nProgress.done()
    }
  };

  const validatePassword = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    return pattern.test(password);
  };

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (validatePassword(details.password) && verify) {
        await axiosInstance
          .post(`/auth/signup`, {
            name: details.name,
            password: details.password,
            email: details.email,
          })
          .then((res) => {
            setResp(res.data);
            setVisible(true);
          });
      } else {
        // setSend(true);
        throw new Error("Enter Valid Password Or Verify Mail");
      }
    } catch (err) {
      // setSend(true);
      console.log(err);
      const msg = err.response?.data?.message||err.message;
      setResp(msg);
      setVisible(true);
    }
  };

  const getCode = async () => {
    try {
      if (!validateEmail(details.email) || !details.name) {
        setResp("Enter Valid Details");
        setVisible(true);
      } else {
        setSend("Sending...");
        const res = await axiosInstance.post(`/auth/getcode`, {
          email: details.email,
          name: details.name,
        });
        setorgCode(res.data.code);
        setResp("Code Is Sended To Your Mail");
        setVisible(true);
        setSend("Resend");
      }
    } catch (err) {
      setSend("Resend");
      setResp(err.response.data.message);
      setVisible(true);
    }
  };

  const verifyCode = async () => {
    try {
      if (!code || code !== orgcode) {
        setResp("Enter Valid Code");
        setVisible(true);
      } else {
        if (orgcode === code) {
          setResp("Your Email Verified");
          setVisible(true);
          setVerify(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue with StreamSpot</SubTitle>
        <Input
          placeholder="username"
          value={details.name}
          name="name"
          onChange={user}
        />
        <InputWrapper>
          <Input
            type={passawail?"text":"password"}
            value={details.password}
            placeholder="password"
            name="password"
            onChange={user}
          />
          {passawail ? (
            <VisibilityOff
              style={{
                fontSize: "25px",
                position: "absolute",
                right: "5px",
                top: "50%",
                cursor: "pointer",
                transform: "translateY(-50%)",
              }}
              onClick={() => setPassawail(!passawail)}
            />
          ) : (
            <Visibility
              style={{
                fontSize: "25px",
                position: "absolute",
                right: "5px",
                top: "50%",
                cursor: "pointer",
                transform: "translateY(-50%)",
              }}
              onClick={() => setPassawail(!passawail)}
            />
          )}
        </InputWrapper>
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Title>Sign Up</Title>
        <SubTitle>to become member of StreamSpot</SubTitle>
        <Input
          placeholder="username"
          value={details.name}
          name="name"
          onChange={user}
        />
        <InputWrapper>
          <Input
            placeholder="email"
            value={details.email}
            name="email"
            onChange={user}
          />
          <Button
            onClick={getCode}
            disabled={send === "Sending..."}
            style={{ width: "150px" }}
          >
            {send}
          </Button>
        </InputWrapper>
        <InputWrapper>
          <Input
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={verifyCode} style={{ width: "150px" }}>
            Verify Code
          </Button>
        </InputWrapper>
        <InputWrapper>
          <Inputtag>
            <Input
              type={passawail ? "text" : "password"}
              value={details.password}
              name="password"
              placeholder="password"
              onChange={user}
            />
            {passawail ? (
              <VisibilityOff
                style={{
                  fontSize: "25px",
                  position: "absolute",
                  right: "-15px",
                  top: "50%",
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                }}
                onClick={() => setPassawail(!passawail)}
              />
            ) : (
              <Visibility
                style={{
                  fontSize: "25px",
                  position: "absolute",
                  right: "-15px",
                  top: "50%",
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                }}
                onClick={() => setPassawail(!passawail)}
              />
            )}
          </Inputtag>
          <InfoIcon
            style={{
              fontSize: "25px",
              color: "yellowgreen",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => setInfo(!info)}
          />
          {info && (
            <>
              <Info>
                <li>Must be at least 8 characters long.</li>
                <li>Must contain at least one uppercase letter (A-Z).</li>
                <li>Must contain at least one lowercase letter (a-z).</li>
                <li>Must include at least one numeric digit (0-9).</li>
                <li>
                  Must include at least one special character from the
                  following: ! @ # $ % ^ & *.
                </li>
              </Info>
            </>
          )}
        </InputWrapper>
        <Button
          onClick={handleRegister}
          disabled={!details.name || !details.password || !details.email}
        >
          Sign up
        </Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
      {resp && <Notification message={resp} visible={visible} setVisible={setVisible}/>}
    </Container>
  );
};

export default SignIn;
