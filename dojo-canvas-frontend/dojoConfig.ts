import manifest from "../dojo-canvas-frontend/src/dojo/generated/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
  manifest,
  rpcUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
  toriiUrl: import.meta.env.VITE_PUBLIC_TORII,
  masterAddress: import.meta.env.VITE_PUBLIC_MASTER_ADDRESS,
  masterPrivateKey: import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY,
  accountClassHash: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
});
