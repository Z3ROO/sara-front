import Requester from "../../../lib/Requester";

export interface ISkill {
  _id: string
  name: string
  description: string
  created_at: Date
}

export interface INewSkill {
  name: string
  description: string
}

export async function getAllSkills(): Promise<ISkill[]> {
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