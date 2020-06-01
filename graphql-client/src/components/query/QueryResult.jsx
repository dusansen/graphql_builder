import React from 'react';
import styled from 'styled-components';
import ReactJson from 'react-json-view'

const QueryResult = ({ data }) => {
return (
    <StyledWrapper>
    <div className='total'>TOTAL: {data.length}</div>
    {
      data.map(record =>
        <div className='record'><ReactJson src={record} name={false} displayObjectSize={false} /></div>)
    }
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .total {
    font-size: 14px;
  }

  .record {
    background: #ffffff;
    padding: 16px;
    font-size: 12px;
    margin-top: 10px;
  }
`;

export default QueryResult;