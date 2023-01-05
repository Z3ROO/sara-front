import { createContext, useState, useContext, useEffect } from "react"
import { IRootSkill, ISkill } from "./SkillsAPI";
import * as SkillsAPI from "./SkillsAPI";

export interface ISkillTree_SC {
  editMode: boolean
  toggleEditMode: () => void
  rootSkills: IRootSkill[]
  skill: ISkill|undefined
  navigateSkill: (_id: string) => void
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
      console.log('skill')
      if (skill.type === 'root-skill')
        setSkill(undefined);
      else
        setSkill(skill.parents[0]);
    }
    else
      setSkill(skill.children.find(child => child._id === _id))
  }

  const getSkills = async () => setRootSkills(await SkillsAPI.getSkills());

  useEffect(() => {
    getSkills();
  }, []);

  return {
    editMode, toggleEditMode,
    rootSkills,
    skill,
    navigateSkill,
  }
}

export const useSkillTree_SC = () => useContext(SkillTreeContext);