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

  return  <div className="bg-gray-650 h-full">
            <div className="flex m-64">
              
              <ul className="tey">
                <ul className="flex flex-col items-center">
                  <LI />
                  <ul className="flex m-4">
                    <LI />
                    <LI />
                    <LI />
                  </ul>
                </ul>
              </ul>
              <ul className="tey">
                <ul className="flex flex-col items-center">
                  <LI />
                  <ul className="flex m-4">
                    <LI />
                    <LI />
                  </ul>
                </ul>
              </ul>
              <ul className="tey">
                <ul className="flex flex-col items-center">
                  <LI />
                  <ul className="flex m-4">
                    <LI />
                    <LI />
                    <LI />
                  </ul>
                </ul>
              </ul>
            </div>
          </div>
}

function LI(props: any) {
  return (
    <li className={`
    bg-slate-200 border m-2 border-slate-400 rounded w-12 h-12
    tey
    `}>{props.children}</li>
  )
}
