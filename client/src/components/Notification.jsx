import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { invisible } from "../redux/notificationSlice";

const slideIn = keyframes`
    from{
        display: block;
        transform: translateX(100%);
        opacity: 0;
    }
    to{
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideOut = keyframes`
    from{
        transform: translateX(0);
        opacity: 1;
    }
    to{
        transform: translateX(100%);
        opacity: 0;
    }
`;

const Container = styled.div`
  position: fixed;
  right: 30px;
  top: 100px;
  width: 200px;
  padding: 10px 20px;
  background-color: #e74c3c; 
  color: ${({ theme }) => theme.text}; 
  border: 2px solid #c0392b; 
  border-radius: 10px;
  /* display: ${(props) => (!props.visible && "none")}; */
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${(props) => (props.visible ? slideIn : slideOut)} 0.8s ease-in-out
    forwards;
`;

const Wraper = styled.div`
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
`;

function Notification() {
  const { message, visible } = useSelector((state) => state.notification)
  const dispatch = useDispatch()
  const [display,setDisplay] = useState(visible) 
  useEffect(() => {
    setDisplay(true);
    const newtimer = setTimeout(() => {
      setDisplay(false)
    }, 3000);
    const timer = setTimeout(() => {
      dispatch(invisible())
    }, 4000);

    return () => {
    clearTimeout(timer)
    clearTimeout(newtimer)
  };
  }, [visible]);

  return (
     visible?(
      <Container visible={display} >
        <Wraper>{message}</Wraper>
      </Container>):null
  )
}

export default Notification;
