import React, { useEffect, useState } from 'react';
import './App.css';
import { useQuery } from '@apollo/react-hooks';
import { GET_GRAPHQL_SCHEMA } from './queries/queries';
import styled from 'styled-components';
import { Layout, Select, Button, Tree } from 'antd';
import Filter from './components/filters/Filter';
import Filters from './components/filters/Filters';

const { Header, Content } = Layout;
const { Option } = Select;
const { TreeNode } = Tree;

const initialState = {
  expandedKeys: [],
  autoExpandParent: true,
  checkedKeys: [],
  selectedKeys: [],
  selectedFields: []
}

const App = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryTree, setQueryTree] = useState(null);
  const [queryReturnType, setQueryReturnType] = useState(null);
  const { data: schema } = useQuery(GET_GRAPHQL_SCHEMA);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    if (schema) {
      const graphqlQueries = schema['__schema'].types.find(type => type.name === 'Query');
      setQueries(graphqlQueries.fields);
    }
  }, [schema]);

  useEffect(() => {
    console.log('selectedFields changed', selectedFields);
  }, [selectedFields]);

  const handleQuerySelect = selected => {
    const query = queries.find(q => q.name === selected);
    resetFieldsSelection();
    setSelectedQuery(query);
    setQueryReturnType(query.type.name || query.type.ofType.name);
    createQueryTree(query.type.name || query.type.ofType.name);
  };

  const resetFieldsSelection = () => {
    setExpandedKeys(initialState.expandedKeys);
    setAutoExpandParent(initialState.autoExpandParent);
    setSelectedKeys(initialState.selectedKeys);
    setCheckedKeys(initialState.checkedKeys);
    setSelectedFields(initialState.selectedFields);
  };

  const createQueryTree = queryReturnType => {
    const dataTree = [];

    const typeFields = schema['__schema'].types.find(type => type.name === queryReturnType).fields;
    typeFields.forEach(tf => {
      const type = tf.type.name ? tf.type.name : tf.type.ofType.name;
      dataTree.push({
        title: tf.name,
        key: tf.name,
        type,
        kind: tf.type.kind,
        children: []
      });
      const kind = tf.type.name ? tf.type.kind : tf.type.ofType.kind;
      if (kind === 'OBJECT') {
        fillTreeNode(dataTree.slice(-1)[0]);
      }
    });
    setQueryTree(dataTree);
  };

  const fillTreeNode = parentNode => {
    const typeFields = schema['__schema'].types.find(type => type.name === parentNode.type).fields;

    typeFields.forEach(tf => {
      const type = tf.type.name ? tf.type.name : tf.type.ofType.name;
      parentNode.children.push({
        title: tf.name,
        key: `${parentNode.key}.${tf.name}`,
        type,
        kind: tf.type.kind,
        children: []
      });
      const kind = tf.type.name ? tf.type.kind : tf.type.ofType.kind
      if (kind === 'OBJECT') {
        fillTreeNode(parentNode.children.slice(-1)[0]);
      }
    });
  }

  const renderQueriesSelect = () => {
    return queries.map((q, i) => <Option key={i} value={q.name} className='query-option'>{q.name}</Option>);
  };

  const renderQueryTree = treeData => treeData.map(item => {
    if (item.children.length) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderQueryTree(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} />
  });

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (keys, { checked, node: { props } }) => {
    setCheckedKeys(keys);
    const newSelectedFields = [...selectedFields];
    if (checked) {
      addToSelectedFields(newSelectedFields, props.dataRef || props);
    } else {
      removeFromSelectedFields(newSelectedFields, props.dataRef || props);
    }
    setSelectedFields(newSelectedFields);
  };

  const addToSelectedFields = (newSelectedFields, node) => {
    if (node.children.length) {
      node.children.forEach(child => addToSelectedFields(newSelectedFields, child));
      return;
    }
    if (!newSelectedFields.find(n => n.key === node.key)) {
      newSelectedFields.push(node);
    }
  };

  const removeFromSelectedFields = (newSelectedFields, node) => {
    if (!node.children.length) {
      const nodeIndex = newSelectedFields.findIndex(n => n.key === node.key || n.key === node.eventKey);
      newSelectedFields.splice(nodeIndex, 1);
    }
    node.children.forEach(child => removeFromSelectedFields(newSelectedFields, child));
  };

  const onSelect = selectedKeys => {
    setSelectedKeys(selectedKeys);
  };

  return (
    <StyledWrapper>
      <Layout>
        <Header>GraphQL Query Builder</Header>
        <Content>
          <div className='run-query'>
            <Button icon='caret-right'>Run Query</Button>
            <Button icon='codepen' className='query-code-button'>See Query</Button>
          </div>
          <div className='main-content'>
            <div className='query-maker'>
              <h3>Query Selection</h3>
              <Select className='query-select' placeholder='Select query' onChange={handleQuerySelect}>
                {queries.length > 0 ? renderQueriesSelect() : null}
              </Select>
              {queryTree ? (
                <Tree
                  checkable
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}>
                  {renderQueryTree(queryTree)}
                </Tree>
              ) : null}
            </div>
            <div className='query-filters'>
              <Filters selectedFields={selectedFields} />
            </div>
            <div className='query-results'>QUERY RESULTS: {queryReturnType}</div>
          </div>
        </Content>
      </Layout>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .main-content {
    display: grid;
    grid-template-columns: 1.5fr 1.5fr 2fr;
    background-color: var(--main-bg-color);
    padding: 25px 50px;
  }

  .main-content,
  .run-query,
  .query-select,
  .run-query button {
    font-size: 16px;
    font-size: 16px;
    letter-spacing: 0.05em;
  }

  .run-query {
    padding: 20px 50px 0 50px;
  }

  .query-select {
    width: 300px;
  }

  .query-select,
  .run-query button {
    font-weight: 500;
  }

  .query-option {
    color: #000000;
    font-size: 14px;
  }

  .query-code-button {
    margin-left: 16px;
  }
`;

export default App;
