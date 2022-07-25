import type { NextPage } from "next";
import axios from "axios";
import { Video } from "../types";
import VideoCard from "../components/VideoCard";
import NoResults from "../components/NoResults";
import { BASE_URL } from "../utils";

interface IProps {
	videos: Video[];
}

interface IParams {
	query: {
		topic: string;
	};
}

const Home: NextPage<IProps> = ({ videos }) => {
	return (
		<div className="flex flex-col gap-10 videos h-full">
			{videos?.length > 0 ? (
				videos?.map((video: Video) => <VideoCard post={video} key={video._id} />)
			) : (
				<NoResults text={`No Videos`} />
			)}
		</div>
	);
};

export const getServerSideProps = async ({ query: { topic } }: IParams) => {
	let res;
	if (topic) {
		res = await axios.get(`${BASE_URL}/api/post`, {
			params: {
				topic,
			},
		});
	} else {
		res = await axios.get(`${BASE_URL}/api/post`);
	}

	return {
		props: {
			videos: res.data,
		},
	};
};

export default Home;
