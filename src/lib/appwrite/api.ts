import { INewPost, INewUser } from "@/types";
import {ID,Query} from "appwrite";
import {account, appwriteConfig, avatars, databases, storage} from './config.ts'

export async function createUserAccount(user:INewUser) {
    try{
     const newAccount = await account.create(
     ID.unique(),
     user.email,
     user.password,
     user.name
     )
     if(!newAccount) 
     {
        throw Error;
     }
     const avatarUrl = avatars.getInitials(user.name);
     
     const newUser = await saveUserToDB({
        accountId:newAccount.$id,
        name:newAccount.name,
        email:newAccount.email,
        username:user.username,
        imageUrl:avatarUrl,
     })

     return newUser;
     
    }catch(error){
        console.log(error);
        return error;
    }
    
}

export async function saveUserToDB(user:{
    accountId: string;
    email:string;
    name:string;
    imageUrl:URL;
    username?: string;
}){
    try{
    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user,
    );
    return newUser;
    }catch(error)
    {
        console.log("Error caused due to db");
        console.log(error);
    }
}

export async function signInAccount(user:{email:string;password:string;})
{
    try {
        const session = await account.createEmailSession(user.email,user.password);
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }
  

export async function getCurrentUser(){
    try {
        const currenAccount = await getAccount();

        if(!currenAccount) throw Error;
        const currentUser = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal('accountId',currenAccount.$id)]
        );

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function signOutAccount() {
    try {
      const session = await account.deleteSession("current");
      return session;        
    } catch (error) {
        console.log(error);
    }
    
}


export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        "655afcedd642b1745a64",
        '655afd4a722d9b84b313',
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }
  
  
export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        '655afc87840c8e8b4bac',
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }

  
export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        '655afc87840c8e8b4bac',
        fileId,
        2000,
        2000,
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  

export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile('655afc87840c8e8b4bac', fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  