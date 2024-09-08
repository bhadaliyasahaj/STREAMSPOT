import { style } from '@mui/system'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components'
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
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.6); 
`;

const PopupBox = styled.div`
    width: 40%;
    padding: 20px;
    background-color: ${({ theme }) => theme.soft};
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    /* text-align: center; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
    width: 90%;
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    width: 93%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const Paragraph = styled.p`
    font-size: 16px;
    width: 90%;
    color: ${({ theme }) => theme.text};
    margin: 10px 0 20px 0;
    line-height: 1.5;
`;

const Close = styled.p`
    align-self: flex-end;
    font-size: 1.3rem;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
`;

function Forgotpass({ setForgot }) {
    const [email, setEmail] = useState("")
    const dispatch = useDispatch()

    const handleReset = async() => {
        if(email){
            try{
                const res = await axiosInstance.post('/auth/forgotpass',{email})
                // console.log(res);
                dispatch(setmessage(res.data))
            }catch(err){
                dispatch(setmessage(err.response.data.message))
            }
        }
    }

    return (
        <>
            <Container>
                <PopupBox>
                    <Close onClick={() => setForgot(false)}>X</Close>
                    <Title>Forgot Password</Title>
                    <Paragraph>
                        Don't worry! Just enter your email address below and we will send you a link to reset your password.
                        Make sure to check your inbox (or spam folder) for further instructions.
                    </Paragraph>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleReset}>Send Reset Link</Button>
                    <Paragraph>
                        If you’re having trouble, please contact support.
                    </Paragraph>
                </PopupBox>
            </Container>
        </>
    )
}

export default Forgotpass
