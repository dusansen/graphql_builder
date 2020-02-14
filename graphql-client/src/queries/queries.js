import gql from 'graphql-tag';

export const GET_GRAPHQL_SCHEMA = gql`
{
  __schema {
    queryType {
      name
    },
    types {
      name,
      fields {
        name,
        args {
          name,
          type {
            kind,
            ofType {
              name,
              kind
            }
          }
        },
        type {
          name,
          kind,
          ofType {
            name,
            kind
          }
        }
      }
    }
  }
}
`;