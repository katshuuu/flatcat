const gql = require('graphql-tag');

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    bio: String!
    books: [Book!]!
    createdAt: String!
  }

  type Book {
    id: ID!
    title: String!
    isbn: String!
    year: Int
    author: Author!
    authorId: ID!
    createdAt: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
  }

  type Mutation {
    createBook(title: String!, isbn: String!, year: Int, authorId: ID!): Book!
    createAuthor(name: String!, bio: String): Author!
  }
`;

module.exports = typeDefs;
