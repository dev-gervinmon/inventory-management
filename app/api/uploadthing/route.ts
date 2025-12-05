import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export *named* handlers
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
