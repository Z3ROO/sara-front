import { useRef, useEffect } from "react";
import { TripleGear } from "../../../../lib/icons/UI";

export interface ISkillNode {
  name: string
  parents: ISkillNode[]
  children: ISkillNode[]
  emptyNodes?: number
}

function SkillTreeView() {
  const tree = {
    name: '',
    parents: [],
    children: []
  };

  const treeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (treeRef.current == null)
      return

    const node = treeRef.current as HTMLDivElement;
    const tree = treeRef.current.firstChild as HTMLDivElement;

    node.onmousedown = (e) => {

      node.onmousemove = (ee) => {
        console.log(ee)
        tree.style.top = Number(tree.style.top.replace(/px|rem|em/g, '')) + (ee.movementY/2)+'px';
        tree.style.left = Number(tree.style.left.replace(/px|rem|em/g, '')) + (ee.movementX/2)+'px';
      }      
    }

    node.onmouseup = (e) => {
      node.onmousemove = null;
    }

  },[treeRef.current]);

  return (
    <div ref={treeRef} className="relative w-full h-full overflow-hidden p-16 select-none">
      <div className="w-full h-full absolute">
        <SkillBranchedNode skillNode={tree} head />
      </div>
    </div>
  );
}

function SkillBranchedNode(props: { head?: boolean, skillNode: ISkillNode, emptyNodes?: number }) {
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
