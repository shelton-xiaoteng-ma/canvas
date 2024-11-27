import { db } from "@/db/drizzle";
import { projects, projectsInsertSchema } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono().post(
  "/",
  verifyAuth(),
  zValidator(
    "json",
    projectsInsertSchema.pick({
      json: true,
      name: true,
      width: true,
      height: true,
    })
  ),
  async (c) => {
    const auth = c.get("authUser");
    const { name, json, width, height } = c.req.valid("json");

    const userId = auth.session?.user?.id;
    if (!auth.token?.id || !userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // const project: InferInsertModel<typeof projects> = {
    //   name,
    //   json,
    //   width,
    //   height,
    //   userId: auth.user!.id,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    const data = await db
      .insert(projects)
      .values({
        name,
        json,
        width,
        height,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!data[0]) {
      return c.json({ error: "Something went wrong" }, 400);
    }

    return c.json({ data: data[0] });
  }
);

export default app;
