import client from "../../client";

export default {
  Query: {
    seeFollowing: async (_, { username, offset }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "User is not found",
        };
      }
      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: 7,
          skip: offset,
        });
      return {
        ok: true,
        following,
      };
    },
  },
};
