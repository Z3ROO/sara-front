import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Flashcards } from '../domains/flashcards/Flashcards';
import { Notes } from '../domains/notes/Notes'
import TestPage from '../TestPage'
import { ContextMenu } from '../domains/_general/ContextMenu';
import Stats from '../domains/stats/Stats';
import { Router, Route } from '../lib/Router';

export type IAppController = {
  modal: any;
  modalHandler(ModalContent?: any, controller?: any): void
  contextMenu: null|JSX.Element;
  contextMenuHandler(event: React.MouseEvent<Element, MouseEvent>, options: {
    title: string;
    action(): void;
  }[]): void
}

export const AppControllerContext = createContext<IAppController|null>(null);

export function useMainStateController() {
  return useContext(AppControllerContext);
}

export function AppController(): IAppController {
  const [modal, setModal] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<null|JSX.Element>(null);

  function contextMenuHandler(event: React.MouseEvent<Element, MouseEvent>, options: {title: string, action(): void}[]) {
    event.preventDefault();
    setContextMenu(<ContextMenu xPos={event.clientX} yPos={event.clientY} options={options}/>);
  }

  function modalHandler(component?: any, props?: any) {
    if (!component)
      return setModal(null)
    
    setModal({component, props});
  }
  
  useEffect(()=> {
    function handler() {
      setContextMenu(null)
      window.removeEventListener('click', handler)
    }

    if (contextMenu)
      window.addEventListener('click', handler)
      
  }, [contextMenu]);

  return {
    modal,
    modalHandler,
    contextMenu,
    contextMenuHandler
  }
}

function App() {
  const controller = AppController()

  return  <AppControllerContext.Provider value={controller}>
            <div className="h-screen bg-gray-800">
              <Router>                
                <Stats path="/" />
                <Route path="/teste" element={<TestPage />} />
                <Notes path="/notes" />
                <Route path="/fc" element={<Flashcards AppController={controller} />} />
              </Router>
              {controller.contextMenu}
              
              {controller.modal && <Modal />}
            </div>
          </AppControllerContext.Provider>
}

export function Modal() {
  const { modal, modalHandler } = useMainStateController()!;
  const { controller } = modal.props;


  return  (
    <div className="absolute w-full h-full bg-slate-300 bg-opacity-30 top-0 left-0 flex justify-center items-center">
      <div className="bg-slate-600 rounded p-4 relative shadow-lg">
        <div>
          {modal.component({controller, ...modal.props})}
        </div>
          <img 
            className="absolute p-1 hover:cursor-pointer hover:bg-slate-700 top-1 right-1 rounded w-6" 
            src="/icons/ui/close-x.svg" 
            onClick={() => modalHandler()} 
            alt={'close-x'}
          />
      </div>
    </div>
  )
}

export default App;
