import {useState, createContext, useRef, useEffect} from 'react'
import styled from "styled-components"
import { IAppController } from '../../../App';
import { DefaultProps } from './interfaces';
import { NotesController } from './controller';
import colors from '../../components/colors';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Editor } from '@z3ro/mdparser';

const Notes_css = styled.div`
  height: 100%;
  ` 
const Home_css = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      height: 90vh;
      width: 90vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;

      > div {
        background-color: ${colors.g.three};
        color: ${colors.n.one};
        display: flex;
        align-items: center;
        justify-content: center;

        > span {
          font-size: 3rem;
          font-weight: bold;
        }

        transition: .2s;
        
        :hover {
          transform: scale(1.05);
          cursor: pointer;
          background-color: ${colors.n.two};
          box-shadow: 3px 3px 7px 4px rgba(0,0,0,0.3);
        }
      }
    }    
  `

const NotesManager_css = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
  `

const Navigation_css = styled.div`
    display: flex;

  `

const NavContentList_css = styled.div`
    width: 300px;
    height: 100%;
    background-color: ${colors.g.six};

    > div {
      width: 300px;
      background-color: ${colors.g.two};

      > button {
        margin: 5px;
      }
    }

    > ul {
      list-style: none;
      padding: 0;
      margin: 0;
      color: ${colors.n.one};
      overflow: auto;


      .list-title:first-child {
        background-color: ${colors.g.four};
        font-size: 1rem;
        color: ${colors.n.one};

        > li:first-child {
          font-size: .70rem;
        }
      }

      .list-title {
        background-color: ${colors.g.five};
        color: ${colors.g.nine};
        font-size: .8rem;
        padding: 3px;
      }

      .list-item {
        background-color: ${colors.g.six};
        padding: 5px;

        :hover {
          background-color: ${colors.g.seven};
          cursor: pointer;
        }
      }
      .list-input > input {
        outline: none;
        border: none;
        padding: 5px;
        color: ${colors.n.one};
        background-color: ${colors.g.five};
        box-shadow: inset 3px 4px 2px 2px rgba(0,0,0,0.3);
        width: 100%;
      }
    }
  `

const NavMenu_css = styled.div`
    background-color: ${colors.g.two};
    width: 50px;
    height: 100%;
    >button {
      margin: 5px;
    }
  `

