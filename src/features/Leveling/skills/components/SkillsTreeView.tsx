import { useRef, useEffect } from "react";
import { TripleGear } from "../../../../lib/icons/UI";
import { ISkill, IRootSkill } from "../SkillsAPI";
import { SkillTreeContext, SkillTree_SC, useSkillTree_SC } from "../SkillsStateController";


export function SkillTree() {
  const stateController = SkillTree_SC();

  const { skill, toggleEditMode, navigateSkill } = stateController;
  console.log(skill)
  let content: JSX.Element;
  
  if (skill && skill.type === 'tree')
    content = <SkillTreeNodes />
  else if (skill && (skill.type === 'root' || skill.type === 'div'))
    content = <SkillTreeDivs />
  else
    content = <SkillTreeRoots />

  return (
    <SkillTreeContext.Provider value={stateController}>
      <div className="relative w-full h-full">
        { content }
        <button 
          onClick={() => navigateSkill('back')}
          className={"absolute p-1 text-sm opacity-60 hover:opacity-90 hover:scale-110 transition-all rounded cursor-pointer left-4 top-4 bg-gray-350"}>
          back
        </button>
        <button 
          onClick={toggleEditMode}
          className={"absolute p-1 text-sm opacity-60 hover:opacity-90 hover:scale-110 transition-all rounded cursor-pointer left-4 bottom-4 bg-gray-350"}>
          edit
        </button>
      </div>
    </SkillTreeContext.Provider>
  );
}

function SkillTreeRoots() {
  const { rootSkills, navigateSkill } = useSkillTree_SC()!;

  return (
    <div className={`flex w-full h-full items-start p-12`}>
    {
      rootSkills.map(skill => {
        const { _id, name } = skill;
        
        return (
          <div 
            onClick={() => navigateSkill(_id)}
            className="m-2 p-4 rounded bg-gray-400 cursor-pointer flex items-center justify-center">
            <span>{name}</span>
          </div>
        )
      })
    }
    </div>
  )
}

function SkillTreeDivs() {
  const { skill, navigateSkill } = useSkillTree_SC()!;

  return (
    <div className={`flex w-full h-full items-start p-12`}>
    {
      skill?.children.map(skill => {
        const { _id, name } = skill;
        
        return (
          <div 
            onClick={() => navigateSkill(_id)}
            className="m-2 p-4 rounded bg-gray-400 cursor-pointer flex items-center justify-center">
            <span>{name}</span>
          </div>
        )
      })
    }
    </div>
  )
}

function SkillTreeNodes() {
  const { skill } = useSkillTree_SC()!;
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (treeRef.current == null)
      return

    const node = treeRef.current as HTMLDivElement;
    const tree = treeRef.current.firstChild as HTMLDivElement;

    node.onmousedown = (e) => {
      node.onmousemove = (ee) => {
        tree.style.top = Number(tree.style.top.replace(/px|rem|em/g, '')) + (ee.movementY/2)+'px';
        tree.style.left = Number(tree.style.left.replace(/px|rem|em/g, '')) + (ee.movementX/2)+'px';
      }      
    }
    node.onmouseup = (e) => {
      node.onmousemove = null;
    }

  },[treeRef.current]);

  return (
    <div ref={treeRef} className="relative w-full h-full overflow-hidden select-none">
      <div className="w-full h-full absolute p-16 top-0 left-0">
        <SkillBranchedNode skillNode={skill!} head />
      </div>
    </div>
  )
}

function SkillBranchedNode(props: { head?: boolean, skillNode: ISkill, emptyNodes?: number }) {
  const { head, skillNode, emptyNodes } = props;
  
  if (emptyNodes) 
    return (
      <EmptySkillBranchedNode emptyNodes={emptyNodes}>
        <SkillBranchedNode {...{head, skillNode}}/>
      </EmptySkillBranchedNode>
    )

  return (
    <div className={`shrink-0 relative skill-hor-line-down-path overflow-hidden ${head && 'skill-head'}`}>
      <SkillNode skill={skillNode} withBranches head={head}/>
      <div className="flex">
        {
          skillNode.children.map( skill => {
            if (skill.children.length)
              return <SkillBranchedNode skillNode={skill} emptyNodes={skill.emptyNodes || undefined} />
            else 
              return <SkillNode skill={skill} emptyNodes={skill.emptyNodes || undefined} />
          })
        }
      </div>
    </div>
  )
}

function SkillNode(props: any) {
  const {withBranches, head, skill, emptyNodes} = props;
  const {editMode, toggleEditMode} = useSkillTree_SC()!;

  if (emptyNodes)
    return (
      <EmptySkillBranchedNode emptyNodes={emptyNodes}>
        <SkillNode {...{withBranches, head, skill}}/>
      </EmptySkillBranchedNode>
    )

  return (
    <div className={` shrink-0 flex items-start justify-center overflow-hidden relative ${!withBranches && 'skill-hor-line-down-path'} ${head && 'skill-head'}`}>
      <div className={`
        bg-slate-200 border border-slate-400 rounded shrink-0 p-2 mx-4 my-8
        ${head && 'skill-head'}
        ${withBranches ? 'branched-skill-node' : 'skill-node'}
      `}>
        <h4>{skill.name}</h4>
        <div className="flex items-start">
          <div className="border rounded-sm bg-red-200 p-2 m-2">
            <TripleGear className={'w-8 fill-red-400'} />
          </div>
          <div className="border rounded-sm bg-red-200 p-2 m-2">
            <TripleGear className={'w-8 fill-red-400'} />
          </div>
          <div className="border rounded-sm bg-red-200 p-2 m-2">
            <TripleGear className={'w-8 fill-red-400'} />
          </div>
        </div>
        {
          editMode && (
            <div className="z-10 absolute -bottom-3 left-[calc(50%_-_.75rem)] rounded-full w-6 h-6 bg-red-400 cursor-pointer">
            </div>
          )
        }
      </div>
    </div>
  )
}

function EmptySkillBranchedNode(props: {emptyNodes: number, children: JSX.Element}) {
  
  return (
    <div className={`relative skill-hor-line-down-path overflow-hidden`}>
      <EmptySkillNode withBranches />
      <div className="flex">
        {
          props.emptyNodes-1 > 0 ? 
          (
            <EmptySkillBranchedNode emptyNodes={props.emptyNodes-1}>
              {props.children}
            </EmptySkillBranchedNode>
          ) : props.children
        }
      </div>
    </div>
  )
}

function EmptySkillNode(props: any) {

  return (
    <div className={`flex justify-center overflow-hidden relative`}>
      <div className={`
        border-y border-transparent w-12 h-20 my-4 empty-node
      `}>
      </div>
    </div>
  )
}
