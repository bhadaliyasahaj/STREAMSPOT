import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import Commentload from "./loadComponent/Commentload";
import DeleteButton from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import Person from "@mui/icons-material/Person4";
import axiosInstance from "../utils/axiosInstance.js";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  position: relative;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
  cursor: pointer;
`;

const Comment = ({ comment, onDelete }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [allowDelete, setAllowDelete] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const API_URL = process.env.REACT_APP_API_URI;

  // console.log(currentVideo,currentUser);
  const handleRightClick = () => {
    if (
      currentUser._id === comment.userId ||
      currentUser._id === currentVideo.userId
    ) {
      setAllowDelete(!allowDelete);
    }
  };

  const handleCommentDelete = async () => {
    const res = await axiosInstance.delete(`/comments/${comment._id}`);
    console.log(res.data);
    setLoading(true);
    onDelete(comment._id);
    setLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      await axiosInstance.get(`/users/find/${comment.userId}`).then((res) => {
        setUser(res.data);
        setLoading(false);
      });
    };
    getUser();
  }, [comment.userId, setLoading]);

  return (
    <>
      {loading ? (
        <Commentload />
      ) : (
        <Container>
          {user.img ? (
            <Avatar src={user.img} />
          ) : (
            <Person
              style={{
                width: "40px",
                height: "40px",
                color: "gray",
                borderRadius: "50%",
                border: "1px solid white",
              }}
            />
          )}
          <Details>
            <Name>
              {user.name} <Date>{format(comment.createdAt)}</Date>
            </Name>
            <Text onClick={handleRightClick}>{comment.desc}</Text>
            {allowDelete && (
              <DeleteButton
                style={{
                  position: "absolute",
                  right: "50px",
                  cursor: "pointer",
                }}
                onClick={handleCommentDelete}
              />
            )}
          </Details>
        </Container>
      )}
    </>
  );
};

export default Comment;
