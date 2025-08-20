// pages/api/movieFact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { movie } = req.body;
  if (!movie) return res.status(400).json({ error: "Missing movie" });

  // const completion = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     {
  //       role: "user",
  //       content: `Give me a fun and interesting fact about the movie "${movie}". Keep it short.`,
  //     },
  //   ],
  // });

  // const fact = completion.choices[0].message?.content;

  // Return a fake fun fact
  const funFacts = [
    `${movie} was a box office hit in its opening weekend.`,
    `The director of ${movie} won an award for their work.`,
    `${movie} features a soundtrack that topped the charts.`,
    `Fans of ${movie} often quote lines from the film.`,
    `The lead actor in ${movie} was nominated for an Oscar.`,
  ];

  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  res.status(200).json({ fact });
}
