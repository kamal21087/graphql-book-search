import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/NavBar';

// Apollo Client imports
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Create Apollo Client
const client = new ApolloClient({
  uri: '/graphql', // GraphQL endpoint
  cache: new InMemoryCache(), // Caching mechanism
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
