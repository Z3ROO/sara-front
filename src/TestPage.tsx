import React, { useEffect, useState, createContext, useContext } from "react"

const ThemeContext = createContext<ControllerType|null>(null);

type ControllerType = {
  count: number
  plusCount():void
  modal: any
  modalHandler(component:any, controller:any):void
}

function Controller() {
  const [count, setCount] = useState<number>(0);
  const [modal, setModal] = useState<any>(null);

  function plusCount() {
    setCount(c => c+1);
  }

  function modalHandler(controller: any) {
    setModal(controller)
  }
  
  return {
    count, plusCount,
    modal, modalHandler
  }
}

export default function TestPage() {
  const controller = Controller();

  return  <div className="bg-white">
            <span className="text-white">teste</span>
          </div>
}
