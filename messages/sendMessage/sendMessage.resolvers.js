import { prototype } from "aws-sdk/clients/acm";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolvers } from "../../users/users.utils";

export default {
  Mutation: {
    sendMessage: protectedResolvers(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        let room = null;
        if (userId) {
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
              error: "The Room already exist!",
            };
          }

          room = await client.room.create({
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
        } else if (roomId) {
          room = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: {
              id: true,
            },
          });

          if (!room) {
            return {
              ok: false,
              error: "Room is not found.",
            };
          }
        }
        const message = await client.message.create({
          data: {
            payload,
            room: {
              connect: {
                id: room.id,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
        return {
          ok: true,
        };
      }
    ),
  },
};
