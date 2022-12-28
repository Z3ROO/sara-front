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
            <div className="flex m-64 ">
              <SkillTreeView />
            </div>
          </div>
}


function SkillTreeView() {
  return (
    <SkillBranchedNode head>
      <SkillBranchedNode>
        <SkillBranchedNode>
          <SkillNode />
        </SkillBranchedNode>   
      </SkillBranchedNode>
      <SkillBranchedNode>
        <EmptySkillBranchedNode>
          <SkillNode />
        </EmptySkillBranchedNode>   
      </SkillBranchedNode>   
      <SkillBranchedNode>
        <SkillNode />
        <SkillBranchedNode>
          <SkillNode />
          <SkillNode />
          <SkillNode />
        </SkillBranchedNode>
        <SkillBranchedNode>
          <SkillNode />
          <SkillNode />
        </SkillBranchedNode>   
      </SkillBranchedNode>
      <SkillBranchedNode>
        <SkillNode />
        <SkillNode />
      </SkillBranchedNode>      
      <SkillNode />
    </SkillBranchedNode>
  );
}

function SkillNode(props: any) {
  const {withBranches, head} = props;

  return (
    <div className={`flex justify-center overflow-hidden relative ${!withBranches && 'ttt'} ${head && 'skill-head'}`}>
      <div className={`
        bg-slate-200 border border-slate-400 rounded w-12 h-12 my-4 mx-4
        ${head && 'skill-head'}
        ${withBranches ? 'branched-skill-node' : 'skill-node'}
      `}>

      </div>
    </div>
  )
}

function SkillBranchedNode(props: any) {
  const { head } = props;
  return (
    <div className={`relative ttt overflow-hidden ${head && 'skill-head'}`}>
      <SkillNode withBranches head={head}/>
      {
        props.children && (
          <div className="flex">
            {props.children}
          </div>
        )
      }
    </div>
  )
}

function EmptySkillNode(props: any) {
  const {withBranches, head} = props;

  return (
    <div className={`flex justify-center overflow-hidden relative ${!withBranches && 'ttt'} ${head && 'skill-head'}`}>
      <div className={`
        bg-slate-200 border-y w-px h-12 my-4 mx-4
        ${head && 'skill-head'}
        ${withBranches ? 'branched-skill-node' : 'skill-node'}
      `}>

      </div>
    </div>
  )
}

function EmptySkillBranchedNode(props: any) {
  const { head } = props;
  return (
    <div className={`relative ttt overflow-hidden ${head && 'skill-head'}`}>
      <EmptySkillNode withBranches head={head}/>
      {
        props.children && (
          <div className="flex">
            {props.children}
          </div>
        )
      }
    </div>
  )
}
