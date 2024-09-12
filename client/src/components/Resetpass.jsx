import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import StreamSpot from "../img/logo.png";
import Visibility from '@mui/icons-material/VisibilityOutlined'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import { useDispatch } from 'react-redux';
import { setmessage } from '../redux/notificationSlice';
import axiosInstance from '../utils/axiosInstance';


const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  z-index: 1000;
`;

const MainBox = styled.div`
  background-color: white;
  padding:30px 40px ;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #555;
  text-align: left;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const EmailInfo = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Logo = styled.div`
display: flex;
justify-content: center;
gap: 10px;
align-items: center;
margin-bottom: 30px ;
`
const Image = styled.img``
const WebName = styled.p`
    font-size: 1.3rem;
    font-weight: 500;
`

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    position:relative;
`

function Resetpass() {
    const [params] = useSearchParams();
    const token = params.get('token');
    const email = params.get('email');
    console.log(token, email);

    const [newPass, setNewpass] = useState({ Pass: "", confirmPass: "" });
    const [visible, setVisible] = useState(false)
    const dispatch = useDispatch()

    const validatePassword = (password) => {
        const pattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
        return pattern.test(password);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(newPass);
        try {
            if (newPass.Pass === newPass.confirmPass && validatePassword(newPass.confirmPass)) {
                const res = await axiosInstance.post("/auth/resetpassword", {
                    email: email,
                    token: token,
                    newpassword: newPass.confirmPass
                })

                dispatch(setmessage(res.data))
            } else {
                dispatch(setmessage("Passwords Are Different OR Follow Instruction"))
            }
        } catch (err) {
            dispatch(setmessage(err.response.data.message))
        }

    };

    return (
        <Container>
            <MainBox>
                <Logo>
                    <Image src={StreamSpot} />
                    <WebName>StreamSpot</WebName>
                </Logo>
                <Title>Reset Your Password</Title>
                <EmailInfo>Email: {email}</EmailInfo>
                <Form onSubmit={handleSubmit}>
                    <div>
                        <Label>New Password:</Label>
                        <InputWrapper>
                            <Input
                                placeholder='Enter New Password'
                                type={visible ? 'text' : 'password'}
                                value={newPass.Pass}
                                onChange={(e) => setNewpass((prev) => ({ ...prev, Pass: e.target.value }))}
                                required
                            />
                            {
                                visible ? <VisibilityOff style={{ position: "absolute", right: "10px", cursor: "pointer" }} onClick={() => setVisible(!visible)} />
                                    : <Visibility style={{ position: "absolute", right: "10px", cursor: "pointer" }} onClick={() => setVisible(!visible)} />
                            }
                        </InputWrapper>
                    </div>
                    <div>
                        <Label>Confirm Password:</Label>
                        <Input
                            placeholder='Enter Confirm Password'
                            type="password"
                            value={newPass.confirmPass}
                            onChange={(e) => setNewpass((prev) => ({ ...prev, confirmPass: e.target.value }))}
                            required
                        />
                    </div>
                    <Button type="submit">Reset Password</Button>
                </Form>
            </MainBox>
        </Container>
    );
}

export default Resetpass;
