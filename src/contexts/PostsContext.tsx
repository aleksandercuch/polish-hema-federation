"use client";
import { Post } from "@/types/post.type";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PostsContextType {
    post: Post;
    setPost: React.Dispatch<React.SetStateAction<Post>>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
    const [post, setPost] = useState<Post>({
        id: "",
        title: "",
        intro: "",
        description: "",
        date: new Date(),
        images: [],
    });

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
