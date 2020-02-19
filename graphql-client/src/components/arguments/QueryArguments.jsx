import React from 'react';
import styled from 'styled-components';
import QueryArgument from './QueryArgument';

const QueryArguments = ({ queryArgs, queryArgValues, setQueryArgValues }) => {
  return (
    <StyledWrapper>
      <h3>Query Arguments</h3>
      <div className='arguments-header'>
        <h4>Name</h4>
        <h4>Type</h4>
        <h4>Condition</h4>
        <h4>Value</h4>
      </div>
      {queryArgs.map((arg, i) =>
        <QueryArgument
          key={i}
          queryArg={arg}
          queryArgValues={queryArgValues}
          setQueryArgValues={setQueryArgValues}
        />
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  margin-top: 10px;

  .arguments-header {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1.5fr;
    grid-column-gap: 8px;
  }
`;

export default QueryArguments;