import React from 'react';
import styled from 'styled-components';
import Filter from './Filter';
import closeIcon from '../../assets/icons/close.svg';

const Filters = ({ selectedFields, changeSelectedFilters, hideFilters }) => {
  const renderFilters = () => {
    const filters = selectedFields.map((field, i) =>
      <Filter key={i} field={field} changeSelectedFilters={changeSelectedFilters} />
    );
    return <div>{filters}</div>;
  };
  return (
    <StyledWrapper>
      <div className='filters-header'>Filters</div>
      <div className='filters-column-names'>
        <div className='filter-column-label'>Field name</div>
        <div className='filter-column-label'>Condition</div>
        <div className='filter-column-label'>Value</div>
      </div>
      {selectedFields.length ? renderFilters() : null}
      <img
        src={closeIcon}
        alt='X'
        className='close-filters'
        onClick={hideFilters} />
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  display: relative;

  .filters-header {
    margin: 10px 0;
    font-size: 30px;
    font-weight: bold;
  }

  .filters-column-names {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.5fr;
    grid-column-gap: 8px;
    margin-bottom: 8px;
  }

  .filter-column-label {
    font-size: 16px;
    font-weight: bold;
  }

  .close-filters {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
`;
export default Filters; 