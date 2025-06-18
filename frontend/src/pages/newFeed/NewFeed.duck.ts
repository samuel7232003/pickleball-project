import { getCourtByIdService } from "../../services/court";
import { createPostService, getPostsService } from "../../services/post";

// State
const initialState = {
  posts: [],
  error: null,
  successMessage: "",
  courtModal: null,
  page: 1,
  limit: 10,
  loading: false,
  hasMore: true,
};

// Action Types
export const SET_POSTS = "SET_POSTS";
export const ADD_POST = "ADD_POST";
export const SET_ERROR = "SET_ERROR";
export const SET_SUCCESS_MESSAGE = "SET_SUCCESS_MESSAGE";
export const SET_COURT_MODAL = "SET_COURT_MODAL";
export const SET_LOADING = "SET_LOADING";
export const SET_HAS_MORE = "SET_HAS_MORE";
export const APPEND_POSTS = "APPEND_POSTS";

// Reducer
export const newFeedReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_POSTS:
      return { ...state, posts: action.payload };
    case ADD_POST:
      return { ...state, posts: [action.payload, ...state.posts] };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };
    case SET_COURT_MODAL:
      return { ...state, courtModal: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_HAS_MORE:
      return { ...state, hasMore: action.payload };
    case APPEND_POSTS:
      return { ...state, posts: [...state.posts, ...action.payload] };
    default:
      return state;
  }
};

// Action Creators
export const setPosts = (posts: any[]) => ({
  type: SET_POSTS,
  payload: posts,
});

export const addPost = (post: any) => ({
  type: ADD_POST,
  payload: post,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const setSuccessMessage = (msg: string) => ({
  type: SET_SUCCESS_MESSAGE,
  payload: msg,
});

export const setCourtModal = (isOpen: boolean) => ({
  type: SET_COURT_MODAL,
  payload: isOpen,
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setHasMore = (hasMore: boolean) => ({
  type: SET_HAS_MORE,
  payload: hasMore,
});

export const appendPosts = (posts: any[]) => ({
  type: APPEND_POSTS,
  payload: posts,
});

// Thunks (logic to be implemented)
export const fetchPosts = (page = 1, limit = 10) => async (dispatch: any, getState: any) => {
  dispatch(setLoading(true));
  try {
    const response: any = await getPostsService(page, limit);
    const posts = response;
    if (page === 1) {
      dispatch(setPosts(posts));
    } else {
      dispatch(appendPosts(posts));
    }
    dispatch(setHasMore(posts.length === limit));
  } catch (error) {
    dispatch(setError("Failed to fetch posts"));
    dispatch(setHasMore(false));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createPost = (postData: any) => async (dispatch: any, getState: any) => {
  const {content, courtId } = postData;
  const {_id: userId} = getState().user.user;

  try {
    const response: any = await createPostService({content, courtId, userId});
    dispatch(setCourtModal(false));
    return dispatch(addPost(response));
  } catch (error) {
    console.log(error)
    return null
  }
};

export const fetchSearchCourt = (id: string) => async (dispatch: any) => {
  try {
    const response: any = await getCourtByIdService(id)
    return dispatch(setCourtModal(response))
  } catch (error) { 
    console.log(error)
    return null
  }
};