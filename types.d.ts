export interface Video {
	caption: string;
	video: {
		asset: {
			_id: string;
			url: string;
		};
	};
	_id: string;
	postedBy: {
		_id: string;
		userName: string;
		image: string;
	};
	// likes: {
	// 	postedBy: {
	// 		_id: string;
	// 		userName: string;
	// 		image: string;
	// 	};
	// }[];
	likes: Likes[];
	comments: {
		comment: string;
		_key: string;
		postedBy: {
			_ref: string;
		};
	}[];
	userId: string;
}

export interface IUser {
	_id: string;
	_type: string;
	userName: string;
	image: string;
}

export interface UserProfile {
	userProfile: IUser | null;
	allUsers: IUser[] | [];
	addUser: (user: any) => void;
	removeUser: () => void;
	fetchAllUsers: () => void;
}

export interface Likes {
	_key: string;
	_ref: string;
}
