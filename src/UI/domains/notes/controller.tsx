import React, { useState, useRef } from 'react';
import { NotesControllerType, NavState, PageMetaData } from "./interfaces";
//import {MDParser} from '../../../mdparser-dev/index'
//import {MDParser} from '@z3ro/mdparser'
import {marked} from 'marked'
import { IAppController } from '../../../App';

export function NotesController(props: {AppController: IAppController}) {
  const appController = props.AppController;
  
  const [navState, setNavState] = useState<string[]>([]);
  const [pageState, setPageState] = useState<PageMetaData[]>([]);

  const [newItemInputField, setNewItemInputField] = useState<string>('');
  const [inputAux, setInputAux] = useState<string>('');

  const [editorTextareaField, setEditorTextareaField] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  function onEditorTextareaFieldChange(event: React.ChangeEvent<HTMLTextAreaElement>|string) {
    let val:string;
    if (typeof event === 'string')
      val = event;
    else
      val = event.target.value;

    setEditorTextareaField(val)
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
        deleteNotebook(item);
      }}
    ]);
  }

  function notebookListItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string) {
    appController.contextMenuHandler(event, [
      {title: 'Abrir', action:()=>{
        if (item.match(/\.md$/))
          setPage(item)
        else
          setSection(item)
      }},
      {title: 'Editar', action:()=>{}},
      {title: 'Excluir', action:()=>{
        if (item.match(/\.md$/))
          deletePage(item)
        else
          deleteSection(item)
      }}
    ]);
  }

  function sectionListItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string) {
    appController.contextMenuHandler(event, [
      {title: 'Abrir', action:()=>{
        if (item.match(/\.md$/))
          setPage(item)
        else
          setSection(item)
      }},
      {title: 'Editar', action:()=>{}},
      {title: 'Excluir', action:()=>{
        if (item.match(/\.md$/))
          deletePage(item)
        else
          deleteSection(item)
      }}
    ]);
  }

  async function getCategoryContent(category: string) {
    const get = await fetch(`/notes/${category}/content`);
    const res = await get.json();
    
    setCategoryContent(res);
  }

  async function getNotebookContent(category: string, notebook: string) {
    const get = await fetch(`/notes/${category}/${notebook}/content`);
    const res = await get.json();
    console.log(res)
    setNotebookContent(res);
  }

  async function getSectionContent(category: string, notebook: string, section: string) {
    const headers = {
      method: 'post',
      body: JSON.stringify({section}),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    const post = await fetch(`/notes/${category}/${notebook}/section/content`, headers);
    const res = await post.json();

    setSectionContent(res);
  }

  async function getPageContent(category: string, notebook: string, section: string, page: string) {
    const headers = {
      method: 'post',
      body: JSON.stringify({section, page}),
      headers: {
        'Content-Type':'application/json; charset=utf-8'
      }
    }

    console.log(section)
    const post = await fetch(`/notes/${category}/${notebook}/section/page`, headers);
    const res = await post.json();

    setEditorTextareaField(res);

    if (viewerRef.current)
      viewerRef.current.innerHTML = marked.parse(res);

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

  function createNew(type: string) {
    if (newItemInputField === '') return setInputAux('')
    if (type === 'section')
      createSection()
    else if (type === 'page')
      createPage()
  }

  async function createSection() {
    const pathDir = navState.toString().replace(/,/g,'/')
    const headers = {
      method: 'post',
      body: JSON.stringify({name: newItemInputField, pathDir}),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const post = await fetch('/notes/new-section', headers);
    const res = await post.json();
    setInputAux('');
    setNewItemInputField('');

    if (navState.length === 1)
      getCategoryContent(navState[0])
    else if (navState.length === 2)
      getNotebookContent(navState[0], navState[1])
    else if (navState.length >= 3)
      getSectionContent(navState[0], navState[1], navState.slice(2,navState.length).toString().replace(/,/g, '/'))
  }

  async function createPage() {
    const pathDir = navState.toString().replace(/,/g,'/')
    
    const headers = {
      method: 'post',
      body: JSON.stringify({name: newItemInputField, pathDir}),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    const post = await fetch('/notes/new-page', headers);
    const res = await post.json();
    setInputAux('');
    setNewItemInputField('');

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
    if (!Array.isArray(pageState) || pageState.length === 0) return

    const {category, notebook, section, page} = pageState[0];

    const put = await fetch(`/notes/${category}/${notebook}/section/page/save`, {
      method: 'put',
      body: JSON.stringify({content: editorTextareaField, section, page}),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    const res = await put.json();

    setIsSaved(true);
  }

  async function deleteNotebook(item: string) {

    const delete_ = await fetch(`/notes/${navState[0]}/${item}/notebook/delete`, {method: 'delete'});
    const res = await delete_.json();
    
    if (res.ok)
      if (navState.length === 1)
        getCategoryContent(navState[0])
      else if (navState.length === 2)
        getNotebookContent(navState[0], navState[1])
      else if (navState.length >= 3)
        getSectionContent(navState[0], navState[1], navState.slice(2,navState.length).toString().replace(/,/g, '/'))
  }

  async function deleteSection(item: string) {
    const headers = {
      method: 'delete',
      body: JSON.stringify({section:navState.slice(2,navState.length).toString().replace(/,/g, '/')+'/'+item}),
      headers: {
        'Content-type':'application/json; charset=utf-8'
      }
    }

    const delete_ = await fetch(`/notes/${navState[0]}/${navState[1]}/section/delete`, headers);
    const res = await delete_.json();
    
    if (res.ok)
      if (navState.length === 1)
        getCategoryContent(navState[0])
      else if (navState.length === 2)
        getNotebookContent(navState[0], navState[1])
      else if (navState.length >= 3)
        getSectionContent(navState[0], navState[1], navState.slice(2,navState.length).toString().replace(/,/g, '/'))
  }

  async function deletePage(item: string) {
    let body: {category: string, notebook: string, section: string, page: string};

    if (item)
      body = {category: navState[0], notebook: navState[1], section: navState.slice(2,navState.length).toString().replace(/,/g, '/'), page: item}
    else 
      body = {category: pageState[0].category, notebook: pageState[0].notebook, section: pageState[0].section, page: pageState[0].page}

    
    const headers = {
      method: 'delete',
      body: JSON.stringify({section: body.section, page: body.page}),
      headers: {
        'Content-type':'application/json; charset=utf-8'
      }
    }

    const delete_ = await fetch(`/notes/${body.category}/${body.notebook}/page/delete`, headers);
    const res = await delete_.json();
    
    if (res.ok)
      if (navState.length === 1)
        getCategoryContent(navState[0])
      else if (navState.length === 2)
        getNotebookContent(navState[0], navState[1])
      else if (navState.length >= 3)
        getSectionContent(navState[0], navState[1], navState.slice(2,navState.length).toString().replace(/,/g, '/'))
  }


  return {
    navState,
    newItemInputField, setNewItemInputField,
    editorTextareaField, onEditorTextareaFieldChange,
    textareaRef,
    isEditorOpen, setIsEditorOpen,
    isSaved,
    inputAux, setInputAux,

    pageState,

    viewerRef,

    setPath,

    categoryListItemContextMenu,
    notebookListItemContextMenu,
    sectionListItemContextMenu,

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