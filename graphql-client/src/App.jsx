import React, { useEffect, useState } from 'react';
import './App.css';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { GET_GRAPHQL_SCHEMA } from './queries/queries';
import styled from 'styled-components';
import { Layout, Select, Button, Tree } from 'antd';
import QueryArguments from './components/arguments/QueryArguments';
import QueryViewer from './components/query/QueryViewer';
import Filters from './components/filters/Filters';

const { Header, Content } = Layout;
const { Option } = Select;
const { TreeNode } = Tree;

const initialState = {
  expandedKeys: [],
  autoExpandParent: true,
  checkedKeys: [],
  selectedKeys: [],
  selectedFields: [],
  queryResult: null,
  queryArgValues: {},
  selectedFilters: {}
}

const App = () => {
  const [fetching, setFetching] = useState(false);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryTree, setQueryTree] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState(initialState.expandedKeys);
  const [autoExpandParent, setAutoExpandParent] = useState(initialState.autoExpandParent);
  const [checkedKeys, setCheckedKeys] = useState(initialState.checkedKeys);
  const [selectedKeys, setSelectedKeys] = useState(initialState.selectedKeys);
  const [selectedFields, setSelectedFields] = useState(initialState.selectedFields);
  const [showQueryArgs, setShowQueryArgs] = useState(false);
  const [queryArgValues, setQueryArgValues] = useState(initialState.queryArgValues);
  const [gqlQueryText, setGqlQueryText] = useState('');
  const [showGqlQuery, setShowGqlQuery] = useState(false);
  const [queryResult, setQueryResult] = useState(initialState.queryResult);
  const [selectedFilters, setSelectedFilters] = useState(initialState.selectedFilters);
  const [allFilters, setAllFilters] = useState([]);
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const client = useApolloClient();
  const { data: schema } = useQuery(GET_GRAPHQL_SCHEMA);


  useEffect(() => {
    if (schema) {
      const graphqlQueries = schema['__schema'].types
        .find(type => type.name === 'Query').fields
        .map(f => ({...f, gqlType: 'query'}));
      const graphqlMutations = schema['__schema'].types
        .find(type => type.name === 'Mutation').fields
        .map(f => ({...f, gqlType: 'mutation'}));
      setQueries([...graphqlQueries, ...graphqlMutations]);
    }
  }, [schema]);

  useEffect(() => {
    calculateQuery();
  }, [selectedFields, queryArgValues, selectedFilters]);

  useEffect(() => {
    setQueryArgValues(initialState.queryArgValues);
    setSelectedFilters(initialState.selectedFilters);
    calculateQuery();
  }, [selectedQuery]);

  const showFilters = () => setFiltersVisible(true);

  const hideFilters = () => setFiltersVisible(false);

  const changeSelectedFilters = (filterName, filterValue) => {
    const newSelectedFilters = { ...selectedFilters };
    const { value, condition } = filterValue;
    if (!value || !condition) {
      delete newSelectedFilters[filterName];
    } else {
      newSelectedFilters[filterName] = filterValue;
    }
    setSelectedFilters(newSelectedFilters);
  };

  const calculateQuery = () => {
    if (selectedQuery) {
      const gqlQueryText = createGraphQLQuery();
      setGqlQueryText(gqlQueryText);
    }
  };

  const toogleShowGqlQuery = () => {
    setShowGqlQuery(!showGqlQuery);
  };

  const handleQuerySelect = selected => {
    const query = queries.find(q => q.name === selected);
    resetFieldsSelection();
    setSelectedQuery(query);
    setShowQueryArgs(
      query.args.length > 1 ||
      (query.args.length === 1 && !query.args.find(arg => arg.name === 'filter'))
    );
    setFiltersEnabled(query.args.find(arg => arg.name === 'filter'));
    createQueryTreeAndFilters(query.type.name || query.type.ofType.name);
  };

  const resetFieldsSelection = () => {
    setExpandedKeys(initialState.expandedKeys);
    setAutoExpandParent(initialState.autoExpandParent);
    setSelectedKeys(initialState.selectedKeys);
    setCheckedKeys(initialState.checkedKeys);
    setSelectedFields(initialState.selectedFields);
  };

  const createQueryTreeAndFilters = queryReturnType => {
    const dataTree = [];
    const queryFilters = [];

    const typeFields = schema['__schema'].types.find(type => type.name === queryReturnType).fields;
    typeFields.forEach(tf => {
      const type = tf.type.name ? tf.type.name : tf.type.ofType.name;
      const kind = tf.type.name ? tf.type.kind : tf.type.ofType.kind;
      dataTree.push({
        title: tf.name,
        key: tf.name,
        type,
        kind,
        children: []
      });
      if (kind === 'OBJECT') {
        fillTreeNodeAndFilters(dataTree.slice(-1)[0], queryFilters);
      } else {
        queryFilters.push({
          title: tf.name,
          key: tf.name,
          type
        });
      }
    });
    setAllFilters(queryFilters);
    setQueryTree(dataTree);
  };

  const fillTreeNodeAndFilters = (parentNode, queryFilters) => {
    const typeFields = schema['__schema'].types.find(type => type.name === parentNode.type).fields;

    typeFields.forEach(tf => {
      const type = tf.type.name ? tf.type.name : tf.type.ofType.name;
      const kind = tf.type.name ? tf.type.kind : tf.type.ofType.kind;
      parentNode.children.push({
        title: tf.name,
        key: `${parentNode.key}.${tf.name}`,
        type,
        kind,
        children: []
      });
      if (kind === 'OBJECT') {
        fillTreeNodeAndFilters(parentNode.children.slice(-1)[0], queryFilters);
      } else {
        queryFilters.push({
          title: tf.name,
          key: `${parentNode.key}.${tf.name}`,
          type
        });
      }
    });
  }

  const renderQueriesSelect = () => {
    return queries.map((q, i) =>
      <Option key={i} value={q.name}>{q.name}</Option>
    );
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

  const handleRunQuery = () => {
    if (!selectedQuery || !selectedFields.length) {
      return;
    }
    if (selectedQuery.gqlType === 'query') {
      runGQLQuery();
      return;
    }
    if (selectedQuery.gqlType === 'mutation') {
      runGQLMutation();
    }
  };

  const runGQLQuery = async () => {
    try {
      setFetching(true);
      const { data } = await client.query({
        query: gql`${gqlQueryText}`
      });
      setQueryResult(data);
      setFetching(false);
    } catch (ex) {
      setQueryResult(initialState.queryResult);
      setFetching(false);
    }
  };

  const runGQLMutation = async () => {
    try {
      setFetching(true);
      const { data } = await client.mutate({
        mutation: gql`${gqlQueryText}`
      });
      setQueryResult(data);
      setFetching(false);
    } catch (ex) {
      setQueryResult(initialState.queryResult);
      setFetching(false);
    }
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

    const queryJSON =  JSON.stringify(gqlObject, null, 2)
      .replace(new RegExp(`: "${removeValue}"`, 'g'), '')
      .replace(new RegExp('[,":]', 'g'), '');

    const queryWithArguments = addArgumentsToQuery(queryJSON);

    return selectedQuery.gqlType === 'mutation' ? `mutation ${selectedQuery.name} ${queryWithArguments}` : queryWithArguments;
  };

  const addArgumentsToQuery = query => {
    const argumentsExists = Object.keys(queryArgValues).length;
    const filtersExists = Object.keys(selectedFilters).length;
    if (!argumentsExists && !filtersExists) {
      return query;
    }
    
    const queryArguments = argumentsExists ?
      Object.entries(queryArgValues)
        .reduce((acc, val) => {
          if (!val[1].value) {
            return acc += '';
          }
          const argValue = val[1].type !== 'Int' ? `"${val[1].value}"` : val[1].value;
          return acc += `, ${val[0]}: ${argValue}`;
        }, '')
        .substring(1) :
      '';

    const filters = filtersExists ?
      `${argumentsExists ? ',' : ''}filter: "${JSON.stringify(selectedFilters).replace(/"/g, '\\"')}"` :
      '';
    
    if (!queryArguments && !filters) {
      return query;
    }
    
    return query.replace(new RegExp(`${selectedQuery.name} {`), `${selectedQuery.name} (${queryArguments}${filters}) {`);
  };

  return (
    <StyledWrapper>
      <div className='layout'>
        <Header>GraphQL Query Builder</Header>
        <div className='content'>
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
              <div className='query-select-and-filter'>
                <Select className='query-select' placeholder='Select query' onChange={handleQuerySelect}>
                  {queries.length > 0 ? renderQueriesSelect() : null}
                </Select>
                {
                  filtersEnabled &&
                  <Button
                    icon='filter'
                    className='filters-button'
                    onClick={showFilters}>
                    Show filters
                  </Button>
                }
              </div>
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
              {fetching && <h3>FETCHING</h3>}
            {
              queryResult ?
              <pre className='query-result'>{JSON.stringify(queryResult, null, 2)}</pre> :
              null
            }
            </div>
          </div>
          {
            filtersEnabled &&
            <div className={`query-filters ${filtersVisible ? 'filters-shown' : 'filters-hidden'}`}>
              <Filters
                selectedFields={allFilters}
                changeSelectedFilters={changeSelectedFilters}
                hideFilters={hideFilters} />
            </div>
          }
        </div>
        {showGqlQuery && <QueryViewer query={gqlQueryText}/>}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .layout {
    display: grid;
    grid-template-rows: 64px 1fr;
    height: 100vh;
  }

  .content {
    position: relative;
    display: grid;
    grid-template-rows: 80px 1fr;
    padding: 0 50px;
  }

  .main-content {
    display: grid;
    grid-template-columns: 500px 1fr;
    grid-column-gap: 16px;
    background-color: var(--main-bg-color);
  }

  .query-select-and-filter {
    display: flex;
    flex-direction: row;
  }

  .filters-button {
    margin-left: 8px;
  }

  .query-filters {
    position: absolute;
    height: 100%;
    width: 800px;
    padding: 0 50px;
    top: 0;
    left: 0;
    background-color: var(--main-bg-color);
    z-index: 10;
    -webkit-box-shadow: 0px 0px 35px -7px rgba(0,21,41,1);
    -moz-box-shadow: 0px 0px 35px -7px rgba(0,21,41,1);
    box-shadow: 0px 0px 35px -7px rgba(0,21,41,1);
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
    display: flex;
    align-items: center;
    background-color: var(--main-bg-color);
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

  .filters-shown {
    left: 0px;
    transition: left 0.8s;
  }

  .filters-hidden {
    left: -850px;
    transition: left 0.8s;
  }
`;

export default App;
