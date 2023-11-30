import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostsOutputDTO } from "../dtos/posts/createPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
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


    const payload = this.tokenManager.getPayload(token)

    if(!payload){
        throw new BadRequestError()
    }

    const id  =  this.idGenerator.generate()

    const post = new Post(
        id,
        payload.id,
        content,
        0,
        0,
        new Date().toISOString(),
        new Date().toISOString()
    )

    const newPostDB = {
        id: post.getId(),
        creator_id:post.getCreatorId(),
        content: post.getContent(),
        likes: post.getLikes(),
        dislikes: post.getDislikes(),
        created_at: post.getCreatedAt(),
        updated_at: post.getUpdatedAt()
    }


    await this.postDatabase.insertPost(newPostDB)

    const output:CreatePostsOutputDTO = undefined

    return output


  };
}
