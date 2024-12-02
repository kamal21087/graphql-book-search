import { UserInputError, AuthenticationError } from 'apollo-server-express';
import User, { IUser } from '../models/User.js'; // Import User model and IUser interface
import { signToken } from '../services/auth.js'; // Import signToken function

// Define context type for resolvers
interface ContextType {
  user?: IUser; // User context type uses the IUser interface
}

// Arguments for adding a user
interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

// Arguments for user login
interface LoginArgs {
  email: string;
  password: string;
}

// Arguments for saving a book
interface SaveBookArgs {
  book: {
    bookId: string;
    authors?: string[];
    title: string;
    description?: string;
    image?: string;
    link?: string;
  };
}

// Arguments for removing a book
interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    // Query to get the current user
    me: async (_parent: unknown, _args: unknown, context: ContextType) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const user = await User.findById(context.user._id);
      if (!user) {
        throw new UserInputError('User not found');
      }
      return user;
    },
  },
  Mutation: {
    // Mutation to add a new user
    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id.toString());
      return { token, user };
    },
    // Mutation for user login
    login: async (_parent: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new UserInputError('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id.toString());
      return { token, user };
    },
    // Mutation to save a book to the user's profile
    saveBook: async (_parent: unknown, { book }: SaveBookArgs, context: ContextType) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new UserInputError('Failed to save book');
      }

      return updatedUser;
    },
    // Mutation to remove a book from the user's profile
    removeBook: async (_parent: unknown, { bookId }: RemoveBookArgs, context: ContextType) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new UserInputError('Failed to remove book');
      }

      return updatedUser;
    },
  },
};

export default resolvers;
