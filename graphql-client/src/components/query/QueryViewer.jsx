import React from 'react';
import styled from 'styled-components';

const QueryViewer = ({ query }) => {
  return (
    <StyledWrapper>
      {query}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.pre`
  position: fixed;
  top: 130px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #001529;
  color: #ffffff;
  padding: 50px;
`;

export default QueryViewer;