"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/subpage.module.css";
import { PostT } from "@/types/post.type";
import { usePost } from "@/contexts/PostsContext";
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
import { Loader } from "../loader/loader";
import PostFormControl from "./PostFormControl";
import {
    collection,
    getDocs,
    orderBy,
    query,
    limit,
    startAfter,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase/config/clientApp";
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";

//CONTEXT
import { UserAuth } from "@/contexts/AuthContext";

const POSTS_PER_PAGE = 10;

const ListOfPosts = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<PostT[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [addPostModeActive, setAddPostModeActive] = useState(false);
    const { setPost } = usePost();
    const router = useRouter();
    const currentUser = UserAuth();

    const fetchPosts = useCallback(
        async (reset = false) => {
            setLoading(true);

            try {
                let q = query(
                    collection(db, "posts"),
                    orderBy("date", "desc"),
                    limit(POSTS_PER_PAGE)
                );

                if (!reset && lastDoc) {
                    q = query(
                        collection(db, "posts"),
                        orderBy("date", "desc"),
                        startAfter(lastDoc),
                        limit(POSTS_PER_PAGE)
                    );
                }

                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const newPosts = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as PostT[];

                    setPosts((prev) =>
                        reset ? newPosts : [...prev, ...newPosts]
                    );
                    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                    setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        },
        [lastDoc, setLoading, setPosts, setLastDoc, setHasMore]
    );

    const handleNavigation = (post: PostT) => {
        setPost(post);
        router.push(`/posts/${post.id}`);
    };

    useEffect(() => {
        fetchPosts(true);
    }, [fetchPosts]);

    return (
        <Grid container className={styles.mainContainer}>
            <Grid item className={styles.postBanner}>
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/polish-hema-federation.firebasestorage.app/o/banner.jpg?alt=media&token=1f1dffd9-bb98-4e88-8e46-53324347f806"
                    alt="Example image"
                    fill
                    priority
                />
            </Grid>
            <Paper
                className={styles.subpageBackground}
                sx={{
                    width: {
                        xs: "100%",
                        lg: "55%",
                    },
                }}
            >
                <Paper
                    className={styles.postContainer}
                    sx={{ padding: { md: "70px 100px", xs: "10px" } }}
                >
                    <Grid
                        container
                        direction="column"
                        spacing={8}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        <Grid
                            item
                            container
                            sx={{
                                justifyContent: {
                                    md: "space-between",
                                    xs: "center",
                                },
                            }}
                        >
                            <Grid item>
                                <Typography variant="h3">Posty</Typography>
                            </Grid>
                            {!addPostModeActive && currentUser?.user?.email && (
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            setAddPostModeActive(true)
                                        }
                                    >
                                        Dodaj Post
                                    </Button>
                                </Grid>
                            )}
                        </Grid>

                        {!addPostModeActive ? (
                            <>
                                {!loading || posts.length > 0 ? (
                                    <>
                                        {posts.map((post, index) => (
                                            <Grid
                                                item
                                                key={index}
                                                xs={12}
                                                sx={{ width: "100%" }}
                                            >
                                                <Card
                                                    sx={{
                                                        display: {
                                                            xs: "inherit",
                                                            md: "flex",
                                                        },
                                                        flexDirection: "row",
                                                        textAlign: "center",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: {
                                                                xs: "100%",
                                                                md: "50%",
                                                            },
                                                            alignContent:
                                                                "center",
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
                                                                        {
                                                                            post.titlePL
                                                                        }
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
                                                                            {
                                                                                post.introPL
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={6}
                                                                    >
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="error"
                                                                            onClick={() =>
                                                                                handleNavigation(
                                                                                    post
                                                                                )
                                                                            }
                                                                        >
                                                                            Show
                                                                            More
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Box>
                                                    <CardMedia
                                                        component="img"
                                                        image={
                                                            post.mainFile as string
                                                        }
                                                        alt="Post picture error"
                                                        sx={{
                                                            width: {
                                                                xs: "100%",
                                                                md: "50%",
                                                            },
                                                        }}
                                                    />
                                                </Card>
                                            </Grid>
                                        ))}
                                    </>
                                ) : (
                                    <Loader />
                                )}
                                {/* Pagination Buttons */}
                                <Grid
                                    container
                                    justifyContent="center"
                                    sx={{ mt: 3 }}
                                >
                                    {hasMore && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => fetchPosts(false)}
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Loading..."
                                                : "Load More"}
                                        </Button>
                                    )}
                                </Grid>
                            </>
                        ) : (
                            <Grid item sx={{ width: "100%" }}>
                                <PostFormControl
                                    mode={OPERATION_MODE.Add}
                                    closeFormControl={setAddPostModeActive}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Paper>
        </Grid>
    );
};

export default ListOfPosts;
