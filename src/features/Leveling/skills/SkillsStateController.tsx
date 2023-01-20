import { createContext, useState, useContext, useEffect, useRef } from "react"
import { INewSkill, INewRecord, ISkillNode } from "./SkillsAPI";
import * as SkillsAPI from "./SkillsAPI";
import { TreeNode, Tree } from "../../../lib/data-structures/GenericTree";
import { IDeed, INewDeed } from "../deeds/deeds";

export interface ISkillTree_SC {
  editMode: boolean
  toggleEditMode: () => void
  skills: Tree<ISkillNode>|undefined
  skill: TreeNode<ISkillNode>|undefined
  navigateSkill: (_id: string) => void
  addNewSkill: (skill: INewSkill) => Promise<void>
  addNewRecord: (record: INewRecord) => Promise<void>
  deeds: IDeed[]
  getDeeds(): Promise<void>
  addNewDeed(deed: INewDeed): Promise<void>
}

export const SkillTreeContext = createContext<ISkillTree_SC|null>(null);

export function SkillTree_SC(): ISkillTree_SC {
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => setEditMode(prev => !prev);

  const skillTreeRef = useRef<Tree<ISkillNode>>();

  const [skills, setSkills] = useState<Tree<ISkillNode>>();
  const [skill, setSkill] = useState<TreeNode<ISkillNode>>();

  const navigateSkill = (node_id: string) => {
    if (!skillTreeRef.current)
      return;

    const skillTree = skillTreeRef.current;
    
    if (!skill) {
      const node = skillTree.find(node_id);
      setSkill(node);
    }
    else if (node_id === 'back') {
      if (skill.value!.type === 'root-skill')
        setSkill(undefined);
      else
        setSkill(skill.parent);
    }
    else {
      const node = skillTree.findFromCurrentNode(node_id);
      setSkill(node)
    }
  }

  const getSkills = async () => {
    const tree = await SkillsAPI.getSkills();
    skillTreeRef.current = tree;
    setSkills(tree);
  };
  
  const addNewSkill = async (skill: INewSkill) => {
    await SkillsAPI.addNewSkill(skill);
    await getSkills();
  };

  const addNewRecord = async (record: INewRecord) =>  {
    await SkillsAPI.addNewRecord(record);
    await getSkills();
  }

  const [deeds, setDeeds] = useState<IDeed[]>([]);

  async function getDeeds() {
    const response = await SkillsAPI.getDeeds();
    setDeeds(response);
  }

  async function addNewDeed(deed: INewDeed) {
    await SkillsAPI.addNewDeed(deed);
  }

  useEffect(() => {
    getSkills();
  }, []);

  return {
    editMode, toggleEditMode,
    skills,
    skill,
    navigateSkill,
    addNewSkill,
    addNewRecord,
    deeds,
    getDeeds,
    addNewDeed
  }
}

export const useSkillTree_SC = () => useContext(SkillTreeContext);
