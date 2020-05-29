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

  const filterName = useMemo(() => eventKey || key, [eventKey, key]);

  const clearFilter = () => {
    setCondition(null);
    setValue('');
  };

  const handleConditionChange = value => setCondition(value);

  const handleInputChange = ({ target: { value } }) => setValue(value);

  return (
    <StyledWrapper className='filter-grid'>
      <div>{filterName}</div>
      <Condition type={type} handleConditionChange={handleConditionChange} value={condition} />
      <Input value={value} placeholder="Filter value" onChange={handleInputChange} />
      <div className='clear-filter' onClick={clearFilter}>Clear</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  margin-bottom: 4px;

  .clear-filter {
    display: flex;
    align-items: center;
    color: #ee6c4d;
    cursor: pointer;
  }

  .clear-filter:hover {
    font-weight: bold;
  }
`;

export default Filter; 