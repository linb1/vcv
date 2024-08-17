import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import nodeRoutes from "./routes/nodeRoutes";
import commentRoutes from "./routes/commentRoutes";
import nodeAndCommentRoutes from "./routes/nodeAndCommentRoutes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//Routes
app.use("/nodes", nodeRoutes);
app.use("/comments", commentRoutes);
app.use("/nodesAndComments", nodeAndCommentRoutes);

//Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
