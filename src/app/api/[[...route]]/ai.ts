import { replicate } from "@/lib/replicate";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().post(
  "/generate-image",
  verifyAuth(),
  zValidator("json", z.object({ prompt: z.string() })),
  async (c) => {
    const input = {
      cfg: 3.5,
      steps: 28,
      prompt: c.req.valid("json").prompt,
      aspect_ratio: "3:2",
      output_format: "webp",
      output_quality: 90,
      negative_prompt: "",
      prompt_strength: 0.85,
    };

    const output = await replicate.run("stability-ai/stable-diffusion-3", {
      input,
    });

    // for (const [index, item] of Object.entries(output)) {
    //   await writeFile(`./output_${index}.png`, item);
    // }
    const res = output as Array<{ url: () => string }>;
    return c.json({ data: res[0].url() });
  }
);

export default app;
