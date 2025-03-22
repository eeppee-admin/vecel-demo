import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import User from '../models/user';
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
  }

  type Query {
    users(limit: Int = 10): [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(username: String!, password: String!): User!
  }

  type Subscription {
    userCreated: User!
  }
`;

const resolvers = {
    Query: {
        users: async (_, { limit }) => {
            return User.getAllUsers().limit(limit);
        },
        user: async (_, { id }) => {
            return User.findById(id);
        }
    },
    Mutation: {
        createUser: async (_, { username, password }) => {
            try {
                const userId = await User.create({ username, password });
                return User.findById(userId);
            } catch (e) {
                throw new Error('创建用户失败');
            }
        }
    },
    Subscription: {
        userCreated: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['USER_CREATED'])
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
        auth: req.headers.authorization,
        pubsub // 添加pubsub到上下文
    })
});
export default server;
