import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Flashcards } from './UI/domains/flashcards/Flashcards';
import { Notes } from './UI/domains/notes/Notes'
import TestPage from './TestPage'
import { ContextMenu } from './UI/components/ContextMenu';
import Stats from './UI/domains/stats/Stats';

export type IAppController = {
  modal: any;
  modalHandler(ModalContent?: any, controller?: any): void
  contextMenu: null|JSX.Element;
  contextMenuHandler(event: React.MouseEvent<HTMLDivElement|HTMLLIElement, MouseEvent>, options: {
    title: string;
    action(): void;
  }[]): void
}

export const AppControllerContext = createContext<IAppController|null>(null);

export function AppController(): IAppController {
  const [modal, setModal] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<null|JSX.Element>(null);

  function contextMenuHandler(event: React.MouseEvent<HTMLDivElement|HTMLLIElement, MouseEvent>, options: {title: string, action(): void}[]) {
    event.preventDefault();
    setContextMenu(<ContextMenu xPos={event.clientX} yPos={event.clientY} options={options}/>);
  }

  function modalHandler(Component?:any) {
    if(Component === undefined)
      return setModal(null)

    setModal(Component)
  }
  
  useEffect(()=> {
    function handler() {
      setContextMenu(null)
      window.removeEventListener('click', handler)
    }

    if (contextMenu)
      window.addEventListener('click', handler)
      
  }, [contextMenu])

  return {
    modal,
    modalHandler,
    contextMenu,
    contextMenuHandler
  }
}

function App() {
  const controller = AppController()

  return  <div className="h-screen bg-gray-800">
            <AppControllerContext.Provider value={controller}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Stats />} />
                  <Route path="/teste" element={<TestPage />} />
                  <Route path="/notes" element={<Notes AppController={controller} />} />
                  <Route path="/fc" element={<Flashcards AppController={controller} />} />
                </Routes>
              </BrowserRouter>
              {controller.contextMenu}
              {controller.modal && <Modal controller={controller} />}
            </AppControllerContext.Provider>
          </div>
}

export function Modal(props: any) {
  const controller = props.controller;

  return  <div className="absolute w-full h-full bg-slate-300 bg-opacity-30 top-0 left-0 flex justify-center items-center">
            <div className="bg-slate-600 rounded p-4 relative">
              <div>
                {/* {AppController?.modal} */}
                {controller.modal({controller: controller})}
              </div>              
              <button className="absolute bg-slate-200 p-1 hover:cursor-pointer hover:bg-slate-700 top-1 right-1" onClick={() => controller.modalHandler()}>x</button>
            </div>
          </div>
}

export default App;
