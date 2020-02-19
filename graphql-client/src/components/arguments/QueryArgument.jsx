import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import Condition from './Condition';

const QueryArgument = ({
  queryArg: { name, type },
  queryArgValues,
  setQueryArgValues
}) => {
  const handleInputChange = ({ target: { value } }) => {
    const argValue = queryArgValues[name] || {};
    argValue.value = value;
    setQueryArgValues({...queryArgValues, [name]: argValue});
  }

  return (
    <StyledWrapper>
      <div>{name}</div>
      <div>{type.name || type.ofType.name}</div>
      <Condition
        type={type.name || type.ofType.name}
        argName={name}
        queryArgValues={queryArgValues}
        setQueryArgValues={setQueryArgValues}
      />
      <Input
        placeholder='Input value'
        value={queryArgValues[name] ? queryArgValues[name].value : ''}
        onChange={handleInputChange}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1.5fr;
  grid-column-gap: 8px;
  align-items: center;
`;

export default QueryArgument;