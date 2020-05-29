import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Condition from './Condition';
import { Input } from 'antd';

const Filter = ({ field: { eventKey, key, type }, changeSelectedFilters }) => {
  const [condition, setCondition] = useState(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    changeSelectedFilters(filterName, { value, condition, type });
  }, [value, condition]);

  const filterName = useMemo(() => eventKey || key, [eventKey, key])

  const handleConditionChange = value => setCondition(value);

  const handleInputChange = ({ target: { value } }) => setValue(value);

  return (
    <StyledWrapper>
      <div>{filterName}</div>
      <Condition type={type} handleConditionChange={handleConditionChange}/>
      <Input value={value} placeholder="Filter value" onChange={handleInputChange} />
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