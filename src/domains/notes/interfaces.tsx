export interface INotesController {
  notesTree: ITree
  updateNotesTree: (directory?: string[]) => Promise<void>
  openMarkdownFile: (directory: string[]) => void
  [key: string]: any
}

export type NavState = {
  title: string;
  type: string;
}

export interface DefaultProps {
  controller: INotesController,
  [key:string]:any
}

export type PageMetaData = {
  category: string;
  notebook: string;
  section: string;
  page: string;
}

//export type INotesTree = INotesTreeNode[]

export type ITree = {
  insert: (values:{[key: string]: string}[], nodePath: string[]) => void
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