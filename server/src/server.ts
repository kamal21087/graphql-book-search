import express, { Application } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { authenticateToken } from './services/auth.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express() as Application;
const PORT = process.env.PORT || 3001;

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Initialize Apollo Server
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Add user information to the context if authenticated
      const token = req.headers.authorization || '';
      const user = authenticateToken(token);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as unknown as express.Application });

  // Start the database and server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL endpoint at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Start the Apollo Server
startApolloServer();