const Page_css = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;

    .page-menu {
      background-color: ${colors.g.seven};
      color: ${colors.n.one};
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }

    .page-name {
      font-size: 1.1rem;
      font-weight: bold;
      padding: 5px;

      > span:first-child {
        font-size: .75rem;
        font-weight: normal;
      }
    }

  `
const MdArea_css = styled.div<{isEditorOpen: boolean}>`
    height: 100%;
    width: 100%;
    display: flex;
    min-height: 0;
    

    .md-editor {
      ${({isEditorOpen}) => isEditorOpen ? 'width: 50%;' : 'display: none'};
      height: 100%;
      resize: none;
      
      background-color: ${colors.g.six};
      color: ${colors.g.fourteen};

      > pre {
        margin:0;
        height: 100%;
        padding: 1em;
        font-size: 1rem;
        padding-bottom: 200px;
        overflow: auto;

        :focus {
          outline: none;
          border: 1px solid ${colors.n.two};
          box-shadow: inset 5px 5px 5px 2px rgba(0,0,0,.1);
        }
      }
    }

    span.marker {
      color: purble;
    }

    .md-viewer {
      width: ${({isEditorOpen}) => isEditorOpen ? '50%' : '100%'};
      height: 100%;
      overflow: auto;

      background-color: ${colors.g.six};
      color: ${colors.g.fourteen};
      padding: 1em;
      font-size: 1rem;
      box-shadow: inset 5px 5px 5px 2px rgba(0,0,0,.1);
      padding-bottom: 200px; 

      
      > pre {
        max-width: 1080px;
        margin: 0 auto;

        h1, h2, h3, h4, h5, h6 {
          color: ${colors.g.thirteen};
        }

        strong {
          color: white;
        }

        a {
          color: ${colors.n.four}
        }
        
        .code-block {
          padding: .5em;
          background-color: ${colors.g.five};
          border: 1px solid ${colors.g.seven};
          box-shadow: inset 2px 3px 4px ${colors.g.three};
          border-radius: 5px;
        }
        .code-span {
          padding: 0 .25em;
          background-color: ${colors.g.five};
          border: 1px solid ${colors.g.seven};
          box-shadow: inset 2px 3px 4px ${colors.g.three};
          border-radius: 2px;
        }
      }
    }
  `

export function Notes(props: {AppController: IAppController}) {
  //const AppController = props.AppController;
  const controller = NotesController({AppController: props.AppController});

  return  <Notes_css>
            {controller.navState.length === 0 && <Home controller={controller}/>}
            {controller.navState.length >= 1 && <NotesManager controller={controller}/>}
          </Notes_css>
}

function Home(props: DefaultProps) {
  const { controller } = props
  const navigate = useNavigate()

  return  <Home_css>
            <div>
              <div onClick={() => {controller.setCategory('projects')}}>
                <span>Projects</span>
              </div>
              <div onClick={() => {controller.setCategory('study')}}>
                <span>Study</span>
              </div>
              <div onClick={() => {controller.setCategory('journal')}}>
                <span>Journal</span>
              </div>
              <div onClick={() => {controller.setCategory('misc')}}>
                <span>Misc</span>
              </div>
            </div>
          </Home_css>
}

function NotesManager(props: DefaultProps) {
  const { controller } = props;
  return  <NotesManager_css>
            <Navigation controller={controller}/>
            {controller.pageState.length > 0 && <Page controller={controller} />}
          </NotesManager_css>
}

function Navigation(props: DefaultProps) {
  const { controller } = props;

  let content: JSX.Element|null = null;

  if (controller.navState.length === 1)
    content = <CategoryContentList controller={controller} />
  else if (controller.navState.length === 2)
    content = <NotebookContentList controller={controller} />
  else if (controller.navState.length >= 3)
    content = <SectionContentList controller={controller} />

  return  <Navigation_css>
            <NavMenu_css>
              <button onClick={()=> controller.setPath('__back')}>{'\u{1f519}'}</button>
            </NavMenu_css>
            <NavContentList_css>
              <div>
                <button onClick={() => controller.setInputAux('section')}>{'\u2795 s'}</button>
                { controller.navState.length > 1 && <button onClick={() => controller.setInputAux('page') }>{'\u2795 p'}</button> }
              </div>
              { content }
            </NavContentList_css>            
          </Navigation_css>
}

function CategoryContentList(props: DefaultProps) {
  const { categoryContent, setNotebook, inputAux, createNew, newItemInputField, setNewItemInputField, navState, categoryListItemContextMenu } = props.controller;

  return  <ul>
            <li className='list-title'>
              <li>
                {navState.slice(0,navState.length-1).toString().replace(/,/g, '/')}
              </li>
              <li>
                {navState[navState.length-1]}
              </li>
            </li>
            <li className='list-title'>Notebooks</li>
            {
              categoryContent.map( item => <li className="list-item" onClick={() => setNotebook(item)} onContextMenu={(event)=> categoryListItemContextMenu(event, item)}>{item}</li>)
            }
            {
              inputAux && <li className="list-input">
                            <input value={newItemInputField} onChange={(e)=> setNewItemInputField(e.target.value)} onBlur={() => createNew(inputAux)} placeholder={'new '+inputAux} autoFocus />
                          </li>
            }
          </ul>
}

function NotebookContentList(props: DefaultProps) {//fix name of states
  const { notebookContent, setSection, setPage, inputAux, createNew, newItemInputField, setNewItemInputField, navState, notebookListItemContextMenu} = props.controller;
  
  return  <ul>
            <li className='list-title'>
              <li>
                {navState.slice(0,navState.length-1).toString().replace(/,/g, '/')}
              </li>
              <li>
                {navState[navState.length-1]}
              </li>
            </li>
            <li className='list-title'>Sections</li>
            {
              notebookContent.map( item => !item.match(/\.md$/) && <li className="list-item" onClick={() => setSection(item)} onContextMenu={(e) => notebookListItemContextMenu(e, item)}>{item}</li>)
            }
            <li className='list-title'>Pages</li>
            {
              notebookContent.map( item => item.match(/\.md$/) && <li className="list-item" onClick={() => setPage(item)} onContextMenu={(e) => notebookListItemContextMenu(e, item)}>{item}</li>)
            }
            {
              inputAux && <li className="list-input">
                            <input value={newItemInputField} onChange={(e)=> setNewItemInputField(e.target.value)} onBlur={() => createNew(inputAux)} placeholder={'new '+inputAux} autoFocus />
                          </li>
            }
          </ul>
}

function SectionContentList(props: DefaultProps) {//fix name of states
  const { sectionContent, setSection, setPage, inputAux, createNew, newItemInputField, setNewItemInputField, navState, sectionListItemContextMenu } = props.controller;

  return  <ul>
            <li className='list-title'>
              <li>
                {navState.slice(0,navState.length-1).toString().replace(/,/g, '/')}
              </li>
              <li>
                {navState[navState.length-1]}
              </li>
            </li>
            <li className='list-title'>Sections</li>
            {
              sectionContent.map( item => !item.match(/\.md$/) && <li className="list-item" onClick={() => setSection(item)} onContextMenu={(e) => sectionListItemContextMenu(e, item)}>{item}</li>)
            }
            <li className='list-title'>Pages</li>
            {
              sectionContent.map( item => item.match(/\.md$/) && <li className="list-item" onClick={() => setPage(item)} onContextMenu={(e) => sectionListItemContextMenu(e, item)}>{item}</li>)
            }
            {
              inputAux && <li className="list-input">
                            <input value={newItemInputField} onChange={(e)=> setNewItemInputField(e.target.value)} onBlur={() => createNew(inputAux)} placeholder={'new '+inputAux} autoFocus />
                          </li>
            }
          </ul>
}

function Page(props: DefaultProps) {
  const { controller } = props;
  const { category, notebook, section, page } = controller.pageState[0];

  useEffect(()=>{
    controller.getPageContent(category, notebook, section, page);
    Editor(controller.textareaRef.current as Element, controller.onEditorTextareaFieldChange)
  },[])

  return  <Page_css>
            <div className='page-menu'>
              <div>
                <button onClick={()=> controller.saveNote()} disabled={controller.pageState === null}>{'🖭'}</button>
                <button onClick={()=> controller.setIsEditorOpen(!controller.isEditorOpen)}>{'\u{1F589}'}</button>
              </div>
              <div className='page-name'>
                <span>{`${category}/${notebook}/${section}`}</span>
                <span>{!controller.isSaved && '*'}{page.replace(/\.md$/, '')}</span>
              </div>
            </div>
            <MdArea_css isEditorOpen={controller.isEditorOpen}>
              <div className='md-editor'>
                  <pre
                    className='language-markdown' 
                    ref={controller.textareaRef}
                    // onInput={controller.onEditorTextareaFieldChange}
                    contentEditable
                  ></pre>
              </div> 
              <div className='md-viewer'>
                <pre ref={controller.viewerRef}>

                </pre>
              </div>
            </MdArea_css>
          </Page_css>
}

