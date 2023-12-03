import {
  LikeDislikeDB,
  PLAYLIST_LIKE,
  PostDB,
  PostDBAndCreator,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POST = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes";

  public insertPost = async (newPostDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POST).insert(newPostDB);
  };

  public getPostsAndCreator = async (): Promise<PostDBAndCreator[]> => {
    const postsDB: PostDBAndCreator[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POST
    )
      .select(
        `${PostDatabase.TABLE_POST}.id`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        `${PostDatabase.TABLE_POST}.content`,
        `${PostDatabase.TABLE_POST}.likes`,
        `${PostDatabase.TABLE_POST}.dislikes`,
        `${PostDatabase.TABLE_POST}.created_at`,
        `${PostDatabase.TABLE_POST}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );

    return postsDB;
  };

  public editPost = async (postToEdit: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .update(postToEdit)
      .where({ id: postToEdit.id });
  };

  public findPostById = async (
    tokenPayloadId: string
  ): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase.connection(
      PostDatabase.TABLE_POST
    ).where({ id: tokenPayloadId });

    return result as PostDB | undefined;
  };

  public updatePost = async (newPostDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .where({ id: newPostDB.id })
      .update(newPostDB);
  };

  public deletePostById = async (IdToDelete: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .where({ id: IdToDelete })
      .delete();
  };

  public findPostAndCreatorById = async (
    id: string
  ): Promise<PostDBAndCreator | undefined> => {
    const [postsDB]: PostDBAndCreator[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POST
    )
      .select(
        `${PostDatabase.TABLE_POST}.id`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        `${PostDatabase.TABLE_POST}.content`,
        `${PostDatabase.TABLE_POST}.likes`,
        `${PostDatabase.TABLE_POST}.dislikes`,
        `${PostDatabase.TABLE_POST}.created_at`,
        `${PostDatabase.TABLE_POST}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POST}.id`]:id });

    return postsDB;
  };

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<PLAYLIST_LIKE | undefined> => {
    const [result]: Array<LikeDislikeDB | undefined> =
      await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
      
      if (result === undefined) {
        return undefined;
      } else if (result.like === 1) {
        return PLAYLIST_LIKE.ALREADY_LIKED;
      } else {
        return PLAYLIST_LIKE.ALREADY_DISLIKED;
      }
      console.log("este é meu log" ,result);
  };

  public deleteLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .where({ user_id: likeDislikeDB.user_id, post_id: likeDislikeDB.post_id })
      .delete();
  };

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
    ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({  user_id: likeDislikeDB.user_id, post_id: likeDislikeDB.post_id  });
  };

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
    ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .insert(likeDislikeDB)
      
  };

  
}
