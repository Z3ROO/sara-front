import * as NotesAPI from './NotesAPI';
import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import { INotesController, INotesTree, ITree, INotesTreeNode } from "./NotesTypes";

import { IAppController, useMainStateController } from '../../core/App';

import Tree from './NotesTreeDS';
import { useLocation } from '../../lib/Router/RouterHooks';

export const NotesControllerContext = createContext<INotesController|null>(null);

export function useNotesController() {
  return useContext(NotesControllerContext);
}

export function NotesController(): INotesController {
  const {} = useMainStateController()!;
  const notesTreeRef = useRef<ITree>(new Tree(['general', 'projects', 'study', 'journal']))
  const [notesTree, setNotesTree] = useState<ITree>(notesTreeRef.current);
  const [newItemField, setNewItemField] = useState<'file'|'folder'|null>(null);

  async function updateNotesTree(category?: string) {
    if (category == null)
      return setNotesTree({...notesTreeRef.current});

    const response = await NotesAPI.getNotesTreeListing(category);

    notesTreeRef.current.updateTree(response);
    setNotesTree({...notesTreeRef.current});
    
  }

  async function getMarkdownFileContent(path: string[]) {
    await updateNotesTree(path[1]);
    let node = notesTreeRef.current.findNode(path.slice(1));
    const response = await NotesAPI.getPageContent(node.path);
    return {...node, content: response};
  }

  async function createNewItem(directory: string[], name: string) {
    if (name.length > 2) {
      if (newItemField === 'folder')
        await NotesAPI.createFolder(directory, name);
      
      if (newItemField === 'file')
        await NotesAPI.createNote(directory, name);

      await updateNotesTree(directory[0]);
    }
    
    setNewItemField(null);
  }

  async function deleteNote(directory: string[]) {
    await NotesAPI.deleteNote(directory);
    
      notesTreeRef.current.remove(directory);
      await updateNotesTree();
    
  }

  async function deleteFolder(directory: string[]) {
    await NotesAPI.deleteFolder(directory);
    
    notesTreeRef.current.remove(directory);
    await updateNotesTree();    
  }

  async function saveNote(path: string[], content: string) {
    NotesAPI.saveNote(path, content);
  }

  return {
    // =========================== //
    // STATE ===================== //
    notesTree,
    newItemField, setNewItemField,
    // =========================== //
    // METHODS =================== //
    updateNotesTree,
    getMarkdownFileContent,
    createNewItem,
    saveNote,
    deleteNote,
    deleteFolder,
    // =========================== //
  }
}
