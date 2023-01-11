import React, { useRef, useEffect, useState, useReducer, useMemo } from "react";
import { TripleGear } from "../../../../ui/icons/UI";
import { InputWithOptions, Label } from "../../../../ui/forms";
import { Loading } from "../../../../ui/Loading";
import Modal from "../../../../ui/Modal";
import { TypesOfSkill, INewRecord, ISkillNode } from "../SkillsAPI";
import { SkillTreeContext, SkillTree_SC, useSkillTree_SC } from "../SkillsStateController";
import { TreeNode } from "../../../../lib/data-structures/GenericTree";


export function SkillTree() {
  const stateController = SkillTree_SC();

  const { skill, toggleEditMode, navigateSkill } = stateController;
  let content: JSX.Element;
  
  if (skill && skill.value!.type === 'tree')
    content = <SkillTreeNodes />
  else if (skill && (skill.value!.type === 'root-skill' || skill.value!.type === 'div'))
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
  const { skills, navigateSkill, editMode } = useSkillTree_SC()!;
  
  return (
    <div className={`flex w-full h-full items-start p-12`}>
    {
      skills?.root.children.map(skill => {
        
        const { _id, name } = skill.value!;
        
        return (
          <div 
            onClick={() => navigateSkill(_id)}
            className="m-2 p-4 h-16 rounded bg-gray-400 cursor-pointer flex items-center justify-center">
            <span>{name}</span>
          </div>
        )
      })
    }
    {
      editMode && (
        <AddSkill className="m-2 p-4 flex justify-center items-center h-16" />
      )
    }
    </div>
  )
}

function SkillTreeDivs() {
  const { skill, navigateSkill, editMode } = useSkillTree_SC()!;
  
  if (!skill)
    return <Loading />

  return (
    <div className={`flex w-full h-full items-start p-12`}>
    {
      skill?.children.map(skill => {
        const { _id, name } = skill.value!;
        
        return (
          <div 
            onClick={() => navigateSkill(_id)}
            className="m-2 p-4 rounded bg-gray-400 cursor-pointer flex items-center justify-center">
            <span>{name}</span>
          </div>
        )
      })
    }
    {
      editMode && (
        <AddSkill parent={skill!} className="m-2 p-4 flex justify-center items-center h-16" />
      )
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
        if (tree.style.left === '')
          tree.style.left = '-25%'
        
        const currentTop = Number(tree.style.top.replace(/px|rem|em|%/g, ''));
        const currentLeft = Number(tree.style.left.replace(/px|rem|em|%/g, ''));
        const newTop = currentTop + (ee.movementY/12);
        const newLeft = currentLeft + (ee.movementX/12);
        
        if (newTop > -99.99 && newTop < 50)
          tree.style.top = newTop+'%';

        if (newLeft > -99.99 && newLeft < 50)
          tree.style.left = newLeft+'%';
      }      
    }
    node.onmouseup = (e) => {
      node.onmousemove = null;
    }

  },[treeRef.current]);

  return (
    <div ref={treeRef} className="relative w-full h-full overflow-hidden select-none">
      <div className="absolute p-16 top-0 -left-1/4">
        <SkillBranchedNode skillNode={skill!} head />
      </div>
    </div>
  )
}

