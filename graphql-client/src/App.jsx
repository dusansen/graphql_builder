import React, { useEffect, useState } from 'react';
import './App.css';
import { useQuery } from '@apollo/react-hooks';
import { GET_GRAPHQL_SCHEMA } from './queries/queries';
import styled from 'styled-components';
import { Layout, Select, Button, Tree } from 'antd';

const { Header, Content } = Layout;
const { Option } = Select;
const { TreeNode } = Tree;

const App = () => {
  const [ queries, setQueries ] = useState([]);
  const [ selectedQuery, setSelectedQuery ] = useState(null);
  const [ queryTree, setQueryTree ] = useState(null);
  const [ queryReturnType, setQueryReturnType ] = useState(null)
  const { data: schema } = useQuery(GET_GRAPHQL_SCHEMA);

  useEffect(() => {
    if (schema) {
      const graphqlQueries = schema['__schema'].types.find(type => type.name === 'Query');
      setQueries(graphqlQueries.fields);
    }
  }, [schema]);

  const handleQuerySelect = selected => {
    const query = queries.find(q => q.name === selected);
    setSelectedQuery(query);
    setQueryReturnType(query.type.name || query.type.ofType.name);
    createQueryTree(query.type.name || query.type.ofType.name);
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
        key: `${parentNode.key}-${tf.name}`,
        type,
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
            <div className='main-left'>
              <Select className='query-select' placeholder='Select query' onChange={handleQuerySelect}>
                {queries.length > 0 ? renderQueriesSelect() : null}
              </Select>
              {queryTree ? (
                <Tree checkable>
                  {renderQueryTree(queryTree)}
                </Tree>
              ) : null}
            </div>
            <div className='main-right'>QUERY RESULTS: {queryReturnType}</div>
          </div>
        </Content>
      </Layout>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
    width: 350px;
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
