import { useEffect, useState } from "react";
import { Label } from "../../../../ui/forms";
import * as SkillsAPI from '../SkillsAPI';

export default function SkillsConfigPage() {
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [skills, setSkills] = useState<SkillsAPI.ISkill[]>([]);

  async function getSkills() {
    const response = await SkillsAPI.getAllSkills();
    setSkills(response);
  }

  useEffect(() => {
    (async () => await getSkills())();
  },[]);

  return (
    <div className="p-4 text-gray-100 w-full">
      <h2>Skills</h2>
      <AddSkills {...{getSkills, nameInput, setNameInput, descriptionInput, setDescriptionInput}} />
      <SkillsListing {...{getSkills, skills}} />
    </div>
  )
}

function AddSkills(props: { 
  getSkills: () => Promise<void>,
  nameInput: string, 
  setNameInput: React.Dispatch<React.SetStateAction<string>>, 
  descriptionInput: string, 
  setDescriptionInput: React.Dispatch<React.SetStateAction<string>>
}) {
  const {getSkills, nameInput, setNameInput, descriptionInput, setDescriptionInput } = props;
  return (
    <div className="">
      <h4 className="p-2">Add a new Skill: </h4>
      <div className="flex items-start">
        <Label title="Name: ">
          <input className="p-1 px-2 bg-gray-600 focus:border-opacity-40 focus:border-purple-500 outline-none rounded-sm border border-gray-550" value={nameInput} onChange={e => setNameInput(e.target.value)}/>
        </Label>
        <Label title="Description: ">
          <input className="p-1 px-2 bg-gray-600 focus:border-opacity-40 focus:border-purple-500 outline-none rounded-sm border border-gray-550" value={descriptionInput} onChange={e => setDescriptionInput(e.target.value)}/>
        </Label>
        <div className="mt-auto">
          <button className="mb-2 p-1 px-5 bg-gray-600 border border-gray-650 rounded=sm" onClick={
            async () => {
              await SkillsAPI.addNewSkill({name: nameInput, description: descriptionInput});
              setNameInput('');
              setDescriptionInput('');
              getSkills();
            }
          }>Insert</button>
        </div>
      </div>
    </div>
  )
}

function SkillsListing(props: { getSkills: () => Promise<void>, skills:SkillsAPI.ISkill[]}) {
  const { getSkills, skills } = props;

  return (
    <div className="p-2">
      <h3>All skills:</h3>
      <ul className="rounded-sm bg-gray-750">
        <SkillsLi fields={{}}/>
        {
          skills.map(skill => {
            const { name, description } = skill;
            return (
              <SkillsLi fields={
                { 
                  name, description, 
                  deleteFn: async () => {
                    await SkillsAPI.deleteSkill(skill._id);
                    await getSkills();
                  }
                }
              }/>
            )
          })
        }
      </ul>
    </div>
  )
}

function SkillsLi(props: {fields:{name?:string, description?:string, deleteFn?: ()=>void}}) {
  const { name, description, deleteFn } = props.fields;

  return (
    <li className={`p-4 flex shadow-inner ${!(name || description) && 'font-bold'}`}>
      <div className="w-36 overflow-hidden mr-8">
        <span>{name||'Name'}</span>
      </div>
      <div className="w-full mr-8">
        <span>{description||'Description'}</span>
      </div>
      <div className="w-28">
        <span>edit</span>
      </div>
      <div className="w-28">
        <span className={`${deleteFn && 'cursor-pointer'}`} onClick={deleteFn}>delete</span>
      </div>
    </li>
  )
}