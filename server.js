require("dotenv").config();
import { ApolloServer, gql } from "apollo-server";
import schema from "./schema";

const PORT = process.env.PORT;
const server = new ApolloServer({
  schema,
});

server
  .listen(PORT)
  .then(() => console.log(`✅ Server is running on http://localhost:${PORT}/`));
