import Requester from "../../../lib/Requester";

export interface ISkill {
  _id: string
  name: string
  description: string
  group: string
  created_at: Date
}

export interface INewSkill {
  name: string
  description: string
  group: string
}

export async function getAllSkills(): Promise<ISkill[]> {
  return [
      {
      _id: 'aasdasdas',
      name: 'Ciencia',
      description: 'Matematicamente matte emate tica.',
      group: 'science',
      created_at: new Date()
    },
    {
      _id: 'aasdasdas',
      name: 'Matematica',
      description: 'Matmente matemaemmente matemaamente matematicamente matematica.',
      group: 'social',
      created_at: new Date()
    },
    {
      _id: 'aasdasdas',
      name: 'Engenharia',
      description: 'Matemmente matemaatmente matemaicamente matematica.',
      group: 'engineering',
      created_at: new Date()
    },
    {
      _id: 'aasdasdas',
      name: 'Social',
      description: 'te matemte ente matete maMte mateatmente matemate te emamente matete matte icamente mate tematica.',
      group: 'science',
      created_at: new Date()
    }
  ]
  const { body } = await Requester.get('/leveling/skills');
  return body;
}

export async function addNewSkill(skill: INewSkill): Promise<null> {
  console.log('skill adicionada')
  return null
  const { body } = await Requester.post('/leveling/skills/new', JSON.stringify(skill));
  return body;
}

export async function editSkill(skill_id: string, skill: Partial<INewSkill>): Promise<null> {
  console.log('skill editada')
  return null
  const { body } = await Requester.put('/leveling/skills/'+skill_id, JSON.stringify(skill));
  return body;
}

export async function deleteSkill(skill_id: string): Promise<null> {
  console.log('skill excluida')
  return null
  const { body } = await Requester.delete('/leveling/skills/'+skill_id);
  return body;
}