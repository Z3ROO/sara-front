import * as NotesAPI from './NotesAPI';
import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import { INotesController, INotesTree, ITree, INotesTreeNode } from "./NotesTypes";

import { IAppController } from '../../core/App';

import Tree from './NotesTreeDS';
import { useLocation } from '../../lib/Router/RouterHooks';

export const NotesControllerContext = createContext<INotesController|null>(null);

export function useNotesController() {
  return useContext(NotesControllerContext);
}

export function NotesController(props: {AppController: IAppController}): INotesController {
  const appController = props.AppController;
  const notesTreeRef = useRef<ITree>(new Tree(['general', 'projects', 'study', 'journal']))
  const [notesTree, setNotesTree] = useState<ITree>(notesTreeRef.current);
  const [newItemField, setNewItemField] = useState<'file'|'folder'|null>(null);

  const {traversePath} = useLocation()!

  async function updateNotesTree(category?: string) {
    if (category == null)
      return setNotesTree({...notesTreeRef.current});

    const fetchedBranch = await NotesAPI.getNotesTreeListing(category);

    notesTreeRef.current.updateTree(fetchedBranch);
    console.log(notesTreeRef.current)
    setNotesTree({...notesTreeRef.current});
  }

  async function getMarkdownFileContent(path: string[]) {
    const category = path[1];
    //if (notesTreeRef.current[category].content)
    await updateNotesTree(path[1]);
    let node = notesTreeRef.current.findNode(path.slice(1));
    const content = await NotesAPI.getPageContent(node.path);
    return {...node, content};
  }

  async function createNewItem(directory: string[], name: string) {
    if (name.length > 2) {
      if (newItemField === 'folder')
        await NotesAPI.createFolder(directory, name);
      
      if (newItemField === 'file')
        await NotesAPI.createNote(directory, name);

      await updateNotesTree(directory[0])
    }
    
    setNewItemField(null);
  }

  async function deleteNote(directory: string[]) {
    await NotesAPI.deleteNote(directory);
    notesTreeRef.current.remove(directory);
    await updateNotesTree()
  }

  async function deleteFolder(directory: string[]) {
    await NotesAPI.deleteFolder(directory);
    notesTreeRef.current.remove(directory);
    await updateNotesTree()
  }

  async function saveNote(path: string[], content: string) {
    NotesAPI.saveNote(path, content);
  }

  return {
    notesTree,
    updateNotesTree,
    getMarkdownFileContent,
    createNewItem,
    saveNote,
    deleteNote,
    deleteFolder,
    newItemField, setNewItemField
  }
}