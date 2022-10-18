import { ITreeListing } from "./NotesAPI"

export interface INotesController {
  notesTree: ITree
  updateNotesTree: (category?: string) => Promise<void>
  getMarkdownFileContent: (path: string[]) => Promise<{
    content: any;
    name: string;
    path: string[];
    title: string;
    type: string;
    state?: string | undefined;
    parent: INotesTreeNode | null;
    children: INotesTree | null;
  }>
  createNewItem: (directory: string[], name: string) => Promise<void>
  saveNote: (path: string[], content: string) => Promise<void>
  newItemField: "folder" | "file" | null
  setNewItemField: React.Dispatch<React.SetStateAction<"folder" | "file" | null>>
  deleteNote: (directory: string[]) => Promise<void>
  deleteFolder: (directory: string[]) => Promise<void>
  [key: string]: any
}

export interface DefaultProps {
  controller: INotesController,
  [key:string]:any
}

export type ITree = {
  updateTree: (tree:ITreeListing, currentPath?: string[]) => void
  remove: (nodePath: string[]) => void
  findNode: (nodePath: string[]) => INotesTreeNode
  [key: string]: INotesTreeNode|((...params: any) => any)
}

export type INotesTree = {
  [key: string]: INotesTreeNode
}

export interface INotesTreeNode {
  name: string
  path: string[]
  title: string
  type: string
  state?: string
  parent: INotesTreeNode|null
  children: INotesTree|null
}