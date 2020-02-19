import React, { useEffect, useState } from 'react';
import './App.css';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { GET_GRAPHQL_SCHEMA } from './queries/queries';
import styled from 'styled-components';
import { Layout, Select, Button, Tree } from 'antd';
import QueryArguments from './components/arguments/QueryArguments';
import QueryViewer from './components/query/QueryViewer';

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
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [showQueryArgs, setShowQueryArgs] = useState(false);
  const [queryArgValues, setQueryArgValues] = useState({});
  const [gqlQuery, setGqlQuery] = useState('');
  const [showGqlQuery, setShowGqlQuery] = useState(false);
  const [queryResult, setQueryResult] = useState(null);

  const client = useApolloClient();
  const { data: schema } = useQuery(GET_GRAPHQL_SCHEMA);


  useEffect(() => {
    if (schema) {
      const graphqlQueries = schema['__schema'].types.find(type => type.name === 'Query');
      setQueries(graphqlQueries.fields);
    }
  }, [schema]);

  useEffect(() => {
    if (selectedQuery) {
      const gqlQuery = createGraphQLQuery();
      setGqlQuery(gqlQuery);
    }
  }, [selectedFields]);

  const toogleShowGqlQuery = () => {
    setShowGqlQuery(!showGqlQuery);
  };

  const handleQuerySelect = selected => {
    const query = queries.find(q => q.name === selected);
    resetFieldsSelection();
    setSelectedQuery(query);
    setShowQueryArgs(query.args.length > 0);
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
    if (!newSelectedFields.find(n => {
      const nKey = n.key || n.eventKey;
      const nodeKey = node.key || node.eventKey
      return nKey === nodeKey;
    })) {
      newSelectedFields.push(node);
    }
  };

  const removeFromSelectedFields = (newSelectedFields, node) => {
    if (!node.children.length) {
      const nodeIndex = newSelectedFields.findIndex(n => {
        const nKey = n.key || n.eventKey;
        const nodeKey = node.key || node.eventKey;
        return nKey === nodeKey;
      });
      newSelectedFields.splice(nodeIndex, 1);
    }
    node.children.forEach(child => removeFromSelectedFields(newSelectedFields, child));
  };

  const onSelect = selectedKeys => {
    setSelectedKeys(selectedKeys);
  };

  const handleRunQuery = async () => {
    if (!selectedQuery || !selectedFields.length) {
      return;
    }
    const gqlQuery = createGraphQLQuery();
    setGqlQuery(gqlQuery);
    const { data } = await client.query({
      query: gql`${gqlQuery}`
    })
    setQueryResult(data);
  };

  const createGraphQLQuery = () => {
    let gqlParamsObject = {};
    const removeValue = '__remove__';
    selectedFields.forEach(field => {
      const fieldKey = field.key || field.eventKey;
      if (fieldKey.split('.').length === 1) {
        gqlParamsObject[fieldKey] = removeValue;
      } else {
        const keys = fieldKey.split('.');
        let child = gqlParamsObject;
        const pom = child;
        keys.forEach((k, i) => {
          if (i + 1 < keys.length) {
            child[k] = child[k] || {};
          } else {
            child[k] = child[k] || removeValue;
          }
          child = child[k];
        });
        gqlParamsObject = {...gqlParamsObject, ...pom};
      }
    });

    const gqlObject = {
      [selectedQuery.name]: gqlParamsObject
    };

    return JSON.stringify(gqlObject, null, 2)
      .replace(new RegExp(`: "${removeValue}"`, 'g'), '')
      .replace(new RegExp('[,":]', 'g'), '');
  };

  return (
    <StyledWrapper>
      <Layout>
        <Header>GraphQL Query Builder</Header>
        <Content>
          <div className='run-query'>
            <Button
              icon='caret-right'
              onClick={handleRunQuery}>
                Run Query
            </Button>
            <Button
              icon='codepen'
              className='query-code-button'
              onClick={toogleShowGqlQuery}>
                {showGqlQuery ? 'Hide Query' : 'Show Query'}
            </Button>
          </div>
          <div className='main-content'>
            <div className='query-maker'>
              <h3>Query Selection</h3>
              <Select className='query-select' placeholder='Select query' onChange={handleQuerySelect}>
                {queries.length > 0 ? renderQueriesSelect() : null}
              </Select>
              {
                queryTree ? (
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
                ) : null
              }
              {
                showQueryArgs &&
                <QueryArguments
                  queryArgs={selectedQuery.args}
                  queryArgValues={queryArgValues}
                  setQueryArgValues={setQueryArgValues}
                />
              }
            </div>
            <div>
              <h3>QUERY RESULTS</h3>
            {
              queryResult ?
              <pre className='query-result'>{JSON.stringify(queryResult, null, 2)}</pre> :
              null
            }
            </div>
          </div>
        </Content>
        {(showGqlQuery && gqlQuery) && <QueryViewer query={gqlQuery}/>}
      </Layout>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .main-content {
    display: grid;
    grid-template-columns: 2fr 3fr;
    grid-column-gap: 16px;
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

  .query-result {
    font-size: 12px;
  }
`;

export default App;
