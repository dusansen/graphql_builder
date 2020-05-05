import React from 'react';
import styled from 'styled-components';
import Condition from './Condition';
import { Input } from 'antd';

const Filter = ({ field: { eventKey, key, type } }) => {
  return (
    <StyledWrapper>
      <div>
        {eventKey || key}
      </div>
      <Condition type={type} />
      <Input placeholder="Filter value" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 8px;
  margin-bottom: 4px;
`;

export default Filter; 