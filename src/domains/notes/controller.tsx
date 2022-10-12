import * as NotesAPI from './NotesAPI';
import React, { useState, useRef, createContext, useContext } from 'react';
import { NotesControllerType, NavState, PageMetaData } from "./interfaces";
import mdParser,{Editor} from '@z3ro/mdparser'
import he from 'he';
import { IAppController } from '../../core/App';

import {marked} from 'marked';

export const NotesControllerContext = createContext<NotesControllerType|null>(null);

export function useNotesController() {
  return useContext(NotesControllerContext);
}

export function NotesController(props: {AppController: IAppController}): NotesControllerType {
  const appController = props.AppController;
  
  const [navState, setNavState] = useState<string[]>([]);
  const [pageState, setPageState] = useState<PageMetaData[]>([]);

  const [inputAux, setInputAux] = useState<string>('');//aux to add folder/page - maintains which and if present the input field is also present

  const [editorTextareaField, setEditorTextareaField] = useState<string>('');
  const textareaRef = useRef<HTMLPreElement>(null);

  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  function onEditorTextareaFieldChange(event: Event) {
    let val = ((event.target! as Element).textContent||'');

    setIsSaved(false)

    if (viewerRef.current)
      viewerRef.current.innerHTML = marked.parse(val);
  }

  const [categoryContent, setCategoryContent] = useState<string[]>([]);
  const [notebookContent, setNotebookContent] = useState<string[]>([]);
  const [sectionContent, setSectionContent] = useState<string[]>([]);

  const viewerRef = useRef<HTMLPreElement>(null);

  function categoryListItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string) {
    appController.contextMenuHandler(event, [
      {title: 'Abrir', action:()=>{
        setNotebook(item);
      }},
      {title: 'Editar', action:()=>{}},
      {title: 'Excluir', action:()=>{
        //deleteNotebook(item);
      }}
    ]);
  }

  function listItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string) {
    appController.contextMenuHandler(event, [
      {title: 'Abrir', action:()=>{
        if (item.match(/\.md$/))
          setPage(item);
        else
          setSection(item);
      }},
      {title: 'Editar', action:()=>{}},
      {title: 'Excluir', action:()=>{
        // if (item.match(/\.md$/))
        //   deletePage(item);
        // else
        //   deleteSection(item);
      }}
    ]);
  }

  async function getCategoryContent(category: string) {
    const res = await NotesAPI.getCategoryContent(category);
    setCategoryContent(res);
  }

  async function getNotebookContent(category: string, notebook: string) {
    const res = await NotesAPI.getNotebookContent(category, notebook);
    setNotebookContent(res);
  }

  async function getSectionContent(category: string, notebook: string, section: string) {
    const res = await NotesAPI.getSectionContent(category, notebook, section);
    setSectionContent(res);
  }

  async function getPageContent(category: string, notebook: string, section: string, page: string) {
    const res = await NotesAPI.getPageContent(category, notebook, section, page);

    setEditorTextareaField(res);

    if (viewerRef.current)
      viewerRef.current.innerHTML = marked.parse(res);
    if (textareaRef.current) {
      textareaRef.current.innerHTML = mdParser.parse(he.escape(res));
    }

    setIsSaved(true)
  }

  function setCategory(category: string) {
    getCategoryContent(category).catch(err => console.log(err));
    setPath(category);
  }

  function setNotebook(notebook: string) {
    const category = navState[0];
    getNotebookContent(category, notebook);
    setPath(notebook);
  }

  function setSection(section: string) {
    const category = navState[0];
    const notebook = navState[1];
    
    if (navState.length >= 3){
      getSectionContent(category, notebook, navState.slice(2,navState.length).toString().replace(/,/g,'/')+'/'+section);
      setPath(section);
    }else{
      getSectionContent(category, notebook, section);
      setPath(section);
    }  
  }

  function setPage(page: string) {
    const category = navState[0];
    const notebook = navState[1];
    const section = navState.slice(2,navState.length).toString().replace(/,/g,'/');

    getPageContent(category, notebook, section, page);
    setPageState([{
      category,
      notebook,
      section,
      page
    }]);
  }

  function createNew(type: string, title: string) {
    if (title === '') 
      return setInputAux('');
    
    if (type === 'section')
      createSection(title);
    else if (type === 'page')
      createPage(title);
  }

  async function createSection(name: string) {
    const pathDir = navState.toString().replace(/,/g,'/');
    const res = NotesAPI.createSection(name, pathDir)

    setInputAux('');

    if (navState.length === 1)
      getCategoryContent(navState[0])
    else if (navState.length === 2)
      getNotebookContent(navState[0], navState[1])
    else if (navState.length >= 3)
      getSectionContent(navState[0], navState[1], navState.slice(2,navState.length).toString().replace(/,/g, '/'))
  }

  async function createPage(name: string) {
    const pathDir = navState.toString().replace(/,/g,'/')
    
    const res = NotesAPI.createPage(name, pathDir);

    setInputAux('');

    if (navState.length === 1)
      getCategoryContent(navState[0])
    else if (navState.length === 2)
      getNotebookContent(navState[0], navState[1])
    else if (navState.length >= 3)
      getSectionContent(navState[0], navState[1], navState.slice(2,navState.length).toString().replace(/,/g, '/'))
  }

  function setPath(arg:string) {
    if (arg === '__back'){
      const newNavState = navState.filter((p, i) => i !== navState.length-1)
      if (newNavState.length === 1)
        getCategoryContent(newNavState[0])
      else if (newNavState.length === 2)
        getNotebookContent(newNavState[0], newNavState[1])
      else if (newNavState.length >= 3)
        getSectionContent(newNavState[0], newNavState[1], newNavState.slice(2,newNavState.length).toString().replace(/,/g, '/'))

      return setNavState(newNavState);
    }
    setNavState( state => state.concat(arg))
  }


  async function saveNote() {
    if (!Array.isArray(pageState) || pageState.length === 0)
      return;

    const {category, notebook, section, page} = pageState[0];

    const res = await NotesAPI.saveNote(category, notebook, section, page, editorTextareaField);

    setIsSaved(true);
  }


  return {
    navState,
    editorTextareaField, onEditorTextareaFieldChange,
    textareaRef,
    isEditorOpen, setIsEditorOpen,
    isSaved,
    inputAux, setInputAux,

    pageState,

    viewerRef,

    setPath,

    categoryListItemContextMenu,
    listItemContextMenu,

    categoryContent,
    notebookContent,
    sectionContent,

    setCategory,
    setNotebook,
    setSection,
    setPage,

    getPageContent,

    createNew,

    saveNote
  }
}