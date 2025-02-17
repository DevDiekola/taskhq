import { createSlice } from '@reduxjs/toolkit';
import { Workspace, WorkspaceState } from './workspaceModel';

const mockWorkspace: Workspace = {
  name: "My Workspace",
  plan: "enterprise",
}

const initialState: WorkspaceState = {
  workspace: mockWorkspace,
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
});

export default workspaceSlice.reducer;
