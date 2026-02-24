import { createAuthClient } from "better-auth/client";
import { adminClient, multiSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [multiSessionClient(), adminClient()],
});
