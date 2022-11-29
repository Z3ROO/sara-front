import { useEffect, useState } from "react";
import { Label } from "../../../../ui/forms";
import * as SkillsAPI from '../SkillsAPI';

export default function SkillsConfigPage() {
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [skills, setSkills] = useState<SkillsAPI.ISkill[]>([]);

  useEffect(() => {
    (async () => {
      const response = await SkillsAPI.getAllSkills();
      setSkills(response);
    })();
  },[]);

  return (
    <div className="p-4 text-gray-100 w-full">
      <h2>Skills</h2>
      <div className="">
        <h4 className="p-2">Add a new Skill: </h4>
        <div className="flex items-start">
          <Label title="Name: ">
            <input className="p-1 px-2 bg-gray-600 shadow-inner shadow-gray-700 outline-none rounded-sm border border-gray-550" value={nameInput} onChange={e => setNameInput(e.target.value)}/>
          </Label>
          <Label title="Description: ">
            <input className="p-1 px-2 bg-gray-600 shadow-inner shadow-gray-700 outline-none rounded-sm border border-gray-550" value={descriptionInput} onChange={e => setDescriptionInput(e.target.value)}/>
          </Label>
          <div className="mt-auto">
            <button className="mb-2 p-1 px-5 bg-gray-600 border border-gray-650 rounded=sm" onClick={
              () => {
                SkillsAPI.addNewSkill({name: nameInput, description: descriptionInput});
                setNameInput('');
                setDescriptionInput('');
              }
            }>Insert</button>
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3>All skills:</h3>
        <ul className="rounded-sm bg-gray-750">
          <li className="p-4 flex shadow-inner font-bold">
            <div className="w-36 overflow-hidden mr-8">
              <span>Name</span>
            </div>
            <div className="w-full mr-8">
              <span>Description</span>
            </div>
            <div className="w-28">
              <span>edit</span>
            </div>
            <div className="w-28">
              <span>delete</span>
            </div>
          </li>
          {
            skills.map(skill => {
              const { name, description } = skill;

              return (
                <li className="p-4 flex shadow-inner">
                  <div className="w-36 overflow-hidden mr-8">
                    <span>{name}</span>
                  </div>
                  <div className="w-full mr-8">
                    <span>{description}</span>
                  </div>
                  <div className="w-28">
                    <button
                      onClick={() => {
                        //SkillsAPI.editSkill(skill._id,{name: 'tal name'})
                      }}
                    >edit</button>
                  </div>
                  <div className="w-28">
                    <button
                      onClick={() => {
                        SkillsAPI.deleteSkill(skill._id)
                      }}
                    >delete</button>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}