import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";

export default {
  Mutation: {
    createRoom: protectedResolvers(async (_, { userId }, { loggedInUser }) => {
      const user = await client.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        return {
          ok: false,
          error: "This user is not exist.",
        };
      }

      const existRoom = await client.room.findFirst({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (existRoom) {
        return {
          ok: false,
          error: "This room already exists. You cannot select this user.",
        };
      }

      const room = await client.room.create({
        data: {
          users: {
            connect: [
              {
                id: userId,
              },
              {
                id: loggedInUser.id,
              },
            ],
          },
        },
      });

      return {
        ok: true,
        id: room.id,
      };
    }),
  },
};
