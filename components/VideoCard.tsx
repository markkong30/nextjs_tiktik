import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { BsPlay } from "react-icons/bs";

import { Video } from "./../types";

interface IProps {
	post: Video;
}

const buttonStyles = "text-black text-2xl lg:text-4xl";

const VideoCard: NextPage<IProps> = ({ post }) => {
	const { postedBy, caption, video } = post;
	const [isPlaying, setIsPlaying] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const [isVideoMuted, setIsVideoMuted] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const onVideoPress = (e: React.MouseEvent<HTMLElement>) => {
		// e.stopPropagation();
		console.log("here");
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

	return (
		<div className="flex flex-col border-b-2 border-gray-200 pb-6">
			<div>
				<div className="flex gap-3 p-2 cursor-pointer font-semibold rounded ">
					<Link href={`/profile/${postedBy?._id}`}>
						<div className="md:w-16 md:h-16 w-10 h-10">
							<Image
								width={62}
								height={62}
								className="rounded-full"
								src={postedBy.image}
								alt="user-profile"
								layout="responsive"
							/>
						</div>
					</Link>
					<div>
						<Link href={`/profile/${postedBy?._id}`}>
							<div className="flex items-center gap-2">
								<p className="flex gap-2 items-center md:text-md font-bold text-primary">
									{postedBy.userName}
									<GoVerified className="text-blue-400 text-md" />
								</p>
								<p className="capitalize font-medium text-xs text-gray-500 hidden md:block">{postedBy.userName}</p>
							</div>
						</Link>
						<Link href={`/detail/${post._id}`}>
							<p className="mt-2 font-normal ">{caption}</p>
						</Link>
					</div>
				</div>
			</div>

			<div className="lg:ml-20 flex gap-4 relative">
				<div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className="rounded-3xl">
					<Link href={`/detail/${post._id}`}>
						<video
							loop
							ref={videoRef}
							src={video.asset.url}
							className="xl:w-[800px] h-[300px] md:h-[400px] lg:h-[528px] w-[300px] sm:w-[450px] md:w-[600px] lg:w-[700px] rounded-2xl cursor-pointer bg-gray-100"
						></video>
					</Link>

					{isHover && (
						<div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[50px] md:w-[100px] lg:w-[600px] p-3">
							{isPlaying ? (
								<button onClick={onVideoPress}>
									<BsFillPauseFill className={buttonStyles} />
								</button>
							) : (
								<button onClick={onVideoPress}>
									<BsFillPlayFill className={buttonStyles} />
								</button>
							)}
							{isVideoMuted ? (
								<button onClick={onMutePress}>
									<HiVolumeOff className={buttonStyles} />
								</button>
							) : (
								<button onClick={onMutePress}>
									<HiVolumeUp className={buttonStyles} />
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VideoCard;
