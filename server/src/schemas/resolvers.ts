import { UserInputError, AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js'; // Import User model
import { signToken } from '../services/auth.js'; // Import signToken function

interface ContextType {
  user?: { _id: string };
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

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

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: ContextType) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const user = await User.findById(context.user._id);
      if (!user) {
        throw new UserInputError('User not found');
      }
      return user;
    },
  },
  Mutation: {
    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (_parent: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new UserInputError('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: unknown, { book }: SaveBookArgs, context: ContextType) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
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
    removeBook: async (_parent: unknown, { bookId }: RemoveBookArgs, context: ContextType) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
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
