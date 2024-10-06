import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../utils/axiosInstance.js";
import { useDispatch } from "react-redux";
import { setmessage } from "../redux/notificationSlice.js";
import Loader from "react-spinners/PropagateLoader.js";

const PlaylistPopup = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000037;
  z-index: 1000;
`;

const CenterBox = styled.div`
  position: relative;
  width: 30%;
  padding: 50px 20px;
  /* height: 40%; */
  background-color: ${({ theme }) => theme.soft};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const PlaylistList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  overflow-y: auto;
  max-height: 50%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
`;

const PlaylistItem = styled.li`
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${({ theme, active }) => (active ? "#4d7a4f" : theme.bg)};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* width: 100%; */
`;

const CreatePlaylistInput = styled.input`
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  flex: 2;
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const Close = styled.button`
  width: fit-content;
  cursor: pointer;
  position: absolute;
  top: 20px;
  font-size: 20px;
  right: 20px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: none;
`;

const Notice = styled.p`
  padding: 0 20px;
  color: ${({ theme }) => theme.textSoft};
`;

const CreatePlaylistContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`;

const TypeButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  box-shadow: 2px 2px 2px 1px #00000023;
  cursor: pointer;
`;

const PlaylistContainer = styled.p`
  font-size: 0.9rem;
`;

const PlaylistType = styled.p`
  font-size: 0.8rem;
  color: ${({theme})=>theme.textSoft};
`;

function Playlistpopup({ setSave, vidId }) {
  const [playlists, setPlaylists] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState("");
  const [active, setActive] = useState([]);
  const [plytype, setplyType] = useState("PUBLIC");
  const dispatch = useDispatch();

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const res = await axiosInstance.get("/playlist/get");
        console.log(res.data);
        setPlaylists(res.data.playlists);
      } catch (err) {
        console.log(err);
      }
    };
    getPlaylists();
  }, [newPlaylist]);

  const handleCreatePlaylist = async () => {
    try {
      if (active.length > 0) {
        const res = await axiosInstance.put(`/playlist/add/${vidId}`, active);
        console.log(res);
        dispatch(setmessage("Playlist Updated"));
        setSave(false);
      } else if (plytype) {
        const res = await axiosInstance.post("/playlist/create", {
          name: newPlaylist,
          type: plytype
        });
        console.log(res);
        setNewPlaylist("");
        dispatch(setmessage("Playlist Created"));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelection = async (playlistId) => {
    if (active.includes(playlistId)) {
      setActive(active.filter((id) => id !== playlistId));
    } else {
      setActive([...active, playlistId]);
    }
  };

  const handlePlaylistType = () => {
    if (plytype === "PRIVATE") {
      setplyType("PUBLIC");
    } else if (plytype === "PUBLIC") {
      setplyType("PRIVATE");
    }
  };

  return (
    <PlaylistPopup>
      <CenterBox>
        <Close onClick={() => setSave(false)}>X</Close>
        <Title>Select or Create Playlist</Title>
        <PlaylistList>
          {playlists ? (
            playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <PlaylistItem key={index}
                  onClick={() => handleSelection(playlist._id)}
                  active={active.includes(playlist._id)}>
                  <PlaylistContainer>
                    {playlist.name}
                  </PlaylistContainer>
                  <PlaylistType>{playlist.type}</PlaylistType>
                </PlaylistItem>
              ))
            ) : (
              <Notice>No Playlists Yet</Notice>
            )
          ) : (
            <Loader
              color="red"
              style={{ alignSelf: "center", margin: "20px 0px" }}
            />
          )}
        </PlaylistList>
        <CreatePlaylistContainer>
          <CreatePlaylistInput
            type="text"
            placeholder="Create new playlist"
            value={newPlaylist}
            onChange={(e) => setNewPlaylist(e.target.value)}
            onFocus={() => setActive([])}
          />
          <TypeButton onClick={handlePlaylistType} title={`Port To ${plytype === "PRIVATE" ? "Public" : "Private"}`}>{plytype}</TypeButton>
        </CreatePlaylistContainer>
        <Button onClick={handleCreatePlaylist}>
          {active.length > 0 ? "Add To Playlist" : "Create Playlist"}
        </Button>
      </CenterBox>
    </PlaylistPopup>
  );
}

export default Playlistpopup;
