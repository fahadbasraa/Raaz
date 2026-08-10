export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const authInitialState: AuthActionState = { status: "idle", message: "" };
