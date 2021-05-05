import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword }) =>
      client.user.findMany({
        where: {
          username: {
            contains: keyword.toLowerCase(),
          },
        },
      }),
  },
};
