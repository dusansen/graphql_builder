import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';

const QueryArgument = ({
  queryArg: { name, type },
  queryArgValues,
  setQueryArgValues
}) => {
  const handleInputChange = ({ target: { value } }) => {
    const argValue = queryArgValues[name] || {};
    argValue.value = value;
    argValue.type = type.name || type.ofType.name;
    setQueryArgValues({...queryArgValues, [name]: argValue});
    return;
  };

  return (
    <StyledWrapper>
      <div>{name}</div>
      <div>{type.name || type.ofType.name}</div>
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
  grid-template-columns: 1fr 1fr 2fr;
  grid-column-gap: 8px;
  align-items: center;
  margin-bottom: 4px;
`;

export default QueryArgument;