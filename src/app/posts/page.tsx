"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/subpage.module.css";
import Link from "next/link";
import { Post } from "@/types/post.type";

// MOCKS
import { mockedPosts } from "@/mocks/posts.mocks";

// CONTEXT
import { usePost } from "@/contexts/PostsContext";

// MATERIAL
import {
    Button,
    Grid,
    Paper,
    Typography,
    CardMedia,
    CardContent,
    Card,
    Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

const page = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const { setPost } = usePost();
    const router = useRouter();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // MOCKS
            const response = await mockedPosts;
            setPosts(response);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNavigation = (post: Post) => {
        setPost(post);
        router.push(`/posts/${post.id}`);
    };

    useEffect(() => {
        !posts.length && fetchPosts();
    }, []);
    return (
        <Grid container className={styles.mainContainer}>
            <Grid item className={styles.postBanner}>
                <Image src="/banner.jpg" alt="Example image" fill priority />
            </Grid>
            <Paper className={styles.subpageBackground}>
                <Paper className={styles.postContainer}>
                    <Grid
                        container
                        direction="column"
                        spacing={8}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        <Grid item>
                            <Typography variant="h3">Posty</Typography>
                        </Grid>

                        {posts.map((post, index) => (
                            <Grid item key={index}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        flex: "50% 50%",
                                        textAlign: "center",
                                        height: "100%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "50%",
                                            alignContent: "center",
                                        }}
                                    >
                                        <CardContent>
                                            <Grid
                                                container
                                                direction="column"
                                                alignItems="center"
                                                spacing={4}
                                            >
                                                <Grid item>
                                                    <Typography
                                                        component="div"
                                                        variant="h5"
                                                    >
                                                        {post.titlePL}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    container
                                                    alignItems="center"
                                                    direction="column"
                                                    spacing={2}
                                                >
                                                    <Grid item>
                                                        <Typography
                                                            variant="subtitle1"
                                                            component="div"
                                                            sx={{
                                                                color: "text.secondary",
                                                                maxWidth:
                                                                    "250px",
                                                            }}
                                                        >
                                                            {post.introPL}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() =>
                                                                handleNavigation(
                                                                    post
                                                                )
                                                            }
                                                        >
                                                            Show More
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Box>
                                    <CardMedia
                                        component="img"
                                        image={post.mainFile}
                                        alt="Post picture error"
                                        sx={{
                                            width: "50%",
                                        }}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Paper>
        </Grid>
    );
};

export default page;
