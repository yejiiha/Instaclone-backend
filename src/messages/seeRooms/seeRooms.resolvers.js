import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";

export default {
  Query: {
    seeRooms: protectedResolvers(async (_, __, { loggedInUser }) =>
      client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      })
    ),
  },
};
