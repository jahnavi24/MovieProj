// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { email, name, photoURL, favoriteMovie, googleId } = req.body;

      if (!email || !googleId || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          photoURL,
          favoriteMovie,
        },
        create: {
          email,
          name,
          photoURL,
          favoriteMovie,
          googleId,
        },
      });

      res.status(200).json(user);

    } else if (req.method === "GET") {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: "Missing email" });

      const user = await prisma.user.findUnique({ where: { email: String(email) } });
      res.status(200).json(user);

    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
