import express, { Request, Response } from "express";
import { bootstrap } from "./main";
 
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Servidor TypeScript rodando na porta 3030 🚀"
  });
});

bootstrap()

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
