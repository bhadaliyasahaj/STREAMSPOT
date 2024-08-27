import React from 'react'
import styled, { keyframes } from 'styled-components';

// Skeleton animation
const skeletonAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Skeleton styles
const SkeletonContainer = styled.div`
  width: 300px;
  /* margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")}; */
  /* display: ${(props) => props.type === "sm" && "flex"}; */
  gap: 10px;
`;

const SkeletonImage = styled.div`
  width: 240px;
  height: 160px;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
  border-radius: 19px;
`;

const SkeletonDetails = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;


const SkeletonTexts = styled.div`
  flex: 1;
`;

const SkeletonTitle = styled.div`
  width: 70%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
  margin-bottom: 10px;
`;


function Playlistload() {
    return (
        <SkeletonContainer>
            <SkeletonImage/>
            <SkeletonDetails>
                <SkeletonTexts>
                    <SkeletonTitle />
                </SkeletonTexts>
            </SkeletonDetails>
        </SkeletonContainer>
    )
}

export default Playlistload
