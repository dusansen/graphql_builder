import React from 'react';
import styled from 'styled-components';
import ReactJson from 'react-json-view'

const QueryResult = ({ data }) => {
return (
    <StyledWrapper>
    <div className='total'>{data.length ? `TOTAL: ${data.length}` : 'NO RESULTS FOUND'}</div>
    {
      data.map((record, i) =>
        <div className='record'><ReactJson key={i} src={record} name={false} displayObjectSize={false} /></div>)
    }
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .total {
    font-size: 14px;
    font-weight: bold;
  }

  .record {
    background: #ffffff;
    padding: 16px;
    font-size: 12px;
    margin-top: 10px;
  }
`;

export default QueryResult;