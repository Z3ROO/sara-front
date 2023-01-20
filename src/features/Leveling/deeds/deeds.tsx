import { useEffect, useMemo, useState } from "react";
import { InputList, InputWithOptions, Label } from "../../../ui/forms";
import Modal from "../../../ui/Modal";
import { useQuestsSC } from "../quests/components/Quests";
import { IDoableHistory } from "../skills/SkillsAPI";
import { useSkillTree_SC } from "../skills/SkillsStateController";

export interface IDeed {
  _id: string
  action_skill_id: string
  description: string
  todos: string[]
  complete: boolean
  timecap: number
  history: IDoableHistory[]
}

export type INewDeed = Omit<IDeed, '_id'|'history'|'complete'>


export function Deeds() {
  const { questCreation, includeDoableItem } = useQuestsSC()!;
  const { deeds } = useSkillTree_SC()!;

  return (
    <div className="w-full h-full relative">
      <AddDeed/>
      <div className="w-full h-full p-8 pt-20 flex flex-wrap content-start">
        {
          deeds.map(deed => {
            const { _id ,description } = deed;

            return (
              <div 
                onClick={() => {
                  if (questCreation) {
                    includeDoableItem({
                      doable_id: _id,
                      description
                    })
                  }
                }}
                className="w-48 h-16 bg-gray-300 border border-gray-500 rounded-sm  m-4">
                {description}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

function AddDeed() {
  const { getDeeds, addNewDeed, skills } = useSkillTree_SC()!;
  const [displayModal, setDisplayModal] = useState(false);

  const [action_skill_id, setAction_skill_id] = useState('');
  const [description, setDescription] = useState<string>('');
  const [todos, setTodos] = useState<string[]>(['']);
  const [timecap, setTimecap] = useState(0);

  const skillsListing = useMemo(() => {
    return skills?.listing.map(skill => ({ title: skill.value!.name, value: skill.value!._id}));
  },[]);

  useEffect(() => {
    getDeeds();
  },[])

  return (
    <>
      <button 
        onClick={() => {
          setDisplayModal(prev => !prev)
        }}
        className="absolute top-4 left-4 rounded-sm p-2 px-3 bg-gray-350">
        <span>+ | New deed</span>
      </button>
      {
        displayModal && (
          <Modal close={() => setDisplayModal(false)}>
            <div>
              <h4>Add New Deed</h4>
            </div>
            <form id="add-deed-form">
              <Label title="Description: ">
                <textarea maxLength={51} value={description} onChange={e => setDescription(e.target.value)} />
              </Label>
              <Label title="Action Skill: ">
                <InputWithOptions options={skillsListing!} initValue={''} value={action_skill_id} setValue={setAction_skill_id} />
              </Label>
              <Label title="To-do list: ">
                <InputList value={todos} setValue={val => setTodos(val)} /> 
              </Label>
              <Label title="Timecap: ">
                <input type="number" value={timecap} onChange={e => setTimecap(Number(e.target.value))} />
              </Label>
            </form>
            <button
              type="submit" form="add-deed-form"
              onClick={e => {
                e.preventDefault();
                addNewDeed({
                  description,
                  action_skill_id,
                  todos,
                  timecap
                });
                setDisplayModal(false);
              }}
            >
              Create
            </button>
          </Modal>
        )
      }
    </>
  )
}