import {PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POST = "posts"


public insertPost = async ( newPostDB:PostDB):Promise<void>=>{
    await BaseDatabase
    .connection(PostDatabase.TABLE_POST)
    .insert(newPostDB)
}


}