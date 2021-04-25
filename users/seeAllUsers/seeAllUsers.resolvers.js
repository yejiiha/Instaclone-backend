import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";

export default {
  Query: {
    seeAllUsers: protectedResolvers((_, __, { loggedInUser }) =>
      client.user.findMany({
        where: {
          NOT: { id: loggedInUser.id },
        },
      })
    ),
  },
};
