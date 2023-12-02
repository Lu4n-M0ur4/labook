import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostsOutputDTO,
} from "../dtos/posts/createPost.dto";
import {
  UpdadePostsOutputDTO,
  UpdatePostInputDTO,
} from "../dtos/posts/updatePost.dto copy";
import {
  GetPostsInputDTO,
  getPostsOutputDTO,
} from "../dtos/posts/getPosts.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { Post, PostDB, PostModel } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

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
      console.log(post.getCreatorName());

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

    const postDB = await this.postDatabase.getPostById(idToEdit);

    if (!postDB) {
      throw new BadRequestError("Post com essa id não existe");
    }
    console.log("meuconsole", postDB);

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
}
