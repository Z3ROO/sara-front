import Requester from "../../../lib/Requester";


//===================================================================================================
const rootSkills: IRootSkill[] = [
  {
    _id: 'fisico123123132132132132132132123',
    name: 'Fisico',
    description: '',
    type: 'root',
    parents: [],
    children: []
  }
];

const skillTree: ISkill = {
  name: 'Combat',
  description: '',
  type: 'tree',
  parents: [],
  _id: 'combat123456789123456789123456',
  children: []
}
rootSkills[0].children.push(skillTree);
skillTree.parents.push(rootSkills[0])

const skillDiv1: ISkill = {
  name: 'Melee',
  description: '',
  type: 'node',
  parents: [],
  _id: 'melee123456789123456789123456',
  children: []
}
const skillDiv2: ISkill = {
  name: 'Range',
  description: '',
  type: 'node',
  parents: [],
  _id: 'range123456789123456789123456',
  children: []
}
skillTree.children.push(skillDiv1, skillDiv2)
skillDiv1.parents.push(skillTree);
skillDiv2.parents.push(skillTree);

const skillItem1: ISkill = {
  name: 'Body',
  description: '',
  type: 'node',
  parents: [],
  _id: 'body123456789123456789123456',
  children: []
}
const skillItem2: ISkill = {
  name: 'Sword',
  description: '',
  type: 'node',
  parents: [],
  _id: 'sword123456789123456789123456',
  children: [],
  emptyNodes: 2
}
const skillItem3: ISkill = {
  name: 'Staff',
  description: '',
  type: 'node',
  parents: [],
  _id: 'staff123456789123456789123456',
  children: [],
  emptyNodes: 1
}
const skillItem4: ISkill = {
  name: 'Firearms',
  description: '',
  type: 'node',
  parents: [],
  _id: 'firearms123456789123456789123456',
  children: []
}
const skillItem5: ISkill = {
  name: 'Archery',
  description: '',
  type: 'node',
  parents: [],
  _id: 'archery123456789123456789123456',
  children: []
}
skillDiv1.children.push(skillItem1, skillItem2, skillItem3);
skillDiv2.children.push(skillItem4, skillItem5);
skillItem1.parents.push(skillDiv1);
skillItem2.parents.push(skillDiv1);
skillItem3.parents.push(skillDiv1);
skillItem4.parents.push(skillDiv2);
skillItem5.parents.push(skillDiv2);

//===================================================================================================
//===================================================================================================

export interface ISkill {
  _id: string
  name: string
  description: string
  type: 'root'|'root-tree'|'div'|'tree'|'node'
  parents: ISkill[]
  children: ISkill[]
  emptyNodes?: number
}

export interface IRootSkill extends ISkill {
  type: 'root'|'root-tree'
}

export interface INewSkill {
  name: string
  description: string
}

export async function getSkills(): Promise<IRootSkill[]> {

  return rootSkills;
  const { body } = await Requester.get('/leveling/skills');
  return body;
}

export async function addNewSkill(skill: INewSkill): Promise<null> {
  const { body } = await Requester.post('/leveling/skills/new', JSON.stringify(skill));
  return body;
}

export async function editSkill(skill_id: string, skill: Partial<INewSkill>): Promise<null> {
  const { body } = await Requester.put('/leveling/skills/'+skill_id, JSON.stringify(skill));
  return body;
}

export async function deleteSkill(skill_id: string): Promise<null> {
  const { body } = await Requester.delete('/leveling/skills/'+skill_id);
  return body;
}