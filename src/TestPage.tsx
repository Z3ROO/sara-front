import React, { useEffect, useState, createContext, useContext, useRef } from "react"
import { SkillTree } from "./features/Leveling/skills/components/SkillsTreeView";
import { ISkill } from "./features/Leveling/skills/SkillsAPI";
import { InputWithOptions } from "./ui/forms";

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


const options = [
  {title: 'uno', value: 'suno'},
  {title: 'dos', value: 'sdos'},
  {title: 'tres', value: 'stres'},
  {title: 'quatro', value: 'squatro'},
  {title: 'cinco', value: 'scinco'},
  {title: 'seis', value: 'sseis'},
  {title: 'sete', value: 'ssete'},
  {title: 'oito', value: 'soito'},
  {title: 'nove', value: 'snove'},
  {title: 'dez', value: 'sdez'},
  {title: 'onze', value: 'sonze'}
]


export default function TestPage() {
  const [input, setInput] = useState('');

  return  <div className="bg-gray-650 h-full w-screen">
            {/* <h4>{input}</h4> */}
            {/* <InputWithOptions<string> options={options} defaultValue={''} setValue={setInput} /> */}
            <SkillTree />
          </div>
}