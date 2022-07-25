import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GoVerified } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineCancel } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";

import Comments from "../../components/Comments";
import { BASE_URL } from "../../utils";
import LikeButton from "../../components/LikeButton";
import useAuthStore from "../../store/authStore";
import { Video } from "../../types";
import { allPostsQuery } from "../../utils/queries";
import axios from "axios";

interface IProps {
	postDetails: Video;
}

interface ParamsID {
	params: {
		id: string;
	};
}

const DetailPost = ({ postDetails }: IProps) => {
	const [post, setPost] = useState(postDetails);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isVideoMuted, setIsVideoMuted] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [comment, setComment] = useState("");
	const [isPostingComment, setIsPostingComment] = useState(false);
	const router = useRouter();
	const { userProfile } = useAuthStore();

	const onVideoClick = () => {
		if (isPlaying) {
			videoRef?.current?.pause();
			setIsPlaying(false);
		} else {
			videoRef?.current?.play();
			setIsPlaying(true);
		}
	};

	const onMutePress = (e: React.MouseEvent<HTMLElement>) => {
		// e.stopPropagation();
		if (videoRef.current) {
			if (isVideoMuted) {
				setIsVideoMuted(false);
				videoRef.current.muted = false;
			} else {
				setIsVideoMuted(true);
				videoRef.current.muted = true;
			}
		}
	};

	const handleLike = async (like: boolean) => {
		if (userProfile) {
			const res = await axios.put(`${BASE_URL}/api/like`, {
				userId: userProfile._id,
				postId: post._id,
				like,
			});

			setPost({ ...post, likes: res.data.likes });
		}
	};

	const addComment = async (e: React.FormEvent) => {
		e.preventDefault();

		if (userProfile && comment) {
			setIsPostingComment(true);

			const res = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
				userId: userProfile._id,
				comment,
			});

			setPost({ ...post, comments: res.data.comments });
			setComment("");
			setIsPostingComment(false);
		}
	};

	if (!post) return null;

	return (
		<div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
			<div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center">
				<div className="opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
					<p className="cursor-pointer " onClick={() => router.back()}>
						<MdOutlineCancel className="text-white text-[35px] hover:opacity-90" />
					</p>
				</div>
				<div className="relative">
					<div className="lg:h-[100vh] h-[60vh]">
						<video
							ref={videoRef}
							onClick={onVideoClick}
							loop
							src={post?.video?.asset.url}
							className=" h-full cursor-pointer"
						></video>
					</div>
					<div className="absolute top-[45%] left-[40%]  cursor-pointer">
						{isPlaying || (
							<button onClick={onVideoClick}>
								<BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
							</button>
						)}
					</div>
				</div>
				<div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10  cursor-pointer">
					{isVideoMuted ? (
						<button onClick={onMutePress}>
							<HiVolumeOff className="text-white text-3xl lg:text-4xl" />
						</button>
					) : (
						<button onClick={onMutePress}>
							<HiVolumeUp className="text-white text-3xl lg:text-4xl" />
						</button>
					)}
				</div>
			</div>
			<div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
				<div className="lg:mt-20 mt-10">
					<Link href={`/profile/${post.postedBy._id}`}>
						<div className="flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer">
							<Image width={60} height={60} alt="user-profile" className="rounded-full" src={post.postedBy.image} />
							<div>
								<div className="text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-center">
									{post.postedBy.userName.replaceAll(" ", "")}
									<GoVerified className="text-blue-400 text-xl" />
								</div>
								<p className="text-md"> {post.postedBy.userName}</p>
							</div>
						</div>
					</Link>
					<div className="px-10">
						<p className=" text-md text-gray-600">{post.caption}</p>
					</div>
					<div className="mt-10 px-10">
						{userProfile && (
							<LikeButton
								likes={post.likes}
								// flex='flex'
								handleLike={() => handleLike(true)}
								handleDislike={() => handleLike(false)}
							/>
						)}
					</div>
					<Comments
						comment={comment}
						setComment={setComment}
						addComment={addComment}
						comments={post.comments}
						isPostingComment={isPostingComment}
					/>
				</div>
			</div>
		</div>
	);
};

export default DetailPost;

export const getStaticProps = async ({ params: { id } }: ParamsID) => {
	const res = await axios.get(`${BASE_URL}/api/post/${id}`);

	return {
		props: {
			postDetails: res.data,
		},
	};
};

export const getStaticPaths = async () => {
	const { data } = await axios.get(`${BASE_URL}/api/post`);

	return {
		paths: data.map((video: Video) => ({ params: { id: video._id } })),
		fallback: false,
	};
};
