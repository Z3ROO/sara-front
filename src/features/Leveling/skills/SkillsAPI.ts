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
  return [
    {
      _id: 'aaasdasdas',
      name: 'Ciencia',
      description: 'Matematicamente matte emate tica.',
      created_at: new Date()
    },
    {
      _id: 'aasdasadaasdass',
      name: 'Matematica',
      description: 'Matmente matemaemmente matemaamente matematicamente matematica.',
      created_at: new Date()
    },
    {
      _id: 'aasdaaasdassdas',
      name: 'Engenharia',
      description: 'Matemmente matemaatmente matemaicamente matematica.',
      created_at: new Date()
    },
    {
      _id: 'aasdaasasdadas',
      name: 'Social',
      description: 'te matemte ente matete maMte mateatmente matemate te emamente matete matte icamente mate tematica.',
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