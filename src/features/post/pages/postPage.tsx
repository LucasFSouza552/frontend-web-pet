import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post } from "../../../shared/models/post";
import { PostsContext } from "../postContext";


import PostComponent from "../../post/components/postComponent"
import { AuthContext } from "../../auth/AuthContext";
import PostComments from "../components/PostComments";

export default function PostPage() {

    const { account, loading } = useContext(AuthContext);
    const { loadPostDetails } = useContext(PostsContext);

    const { id } = useParams<{ id: string }>();

    const [post, setPost] = useState<Post | null>(null);


    useEffect(() => {
        if (!id) return;

        loadPostDetails(id).then(post => {
            console.log(post);
            setPost(post);
        });
    }, []);

    if (!post) return (<div></div>);

    return (
        <div>
            {<PostComponent post={post} accountId={account?.id} />}
            {post?.comments && <PostComments comments={post.comments} />}
        </div>)

}