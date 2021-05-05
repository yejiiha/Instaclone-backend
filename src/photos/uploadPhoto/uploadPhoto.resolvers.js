import client from "../../client";
import { uploadDataToS3 } from "../../shared/shared.utils";
import { protectedResolvers } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolvers(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          // Parse caption
          hashtagObj = processHashtags(caption);
        }
        const fileUrl = await uploadDataToS3(file, loggedInUser.id, "uploads");
        // Get or create Hashtags
        return client.photo.create({
          data: {
            file: fileUrl,
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
