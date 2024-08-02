import React from 'react';
import styled, { keyframes } from 'styled-components';

const skeletonAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const SkeletonAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
`;

const SkeletonDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const SkeletonName = styled.div`
  width: 50%;
  height: 13px;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
`;

const SkeletonDate = styled.div`
  width: 30%;
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
  margin-left: 5px;
`;

const SkeletonText = styled.div`
  width: 80%;
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
`;

const Commentload = () => (
  <SkeletonContainer>
    <SkeletonAvatar />
    <SkeletonDetails>
      <SkeletonName />
      <SkeletonDate />
      <SkeletonText />
    </SkeletonDetails>
  </SkeletonContainer>
);

export default Commentload;
