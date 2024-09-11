# Interview-Trexquant: Version Control Visualizer


<img width="1100" alt="image" src="https://github.com/user-attachments/assets/7b146e8b-7fb8-4db7-8ac4-55b00a5576cf">



This application lets you add nodes to a history as well as add/edit comments to a node.

[Figma Link](https://www.figma.com/design/PLkgr1tvAdU57eocVlGDZk/Interview-Assessment-(Copy)?node-id=2021-2&t=1PmKGr2jE6YQjR3D-1)

## Video Demo
https://github.com/user-attachments/assets/dd8d7502-c9e2-4cb1-96f3-a12b2539e749



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

## How to run locally
 - Clone this repository
 - Create a new postgreSQL database
 - In the server directory, create an .env file. It should have two variables
     -  ```
        PORT=8000
        DATABASE_URL="postgresql://{user}:{password}@localhost:5432/{database_name}schema=public"
        ```
 - Use `npm i` to install packages
 - Use `npx prisma migrate dev` to get migrations and schema
     - If no generated client, run `npx prisma generate`
 - Use `npm run seed `to insert seed data into your database
 - Use `npm run dev` to start the server


     
 - In the client directory, create a .env.local. It should have:
      - ```
        NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
        ```
 - Use `npm i` to install packages
 - Use `npm run dev` to run the client
        
     

## Features/Requirements

User requirements:

- Add a new node to the history.
- Branch off of a node in the history.
- View the path to the original node.
- Be able to add and edit comments to any node.
- The state of the version history should persist between sessions of your application.
- BONUS: Allow the user to revert to a certain node in the history. This will delete all the nodes proceeding that node. When a user returns to your application, the reverted state should persist between sessions of your application.

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

## Delete a node and all it's descendant 

Users can click on a node to open a modal with the option to delete the node. It will delete the current node as well as it's children. This will also delete any related comments

```typescript
const handleDeleteAll = () => {
    const ids: string[] = [];

    const traverse = (currentNode: RawNodeDatum) => {
      currentNode.children?.forEach((child) => traverse(child));

      ids.push(currentNode!.attributes!.id.toString());
    };

    traverse(selectedNode);

    onDeleteNode(ids);
    closeModal();
  };
```

This function uses depth-first traversal in order to grab all of the current node's children and stores all the ids in an array. `onDeleteNode` then uses the array to delete the nodes.

```typescript
export const deleteNode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.comments.deleteMany({
      where: {
        tag: id,
      },
    });
    const deletedNode = await prisma.nodes.delete({
      where: { id },
    });
    res.json({
      message: "Node and associated comments deleted successfully",
      node: deletedNode,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting node and comments" });
  }
};
```
The node controller then deletes all the associated comments of a node before delete it

