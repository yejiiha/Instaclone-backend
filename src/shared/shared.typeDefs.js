import { gql } from "apollo-server-express";

export default gql`
  type MutationResponse {
    id: Int
    ok: Boolean!
    error: String
  }
`;
