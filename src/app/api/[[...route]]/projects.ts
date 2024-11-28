import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
  "/:id",
  verifyAuth(),
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const auth = c.get("authUser");
    const { id } = c.req.valid("param");

    const userId = auth.session?.user?.id;
    if (!auth.token?.id || !userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    if (data?.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data: data[0] });
  }
);
// .post(
//   "/",
//   verifyAuth(),
//   zValidator(
//     "json",
//     projectsInsertSchema.pick({
//       json: true,
//       name: true,
//       width: true,
//       height: true,
//     })
//   ),
//   async (c) => {
//     const auth = c.get("authUser");
//     const { name, json, width, height } = c.req.valid("json");

//     const userId = auth.session?.user?.id;
//     if (!auth.token?.id || !userId) {
//       return c.json({ error: "Unauthorized" }, 401);
//     }

//     // const project: InferInsertModel<typeof projects> = {
//     //   name,
//     //   json,
//     //   width,
//     //   height,
//     //   userId: auth.user!.id,
//     //   createdAt: new Date(),
//     //   updatedAt: new Date(),
//     // };

//     const data = await db
//       .insert(projects)
//       .values({
//         name,
//         json,
//         width,
//         height,
//         userId: userId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();

//     if (!data[0]) {
//       return c.json({ error: "Something went wrong" }, 400);
//     }

//     return c.json({ data: data[0] });
//   }
// );

export default app;
