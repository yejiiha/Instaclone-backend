import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolvers(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          // Parse caption
          const hashtags = caption.match(/#[\w]+/g);
          hashtagObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }
        // Get or create Hashtags
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
        // Save the photo with the parsed hashtags
        // Add the photo to the hashtags
      }
    ),
  },
};
