export interface User{
    _id?: string,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    avatar?: string,
}

export interface UserListModel{
    user: User,
    userList: User[],
}