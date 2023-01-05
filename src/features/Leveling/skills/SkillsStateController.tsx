import { createContext, useState, useContext, useEffect } from "react"
import { INewSkill, IRootSkill, ISkill } from "./SkillsAPI";
import * as SkillsAPI from "./SkillsAPI";

export interface ISkillTree_SC {
  editMode: boolean
  toggleEditMode: () => void
  rootSkills: IRootSkill[]
  skill: ISkill|undefined
  navigateSkill: (_id: string) => void
  addNewSkill: (skill: INewSkill) => Promise<void>
}

export const SkillTreeContext = createContext<ISkillTree_SC|null>(null);

export function SkillTree_SC(): ISkillTree_SC {
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => setEditMode(prev => !prev);

  const [rootSkills, setRootSkills] = useState<IRootSkill[]>([]);

  const [skill, setSkill] = useState<ISkill>();
  const navigateSkill = (_id: string) => {
    if (!skill)
      setSkill(rootSkills.find(child => child._id === _id))
    else if (_id === 'back') {
      if (skill.type === 'root-skill')
        setSkill(undefined);
      else
        setSkill(skill.parents[0]);
    }
    else
      setSkill(skill.children.find(child => child._id === _id))
  }

  const getSkills = async () => setRootSkills(await SkillsAPI.getSkills());
  const addNewSkill = async (skill: INewSkill) => {
    await SkillsAPI.addNewSkill(skill);
    await getSkills();
  };

  useEffect(() => {
    getSkills();
  }, []);

  return {
    editMode, toggleEditMode,
    rootSkills,
    skill,
    navigateSkill,
    addNewSkill
  }
}

export const useSkillTree_SC = () => useContext(SkillTreeContext);