function SkillBranchedNode(props: { head?: boolean, skillNode: TreeNode<ISkillNode>, emptyNodes?: number }) {
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
              return <SkillBranchedNode skillNode={skill} emptyNodes={skill.value!.emptyNodes || undefined} />
            else 
              return <SkillNode skill={skill} emptyNodes={skill.value!.emptyNodes || undefined} />
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
        <h4>{skill.value.name}</h4>
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
          {
            editMode && (
              <AddRecord parent_id={skill.value._id} parent_name={skill.value.name} />
            )
          }
        </div>
        {
          editMode && (
            <AddSkill parent={skill} className="z-[2] absolute -bottom-3 left-[calc(50%_-_.75rem)]" />
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

interface IAddSkillProps extends React.HTMLAttributes<HTMLDivElement> {
  parent?: TreeNode<ISkillNode>
}

function AddSkill(props: IAddSkillProps) {
  const { addNewSkill } = useSkillTree_SC()!;
  let { parent } = props;
  
  let skillType: TypesOfSkill;
  if (!parent) {
    parent = new TreeNode({
      _id: 'root',
      name: 'Root',
      type: 'root',
      description: '',
      records: []
    })
    skillType = 'root-skill'
  }
  else
    skillType = ['root-skill', 'div'].includes(parent.value!.type) ? 'tree' : 'node';

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(prev => !prev);

  const [parent_id, setParent_id] = useState(parent.value!._id);
  const [name, setName] = useState('');
  const [type, setType] = useState<TypesOfSkill>(skillType);
  const [description, setDescription] = useState('');
  const [emptyNodes, setEmptyNodes] = useState(0);

  return (
    <>
      <div {...props}>
        <div 
          onClick={toggleModal} 
          className="rounded-full w-6 h-6 bg-red-400 cursor-pointer hover:scale-110"
        >
        </div>
      </div>
      {
        modal && (
          <Modal close={toggleModal}>
            <div>
              <h4>{parent.value!.name}</h4>
              
            </div>
            <form id="add-skill-form" className="flex flex-col w-72">
              <Label title="Parent _id: ">
                <input className="w-full" type="text" value={parent_id} />
              </Label>
              <Label title="Name: ">
                <input className="w-full" type="text" value={name} onChange={e => setName(e.target.value)} />
              </Label>
              <div className="flex w-full">
                <Label className="p-2 w-full" title="Type: ">
                  <select className="w-full" value={type} onChange={e => setType(e.target.value as TypesOfSkill)}>
                    <option value={'root'}>Root</option>
                    <option value={'div'}>Div</option>
                    <option value={'tree'}>Tree</option>
                    <option value={'node'}>Node</option>
                  </select>
                </Label>
                {
                  type === 'node' && (
                    <Label title="Empty nodes: ">
                      <input className="w-full" type="number" value={emptyNodes} onChange={e => setEmptyNodes(Number(e.target.value))} />
                    </Label>
                  )
                }
              </div>
              <Label title="Description: ">
                <textarea className="w-full resize-none" value={description} onChange={e => setDescription(e.target.value)} />
              </Label>
              <button 
                form="add-skill-form" type="submit"
                onClick={async e => {
                  e.preventDefault();
                  addNewSkill({
                    parent_id,
                    name,
                    description,
                    type,
                    emptyNodes
                  });
                  toggleModal();
                }}
                className="bg-gray-400 rounded p-2">
                add
              </button>
            </form>
          </Modal>
        )
      }
    </>
  )
}

interface IAddRecordProps extends React.HTMLAttributes<HTMLDivElement> {
  parent_id: string
  parent_name: string
}

const flatObjectStateUpdater = <T,>(update: Partial<T>, updateFN: React.Dispatch<React.SetStateAction<T>>) => updateFN(prev => ({...prev, ...update}));

function AddRecord(props: IAddRecordProps) {
  const { addNewRecord, skills } = useSkillTree_SC()!;
  let { parent_id, parent_name } = props;

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(prev => !prev);

  const initialRecord: INewRecord = {
    skill_id: parent_id,
    action_skill_id: 'self',
    name: '',
    description: '',
    todos: [],
    item_type: null,
    item_id: '',
    categories: [],
    progress_cap: 0,
    level_cap: 0,
    metric: 'boolean',
    metric_unit: 'boolean',
    difficulty: 1,
    not_before: null,
    not_after: null,
    requirements: []
  }
  const skillsListing = useMemo(() => {
    return skills?.listing.map(skill => ({ title: skill.value!.name, value: skill.value!._id}))
  },[]);

  const [record, setRecord] = useState(initialRecord);
  const updateRecord = (params: Partial<INewRecord>) => flatObjectStateUpdater<INewRecord>(params, setRecord);

  return (
    <>
      <div {...props}>
        <div 
          onClick={toggleModal} 
          className="rounded-full w-6 h-6 bg-red-400 cursor-pointer hover:scale-110"
        >
        </div>
      </div>
      {
        modal && (
          <Modal close={toggleModal}>
            <div>
              <h4>{parent_name}</h4>
              
            </div>
            <form id="add-skill-form" className="flex flex-col w-72">
              <Label title="Action skill: ">
                <InputWithOptions<string> className="w-full" options={skillsListing||[]} defaultValue={''} value={record.action_skill_id} setValue={(val) => updateRecord({action_skill_id:val})} />
              </Label>
              <Label title="Name: ">
                <input className="w-full" type="text" value={record.name} onChange={e => updateRecord({name: e.target.value})} />
              </Label>
              <Label title="Description: ">
                <textarea className="w-full resize-none" value={record.description} onChange={e => updateRecord({description: e.target.value})} />
              </Label>
              <Label title="">

              </Label>
              <button 
                form="add-skill-form" type="submit"
                onClick={async e => {
                  e.preventDefault();
                  addNewRecord(record);
                  toggleModal();
                }}
                className="bg-gray-400 rounded p-2">
                add
              </button>
            </form>
          </Modal>
        )
      }
    </>
  )
}