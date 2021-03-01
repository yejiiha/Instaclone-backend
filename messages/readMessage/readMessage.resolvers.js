import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";

export default {
  Mutation: {
    readMessage: protectedResolvers(async (_, { id }, { loggedInUser }) => {
      const message = await client.message.findFirst({
        where: {
          id,
          userId: {
            not: loggedInUser.id,
          },
          room: {
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!message) {
        return {
          ok: false,
          error: "Message is not found.",
        };
      }

      await client.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });

      return {
        ok: true,
      };
    }),
  },
};
