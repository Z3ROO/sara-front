import React, { useEffect, useState, createContext, useContext, useRef } from "react"
import { SkillTree } from "./features/Leveling/skills/components/SkillsTreeView";
import { ISkill } from "./features/Leveling/skills/SkillsAPI";

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

  return  <div className="bg-gray-650 h-full w-screen">
            <SkillTree />
          </div>
}