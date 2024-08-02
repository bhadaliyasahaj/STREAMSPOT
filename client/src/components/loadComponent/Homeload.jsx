import React from 'react';
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
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
`;

const SkeletonDetails = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const SkeletonChannelImage = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
  display: ${(props) => props.type === "sm" && "none"};
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

const SkeletonChannelName = styled.div`
  width: 50%;
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
  margin-bottom: 9px;
`;

const SkeletonInfo = styled.div`
  width: 60%;
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
`;




function Homeload() {
    return (
        <SkeletonContainer >
            <SkeletonImage  />
            <SkeletonDetails >
                <SkeletonChannelImage  />
                <SkeletonTexts>
                    <SkeletonTitle />
                    <SkeletonChannelName />
                    <SkeletonInfo />
                </SkeletonTexts>
            </SkeletonDetails>
        </SkeletonContainer>
    )
}

export default Homeload
