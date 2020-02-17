import React from 'react';
import styled from 'styled-components';
import FilterConditions from './FilterConditions';
import { Input } from 'antd';

const Filter = ({ field: { eventKey, key, type } }) => {
  return (
    <StyledWrapper>
      <div>
        {eventKey || key}
      </div>
      <FilterConditions fieldType={type}/>
      <Input placeholder="Filter value" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 4px;
`;

export default Filter;