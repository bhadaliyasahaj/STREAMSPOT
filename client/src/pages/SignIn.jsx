import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification.jsx";
import validator from "validator";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  overflow-x: hidden;
`;

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
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const InputWrapper = styled.div`
  width: 104%;
  gap: 10px;
  display: flex;
  justify-content: space-between;
  /* margin: 10px; */
`;

const Small = styled.button`
  /* flex: 1; */
  border-radius: 3px;
  /* margin-left: 10px; */
  border: none;
  /* padding: 10px 10px; */
  font-weight: 500;
  cursor: pointer;
  min-width: 80px;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
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

  const user = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      await axios
        .post("/auth/signin", {
          name: details.name,
          password: details.password,
        })
        .then((res) => {
          console.log(res);
          dispatch(loginSuccess(res.data));
          navigate("/");
          setResp("Successfully Logged In");
          setVisible(true);
        });
    } catch (resp) {
      setResp(resp.response.data.message);
      setVisible(true);
      dispatch(loginFailure());
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
        await axios
          .post("/auth/signup", {
            name: details.name,
            password: details.password,
            email: details.email,
          })
          .then((res) => {
            setResp(res.data);
            setVisible(true);
          });
      } else {
        throw new Error("Enter Valid Password Or Verify Mail");
      }
    } catch (err) {
      setResp(err.response.data.message);
      setVisible(true);
    }
  };

  const getCode = async () => {
    try {
      if (!validateEmail(details.email) || !details.name) {
        setResp("Enter Valid Details");
        setVisible(true);
      } else {
        const res = await axios.post("/auth/getcode", {
          email: details.email,
          name: details.name,
        });
        setorgCode(res.data.code);
        setResp("Code Is Sended To Your Mail");
        setVisible(true);
      }
    } catch (err) {
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
        <Input
          type="password"
          value={details.password}
          placeholder="password"
          name="password"
          onChange={user}
        />
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
          <Small onClick={getCode}>Get Code</Small>
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
        <Input
          type="password"
          value={details.password}
          name="password"
          placeholder="password"
          onChange={user}
        />
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
      {resp && <Notification message={resp} visible={visible} />}
    </Container>
  );
};

export default SignIn;
