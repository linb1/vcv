# Interview-Trexquant: Version Control Visualizer

<img width="1000" alt="image" src="https://github.com/user-attachments/assets/ff523dd3-02de-4fcb-a487-836ac90d164b">


This application lets you add nodes to a history as well as add/edit comments to a node.

[Live Link](https://main.d2db2rn861mmy2.amplifyapp.com/)

[Figma Link](https://www.figma.com/design/PLkgr1tvAdU57eocVlGDZk/Interview-Assessment-(Copy)?node-id=2021-2&t=1PmKGr2jE6YQjR3D-1)

## Technologies
 - Frontend: NextJS, Redux, D3 Trees
 - Backend: Express, Prisma, PostgreSQL

Next.js and Redux/RTK Query on the client-side initiate requests that are sent to Express API endpoints on the server-side. Express routes these requests to controllers, which interact with the Prisma Client for database operations. Prisma Client communicates with PostgreSQL to perform actions and returns the results through Prisma to the controllers and back to Express. The response is then sent to RTK Query and received by the user. React D3 Trees is used to render a Tree that allows node data to be visualized in a tree structure to represent a version control (such as git).

## Versions
 - Express 4.19.2
 - Prisma 5.18.0
 - Next 14.2.5
 - Redux 9.1.2
 - Node v22.5.1
 - npm 10.8.2

## Features/Requirements

User requirements:

- Add a new node to the history.
- Branch off of a node in the history.
- View the path to the original node.
- Be able to add and edit comments to any node.
- The state of the version history should persist between sessions of your application.

## Add new node/branch off a node in the history

Users can click on a node to open up a modal with the option to create a node by adding a name. A POST request will be sent and return a new node tree to be rendered

```typescript
export const getNodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const nodes = await prisma.nodes.findMany();

    const nodeMap: Record<string, any> = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = {
        name: node.name,
        attributes: {
          id: node.id.toUpperCase(),
          path: node.path,
        },
        children: [],
      };
    });

    let root: any = null;
    nodes.forEach((node) => {
      if (node.prev === null) {
        root = nodeMap[node.id];
      } else {
        if (nodeMap[node.prev]) {
          nodeMap[node.prev].children.push(nodeMap[node.id]);
        }
      }
    });

    res.json(root);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving nodes" });
  }
};
```

This function formats all the nodes so that the root node will have an array of it's children, and it's children will also have an array of children. Creating a new node will automatically run this code.


## View the path to the original node

User can hover over a node and see it's path to the original node highlighted in red.

```typescript
const findBranchUpToRoot = (
  node: RawNodeDatum | null,
  id: string
): RawNodeDatum[] => {
  if (!node) return [];
  if (node.attributes?.id === id) return [node];

  let branch: RawNodeDatum[] = [];

  if (node.children) {
    for (const child of node.children) {
      const result = findBranchUpToRoot(child, id);
      if (result.length) {
        branch = [node, ...result];
        break;
      }
    }
  }
  return branch;
};
```

This function takes in the selected node and performs a recursion operation that looks for a matching node id. On success, it will return every node on it's way to the result. The array of nodes is used to determine which node is hightlighted on the tree.

## Add and edit comments to any node

Users can click on a node and add a comment. Users can also edit a comment after it has been created.

```typescript
import React, { useState } from "react";
import { useUpdateCommentMutation } from "@/state/api";
import { UserRound, Pencil, Save } from "lucide-react";

type CommentProps = { comment: { id: number; text: string; } };

const Comment = ({ comment }: CommentProps) => {
  const [updateComment] = useUpdateCommentMutation();
  const [displayedText, setDisplayedText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  ...
  return (
    <div>
      ...
    </div>
  );
};

export default Comment;
```
This Comment component allows for users to edit and save comments. It only sends a PUT request if the input is valid

## History persist between sessions of your application

```typescript
const persistConfig = {
  timeout: 500,
  key: "root",
  storage,
  whitelist: ["global"],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
```

This code utilizes redux-persist to persist sessions of the application

