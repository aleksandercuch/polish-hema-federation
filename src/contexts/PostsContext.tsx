"use client";
import { PostT } from "@/types/post.type";
import { defaultPostValues } from "@/utils/post/postDefaultValues";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PostsContextType {
    post: PostT;
    setPost: React.Dispatch<React.SetStateAction<PostT>>;
}
const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
    const [post, setPost] = useState<PostT>(defaultPostValues);

    return (
        <PostsContext.Provider value={{ post, setPost }}>
            {children}
        </PostsContext.Provider>
    );
}

export function usePost() {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error("usePosts must be used within a PostsProvider");
    }
    return context;
}
