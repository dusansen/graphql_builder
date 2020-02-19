import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CONDITIONS = {
  String: [
    { label: 'equal', value: 'eq' },
    { label: 'not equal', value: 'neq'} ,
    { label: 'contains', value: 'contains' },
    { label: 'does not contain', value: 'does_not_contain' },
    { label: 'starts with', value: 'starts_with' },
    { label: 'not starts with', value: 'not_starts_with' },
    { label: 'ends with', value: 'ends_with' },
    { label: 'not ends with', value: 'not_ends_with' }
  ],
  Int: [
    { label: 'equal', value: 'eq' },
    { label: 'not equal', value: 'neq' },
    { label: 'less than', value: 'lt' },
    { label: 'less than or equal', value: 'lte' },
    { label: 'greater than', value: 'gt' },
    { label: 'greater than or equal', value: 'gte' }
  ]
};

const renderConditionOptions = type =>
  CONDITIONS[type].map((option, i) =>
    <Option key={i} value={option.value}>{option.label}</Option>
  );

const Condition = ({ type, argName, queryArgValues, setQueryArgValues }) => {
  const handleConditionChange = value => {
    const argValue = queryArgValues[argName] || {};
    argValue.condition = value;
    setQueryArgValues({...queryArgValues, [argName]: argValue});
  };

  return (
    <Select
      className='condition-select'
      onChange={handleConditionChange}
      style={{width: '100%'}}>
      {renderConditionOptions(type)}
    </Select>
  );
};

export default Condition;