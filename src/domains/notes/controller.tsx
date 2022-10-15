import * as NotesAPI from './NotesAPI';
import React, { useState, useRef, createContext, useContext } from 'react';
import { INotesController, NavState, PageMetaData, INotesTree, ITree } from "./interfaces";
import mdParser,{Editor} from '@z3ro/mdparser'
import he from 'he';
import { IAppController } from '../../core/App';

import {marked} from 'marked';
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
  const {traversePath} = useLocation()!

  async function updateNotesTree(directory?: string[]) {
    if (!directory) {
      setNotesTree({...notesTree});
      return;
    }

    const fetchedBranch = await NotesAPI.getNotesTreeListingBranch(directory);

    notesTreeRef.current.insert(fetchedBranch, directory);

    setNotesTree({...notesTreeRef.current});
  }

  function openMarkdownFile(directory: string[]) {
    traversePath(directory);
  }

  return {
    notesTree,
    updateNotesTree,
    openMarkdownFile
  }
}


// function parseFetchedNotes(notes:any[]):INotesTreeBranch {
//   const result: INotesTreeBranch = {}

//   for (const node of notes) {
//     result[node.name] = {
//       title: node.name.replace(/_/g, ' '),
//       type: node.type,
//       state: node.type === 'folder' ? 'closed' : 'upToDate'
//     }
    
//     if (node.type === 'folder')
//       result[node.name].content = {};
//   }

//   return result;
// }






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