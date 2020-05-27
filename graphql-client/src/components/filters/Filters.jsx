import React from 'react';
import styled from 'styled-components';
import Filter from './Filter';

const Filters = ({ selectedFields }) => {
  const renderFilters = () => {
    const filters = selectedFields.map((field, i) => <Filter key={i} field={field}/>);
    return <div>{filters}</div>;
  };
  return (
    <StyledWrapper>
      <h3>Filters</h3>
      <div className='filters-header'>
        <div className='filter-header-label'>Field name</div>
        <div className='filter-header-label'>Condition</div>
        <div className='filter-header-label'>Value</div>
      </div>
      {selectedFields.length ? renderFilters() : null}
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  .filters-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 8px;
    margin-bottom: 8px;
  }
  .filter-header-label {
    font-size: 16px;
    font-weight: bold;
  }
`;
export default Filters; 