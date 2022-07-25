import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../utils/client";
import { allPostsQuery, topicPostsQuery } from "../../../utils/queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method == "GET") {
		const { topic } = req.query;
		let query;
		if (topic) {
			query = topicPostsQuery(topic);
		} else {
			query = allPostsQuery();
		}

		const data = await client.fetch(query);

		return res.status(200).json(data);
	}

	if (req.method == "POST") {
		const doc = req.body;

		client.create(doc).then(() => {
			return res.status(201).json("Video Submitted");
		});
	}
}
