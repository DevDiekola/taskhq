export type WorkspacePlan = 'free' | 'pro' | 'enterprise';

export type Workspace = {
  name: string;
  logoURL?: string;
  plan: WorkspacePlan;
}

export type WorkspaceState = {
  workspace: Workspace;
};