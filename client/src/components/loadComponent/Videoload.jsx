import React from 'react'
import styled, { keyframes } from 'styled-components';

// Keyframes for loading animation
const skeletonAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Skeleton loader styles
const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonElement = styled.div`
  background: linear-gradient(90deg, #f0f0f0ae 25%, #e0e0e0d1 50%, #f0f0f0ae 75%);
  background-size: 200% 100%;
  animation: ${skeletonAnimation} 1.5s infinite;
  border-radius: 5px;
`;

// Video Wrapper skeleton with responsive design
const SkeletonVideoWrapper = styled(SkeletonElement)`
  width: 100%;
  height: 500px;

  @media (max-width: 1024px) {
    height: 350px;
  }

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const SkeletonTitle = styled(SkeletonElement)`
  width: 70%;
  height: 20px;
  margin: 10px 0;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const SkeletonDetails = styled(SkeletonElement)`
  width: 50%;
  height: 15px;

  @media (max-width: 768px) {
    width: 70%;
  }
`;

const SkeletonChannel = styled(SkeletonElement)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SkeletonImage = styled(SkeletonElement)`
  width: 50px;
  height: 50px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const SkeletonChannelInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SkeletonText = styled(SkeletonElement)`
  width: 100%;
  height: 15px;
`;

const SkeletonSubscribe = styled(SkeletonElement)`
  width: 100px;
  height: 30px;

  @media (max-width: 768px) {
    width: 80px;
    height: 25px;
  }
`;

const SkeletonHr = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 20px 0;
`;

const SkeletonComments = styled(SkeletonElement)`
  width: 100%;
  height: 100px;
`;

const SkeletonRecommendation = styled(SkeletonElement)`
  width: 100%;
  height: 200px;
`;

// Loading Skeleton Component




function Videoload() {
    return (
        <SkeletonWrapper>
            <SkeletonVideoWrapper />
            <SkeletonTitle />
            <SkeletonDetails />
            <SkeletonHr />
            <SkeletonChannel>
                <SkeletonImage />
                <SkeletonChannelInfo>
                    <SkeletonText />
                    <SkeletonText />
                </SkeletonChannelInfo>
            </SkeletonChannel>
            <SkeletonSubscribe />
            <SkeletonHr />
            <SkeletonComments />
            <SkeletonHr />
            <SkeletonRecommendation />
        </SkeletonWrapper>
    )
}

export default Videoload
