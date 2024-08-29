import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
    from{
        transform: translateX(100%);
        opacity: 0;
        /* display: flex; */
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
        display: none;
    }
`;

const Container = styled.div`
  position: fixed;
  /* visibility: hidden; */
  right: 30px;
  top: 100px;
  width: 200px;
  padding: 10px 20px;
  color: #329dfa;
  border: 2px solid #329dfa;
  border-radius: 10px;
  /* display: none; */
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

function Notification({ message, visible, setVisible }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Container visible={visible}>
      <Wraper>{message}</Wraper>
    </Container>
  );
}

export default Notification;
