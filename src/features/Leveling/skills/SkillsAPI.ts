import { Tree, TreeNode } from "../../../lib/data-structures/GenericTree";
import Requester from "../../../lib/Requester";
import { IDeed, INewDeed } from "../deeds/deeds";


//===================================================================================================
const rootSkills: IRawSkillNode[] = [
  {
    _id: 'fisico123123132132132132132132123',
    name: 'Fisico',
    description: '',
    type: 'root-skill',
    parents: ['root'],
    records: []
  }
];

const skillTree: IRawSkillNode = {
  name: 'Combat',
  description: '',
  type: 'tree',
  parents: [rootSkills[0]._id],
  _id: 'combat123456789123456789123456',  
  records: []
}

const skillDiv1: IRawSkillNode = {
  name: 'Melee',
  description: '',
  type: 'node',
  parents: [skillTree._id],
  _id: 'melee123456789123456789123456',  
  records: []
}
const skillDiv2: IRawSkillNode = {
  name: 'Range',
  description: '',
  type: 'node',
  parents: [skillTree._id],
  _id: 'range123456789123456789123456',
  records: []
}

const skillItem1: IRawSkillNode = {
  name: 'Body',
  description: '',
  type: 'node',
  parents: [skillDiv1._id],
  _id: 'body123456789123456789123456',
  records: []
}
const skillItem2: IRawSkillNode = {
  name: 'Sword',
  description: '',
  type: 'node',
  parents: [skillDiv1._id],
  _id: 'sword123456789123456789123456',
  records: [],
  emptyNodes: 2
}
const skillItem3: IRawSkillNode = {
  name: 'Staff',
  description: '',
  type: 'node',
  parents: [skillDiv1._id],
  _id: 'staff123456789123456789123456',
  records: [],
  emptyNodes: 1
}
const skillItem4: IRawSkillNode = {
  name: 'Firearms',
  description: '',
  type: 'node',
  parents: [skillDiv2._id],
  _id: 'firearms123456789123456789123456',
  records: []
}
const skillItem5: IRawSkillNode = {
  name: 'Archery',
  description: '',
  type: 'node',
  parents: [skillDiv2._id],
  _id: 'archery123456789123456789123456',
  records: []
}

//===================================================================================================
//===================================================================================================

export type TypesOfSkill = 'root'|'root-skill'|'div'|'tree'|'node'

export interface IRawSkillNode {
  _id: string
  name: string
  description: string
  type: TypesOfSkill
  records: IRecord[]
  parents: string[]
  emptyNodes?: number
}

export interface ISkillNode {
  _id: string
  name: string
  description: string
  type: TypesOfSkill
  records: IRecord[]
  emptyNodes?: number
}


export interface INewSkill {
  parent_id: string
  name: string
  description: string
  type: TypesOfSkill
  emptyNodes?: number
}

export type ItemTypes = 'book'|'flashcard'|'song'|null;

export type MetricUnits = 'unit'|'step'|'second'|'minute'|'hour'|'day'|'page'|'boolean';

export const METRIC_UNITS: MetricUnits[] = [
  'unit',
  'step',
  'second',
  'minute',
  'hour',
  'day',
  'page',
  'boolean'
]

export type RecordsMetric = 'progress-made'|'total-progress'|'boolean';

export const RECORDS_METRIC: RecordsMetric[] = [
  'progress-made',
  'total-progress',
  'boolean'
]

export interface IRecord {
  _id: string
  skill_id: string
  action_skill_id: string
  name: string
  description: string
  todos: string[]
  item_type: ItemTypes
  item_id: string|null
  categories: string[]
  progress: number
  progressCap: number
  level: number
  level_cap: number
  metric: RecordsMetric
  metric_unit: MetricUnits
  complete: boolean
  difficulty: 1|2|3|4|5
  engageable: {
    not_before: Date|null
    not_after: Date|null
    requirements: string[]
  }
  history: {
    date: Date, 
    progress: number
  }[]
}

export interface INewRecord {
  skill_id: string
  action_skill_id: string|'self'
  name: string
  description: string
  todos: string[]
  item_type: ItemTypes
  item_id: string|null
  categories: string
  progress_cap: number
  level_cap: number
  metric: RecordsMetric
  metric_unit: MetricUnits
  difficulty: 1|2|3|4|5
  not_before: Date|null
  not_after: Date|null
  requirements: string[]
}

export async function getSkills(): Promise<Tree<ISkillNode>> {
  const rawSkillNodes = [
    ...rootSkills,
    skillTree,
    skillDiv1,
    skillDiv2,
    skillItem1,
    skillItem2,
    skillItem3,
    skillItem4,
    skillItem5
  ];

  const tree = new Tree<ISkillNode>({
    _id: 'root',
    name: '',
    description: 'Harmony of greatness',
    type: 'root',
    records: []
  });

  tree.populate(rawSkillNodes);
  
  return tree;
  const { body } = await Requester.get('/leveling/skills');
  return body;
}

export async function addNewSkill(skill: INewSkill): Promise<null> {
  console.log('Skill '+ skill.name +' added');
  return null;
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

export async function addNewRecord(record: INewRecord) {
  console.log('Record added');
  console.log(record);
}

export async function getDeeds(): Promise<IDeed[]> {
  const mock: IDeed[] = [
    {
      _id: '',
      description: '',
      action_skill_id: '',
      todos: [],
      complete: false,
      history: []
    }
  ]

  return mock;
}

export async function addNewDeed(deed: INewDeed): Promise<void> {
  console.log('Deed added');
  console.log(deed);
  return;
}
