import * as NotesAPI from './NotesAPI';
import React, { useState, useRef, createContext, useContext } from 'react';
import { INotesController, INotesTree, ITree, INotesTreeNode } from "./interfaces";

import { IAppController } from '../../core/App';

import Tree from '../../lib/Tree';
import { useLocation } from '../../lib/Router/hooks';

export const NotesControllerContext = createContext<INotesController|null>(null);

export function useNotesController() {
  return useContext(NotesControllerContext);
}

export function NotesController(props: {AppController: IAppController}): INotesController {
  const appController = props.AppController;
  
  const notesTreeRef = useRef<ITree>(new Tree(['general', 'projects', 'study', 'journal']))
  const [notesTree, setNotesTree] = useState<ITree>(notesTreeRef.current);
  const [openedPage, setOpenedPage] = useState<any>({});
  const [newItemField, setNewItemField] = useState<'file'|'folder'|null>('folder');

  const {traversePath} = useLocation()!

  async function updateNotesTree(category?: string) {
    if (category == null)
      return setNotesTree({...notesTreeRef.current});

    const fetchedBranch = await NotesAPI.getNotesTreeListing(category);

    notesTreeRef.current.updateTree(fetchedBranch);
    console.log(notesTreeRef.current)
    setNotesTree({...notesTreeRef.current});
  }

  async function openMarkdownFile(path: string[]) {
    const category = path[1];
    //if (notesTreeRef.current[category].content)
    await updateNotesTree(path[1]);
    let node = notesTreeRef.current.findNode(path.slice(1));
    const content = await NotesAPI.getPageContent(node.path);
    setOpenedPage({...node, content});
  }

  async function saveNote(path: string[], content: string) {
    NotesAPI.saveNote(path, content);
  }

  return {
    notesTree,
    openedPage,
    updateNotesTree,
    openMarkdownFile,
    saveNote,
    newItemField, setNewItemField
  }
}

  // function categoryListItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string) {
  //   appController.contextMenuHandler(event, [
  //     {title: 'Abrir', action:()=>{
  //       setNotebook(item);
  //     }},
  //     {title: 'Editar', action:()=>{}},
  //     {title: 'Excluir', action:()=>{
  //       //deleteNotebook(item);
  //     }}
  //   ]);
  // }