"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./post.module.css";

// MOCKS
import { mockedPosts } from "@/mocks/posts.mocks";

// CONTEXT
import { usePost } from "@/contexts/PostsContext";
import { Grid } from "@mui/material";

const page = () => {
    const [loading, setLoading] = useState(true);
    const { post, setPost } = usePost();

    const fetchPost = async () => {
        setLoading(true);
        try {
            // MOCKS
            const response = await mockedPosts;
            setPost(response[0]);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!post.id) {
            fetchPost();
        }
    }, []);
    return (
        <Grid container>
            <Grid item className={styles.postImageContainer}>
                <Image src="/next.svg" alt="Example image" fill priority />
            </Grid>
        </Grid>
    );
};

export default page;
