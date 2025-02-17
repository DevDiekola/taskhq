export type User = {
  name: string;
  email: string;
  displayPictureURL?: string;
}

export type UserState = {
  user: User;
};