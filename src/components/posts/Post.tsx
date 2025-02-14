"use client";

// CORE
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/subpage.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";

// CONTEXT
import { usePost } from "@/contexts/PostsContext";

// ASSETS
import { Button, Grid, Paper, Typography } from "@mui/material";
import "react-image-gallery/styles/css/image-gallery.css";

// FIREBASE
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../../firebase/config/clientApp";
import { Timestamp } from "firebase/firestore";

// COMPONENTS
import { Loader } from "@/components/loader/loader";
import PostFormControl from "./PostFormControl";
import ImageGallery from "react-image-gallery";

// TYPES
import { PostT } from "@/types/post.type";

// UTILS
import { convertDraftToHtmlWithEmptyBlocks } from "@/utils/editor/convertFunction";
import { convertImagesToGallery } from "@/utils/post/convertImagesToGallery";
import { convertFirebaseTimestamp } from "@/utils/post/convertFirebaseTimestamp";
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";
import { defaultPostValues } from "@/utils/post/postDefaultValues";
import { fileExists } from "@/utils/storage/fileExistInStorage";

//CONTEXT
import { UserAuth } from "@/contexts/AuthContext";
import { RawDraftContentState } from "react-draft-wysiwyg";

const Post = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { post, setPost } = usePost();
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const currentUser = UserAuth();

    const deletePost = async () => {
        if (!post?.id) return;

        const confirmDelete = window.confirm(
            "Czy na pewno chcesz usunąć ten post?"
        );
        if (!confirmDelete) return;

        try {
            if (post.mainFile) {
                if (await fileExists(post.mainFile as string)) {
                    await deleteObject(ref(storage, post.mainFile as string));
                }
            }

            if (post.images && post.images.length > 0) {
                await Promise.all(
                    post.images.map(async (imageUrl) => {
                        if (await fileExists(imageUrl as string)) {
                            await deleteObject(
                                ref(storage, imageUrl as string)
                            );
                            console.log("Image deleted:", imageUrl);
                        }
                    })
                );
            }

            await deleteDoc(doc(db, "posts", post.id));
            alert("Post został usunięty.");
            router.push(`/posts`);
            // setPost(defaultPostValues);
        } catch (error) {
            console.error("Błąd podczas usuwania posta:", error);
            alert("Wystąpił błąd podczas usuwania posta.");
        }
    };

    const fetchPost = useCallback(async () => {
        if (!id) return;
        setLoading(true);

        try {
            const postId = id as string;
            const postDocRef = doc(db, "posts", postId);
            const docSnap = await getDoc(postDocRef);

            if (docSnap.exists()) {
                const postData = docSnap.data();

                const post: PostT = {
                    id: postId,
                    titleENG: postData.titleENG || "",
                    titlePL: postData.titlePL || "",
                    introENG: postData.introENG || "",
                    introPL: postData.introPL || "",
                    descriptionENG: postData.descriptionENG || "",
                    descriptionPL: postData.descriptionPL || "",
                    mainFile: postData.mainFile || "",
                    images: postData.images || [],
                    date: postData.date,
                };
                setPost(post);
            } else {
                console.log("No such post found!");
            }
        } catch (error) {
            console.error("Error fetching post:", error);
        } finally {
            setLoading(false);
        }
    }, [id, setPost, setLoading]);

    useEffect(() => {
        if (!post?.id) {
            fetchPost();
        }
    }, [fetchPost, post]);

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
                <Paper>
                    <Link href={"/posts"}>
                        <Button>Wszystkie posty</Button>
                    </Link>
                </Paper>
                <Paper
                    className={styles.postContainer}
                    sx={{ padding: { md: "70px 100px", xs: "10px" } }}
                >
                    {post.id && !loading ? (
                        <>
                            {!isEditing ? (
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
                                        direction="column"
                                        spacing={3}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Grid item>
                                            <Typography variant="h3">
                                                {post.titlePL}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1">
                                                {dayjs(
                                                    convertFirebaseTimestamp(
                                                        post.date as Timestamp
                                                    )
                                                ).format("DD/MM/YYYY")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{ width: "100%" }}
                                        >
                                            <Image
                                                className={styles.postImage}
                                                src={post.mainFile as string}
                                                alt="Example image"
                                                fill
                                                priority
                                            />
                                        </Grid>
                                        {currentUser?.user?.email && (
                                            <Grid
                                                item
                                                container
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Grid item xs={6}>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        fullWidth
                                                        onClick={() =>
                                                            setIsEditing(true)
                                                        }
                                                    >
                                                        Edytuj
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {" "}
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        fullWidth
                                                        onClick={() =>
                                                            deletePost()
                                                        }
                                                    >
                                                        Usuń
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>
                                    {post.descriptionPL && (
                                        <Grid item container>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: convertDraftToHtmlWithEmptyBlocks(
                                                        post.descriptionPL as RawDraftContentState
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    )}
                                    {post.images.length > 0 && (
                                        <Grid
                                            item
                                            xs={12}
                                            className={styles.galleryContainer}
                                        >
                                            <ImageGallery
                                                items={convertImagesToGallery(
                                                    post.images as string[]
                                                )}
                                                showFullscreenButton={true}
                                                startIndex={1}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            ) : (
                                <PostFormControl
                                    mode={OPERATION_MODE.Edit}
                                    closeFormControl={setIsEditing}
                                />
                            )}
                        </>
                    ) : (
                        <Loader />
                    )}
                </Paper>
            </Paper>
        </Grid>
    );
};

export default Post;
