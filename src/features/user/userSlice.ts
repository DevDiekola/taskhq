import { createSlice } from '@reduxjs/toolkit';
import { User, UserState } from './userModel';

const mockUser: User = {
  name: "Awesome Guy",
  email: "awesomeguy@example.com",
}

const initialState: UserState = {
  user: mockUser,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export default userSlice.reducer;
