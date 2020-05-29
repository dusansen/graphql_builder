import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CONDITIONS = {
  String: [
    { label: 'equal', value: '$eq' },
    { label: 'not equal', value: '$neq'} ,
    { label: 'contains', value: 'contain' },
    { label: 'does not contain', value: 'not_contain' }
  ],
  Int: [
    { label: 'equal', value: '$eq' },
    { label: 'not equal', value: '$ne' },
    { label: 'less than', value: '$lt' },
    { label: 'less than or equal', value: '$lte' },
    { label: 'greater than', value: '$gt' },
    { label: 'greater than or equal', value: '$gte' }
  ],
  ID: [
    { label: 'is', value: '$eq' },
    { label: 'not', value: '$ne' }
  ]
};

const renderConditionOptions = type =>
  CONDITIONS[type].map((option, i) =>
    <Option key={i} value={option.value}>{option.label}</Option>
  );

const Condition = ({ value, type, handleConditionChange }) => {
  return (
    <Select
      value={value}
      className='condition-select'
      onChange={handleConditionChange}
      style={{width: '100%'}}>
      {renderConditionOptions(type)}
    </Select>
  );
};

export default Condition;