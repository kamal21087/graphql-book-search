# GraphQL Book Search App
This is a full-stack application that allows users to search for and save books using a GraphQL API. The app is built with a Node.js/Express.js backend and a React frontend, and it uses MongoDB Atlas for the database.

### Features
- Search for books using the Google Books API.
- Save books to a personal profile.
- User authentication with JWT.
- GraphQL API for querying and mutating data.

### Technologies Used
- **Backend**: Node.js, Express.js, Apollo Server, GraphQL
- **Frontend**: React, Vite, Apollo Client
- **Database**: MongoDB Atlas
- **Hosting**: Render

### Getting Started
#### Prerequisites
- Node.js installed locally
- MongoDB Atlas account

#### Installation
1. Clone the repository:
```
git clone https://github.com/kamal21087/graphql-book-search.git
```

2. Navigate to the project directory:
```
cd graphql-book-search
```

3. Install dependencies for the backend and frontend:
```
cd server
npm install
cd ../client
npm install
```

#### Environment Variables
Create a `.env` file in the `server` directory with the following variables:
```
env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret
```

Replace `username`, `password`, `cluster`, and `dbname` with your MongoDB Atlas credentials.

#### Running the Application Locally
1. Start the backend:
```
cd server
npm run dev
```

2. Start the frontend:
```
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`.

#### Deployment
The app is deployed using Render.

- Frontend: [Live Site](https://graphql-book-search-gg90.onrender.com/)
- Backend: [GraphQL Endpoint](https://graphql-book-search-backend.onrender.com)
- Screenshot: ![Screenshot 2024-12-02 at 1 21 25 PM](https://github.com/user-attachments/assets/2fdcbfc3-18b8-4e8a-bebb-5fe2cb60cb90)


#### License
This project is licensed under the MIT License.
