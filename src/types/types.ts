type UserPost<S, A, N> = {
    screenshot: S,
    title: S,
    summary: S,
    repo: S,
    live_demo: S,
    comments: A,
    upvote: N
}


export interface UserTypes<S, N, B> {
    avatar: S,
    color: S,
    unclicked: S,
    state: B,
    id: N
    user_name: S
    posts: UserPost<string, string[], number>
}   

