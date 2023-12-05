import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostsOutputDTO,
} from "../dtos/posts/createPost.dto";
import {
  UpdadePostsOutputDTO,
  UpdatePostInputDTO,
} from "../dtos/posts/updatePost.dto";
import {
  GetPostsInputDTO,
  getPostsOutputDTO,
} from "../dtos/posts/getPosts.dto";
import { BadRequestError } from "../errors/BadRequestError";
import {
  LikeDislikeDB,
  PLAYLIST_LIKE,
  Post,
  PostDB,
  PostModel,
} from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/posts/delePost.dto";
import { USER_ROLES } from "../models/User";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/posts/likeOrDislikePost.dto";




export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostsOutputDTO> => {
    const { content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError();
    }

    const id = this.idGenerator.generate();

    const post = new Post(
      id,
      payload.id,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.name
    );

    const newPostDB = {
      id: post.getId(),
      creator_id: post.getCreatorId(),
      content: post.getContent(),
      likes: post.getLikes(),
      dislikes: post.getDislikes(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt(),
    };

    await this.postDatabase.insertPost(newPostDB);

    const output: CreatePostsOutputDTO = undefined;

    return output;
  };

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<getPostsOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError();
    }

    const postDBAndCreatorName = await this.postDatabase.getPostsAndCreator();

    const postsModel = postDBAndCreatorName.map((postAndCreatorName) => {
      const post = new Post(
        postAndCreatorName.id,
        postAndCreatorName.creator_id,
        postAndCreatorName.content,
        postAndCreatorName.likes,
        postAndCreatorName.dislikes,
        postAndCreatorName.created_at,
        postAndCreatorName.updated_at,
        postAndCreatorName.creator_name
      );

      const result: PostModel = {
        id: post.getId(),
        content: post.getContent(),
        likes: post.getLikes(),
        dislikes: post.getDislikes(),
        createdAt: post.getCreatedAt(),
        updatedAt: post.getUpdatedAt(),
        creator: {
          id: post.getCreatorId(),
          name: post.getCreatorName(),
        },
      };
      return result;
    });

    return postsModel;
  };

  public editPost = async (
    input: UpdatePostInputDTO
  ): Promise<UpdadePostsOutputDTO> => {
    const { content, token, idToEdit } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError();
    }

    const postDB = await this.postDatabase.findPostById(idToEdit);

    if (!postDB) {
      throw new BadRequestError("Post com essa id não existe");
    }

    if (payload.id !== postDB.creator_id) {
      throw new BadRequestError("Somente o criador do post pode editar o mesmo!!!");
    }

    const post = new Post(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      new Date().toISOString(),
      payload.name
    );

    post.setContent(content);

    const newPostDB: PostDB = {
      id: post.getId(),
      creator_id: post.getCreatorId(),
      content: post.getContent(),
      likes: post.getLikes(),
      dislikes: post.getDislikes(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt(),
    };

    await this.postDatabase.updatePost(newPostDB);

    const output: CreatePostsOutputDTO = undefined;

    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError();
    }

    const postDB = await this.postDatabase.findPostById(idToDelete);

    if (!postDB) {
      throw new BadRequestError("Post com essa id não existe");
    }

    if (payload.id !== USER_ROLES.ADMIN) {
      if (payload.id !== postDB.creator_id) {
        throw new BadRequestError(
          "Somente quem criou o post pode excluí-lo"
        );
      }
    }

    await this.postDatabase.deletePostById(idToDelete);

    const output: DeletePostOutputDTO = undefined;

    return output;
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { token, like, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError();
    }

    const postDBForCreator = await this.postDatabase.findPostAndCreatorById(
      postId
    );

    if (payload.id === postDBForCreator?.creator_id) {
      throw new BadRequestError(
        "Você não pode curtir ou descurtir o próprio post!!! "
      );
    }

    if (!postDBForCreator) {
      throw new BadRequestError("Post com este ID não existe");
    }

    const post = new Post(
      postDBForCreator.id,
      postDBForCreator.creator_id,
      postDBForCreator.content,
      postDBForCreator.likes,
      postDBForCreator.dislikes,
      postDBForCreator.created_at,
      new Date().toISOString(),
      postDBForCreator.creator_name
    );

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite,
    };

    const likeDislikeExist = await this.postDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExist === PLAYLIST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.deleteLikeDislike(likeDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeDislikeExist === PLAYLIST_LIKE.ALREADY_DISLIKED) {
      if (!like) {
        await this.postDatabase.deleteLikeDislike(likeDislikeDB);
        post.removeDislike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDatabase.insertLikeDislike(likeDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatePostLikeOrDislike: PostDB = {
      id: post.getId(),
      creator_id: post.getCreatorId(),
      content: post.getContent(),
      likes: post.getLikes(),
      dislikes: post.getDislikes(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt(),
    };

    await this.postDatabase.updatePost(updatePostLikeOrDislike);

    const output: LikeOrDislikePostOutputDTO = undefined;

    return output;
  };
}
