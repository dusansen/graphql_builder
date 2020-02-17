import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const FILTERS = {
  String: [
    'equal',
    'not equal',
    'contains',
    'does not contain',
    'starts with',
    'not starts with',
    'ends with',
    'not ends with'
  ],
  Int: [
    'equal',
    'not equal',
    'less than',
    'less than or equal',
    'greater than',
    'greater than or equal'
  ]
};

const renderFilterConditionOptions = type =>
  FILTERS[type].map((option, i) => <Option key={i} value={option}>{option}</Option>);

const FilterConditions = ({ fieldType, handleChange }) => {
  return (
    <Select
      className='filter-condition-select'
      onChange={handleChange}
      style={{width: '150px'}}>
      {renderFilterConditionOptions(fieldType)}
    </Select>
  );
};

export default FilterConditions;