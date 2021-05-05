import client from "../../client";

export default {
  Query: {
    searchPhotos: (_, { keyword }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              caption: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              comments: {
                some: {
                  payload: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
  },
};
