import express from "express";
import { router as apiRouter } from "./routes/api.js";

const PORT = 3000;
export const app = express();
app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
