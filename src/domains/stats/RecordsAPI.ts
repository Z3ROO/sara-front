import Requester from "../../lib/Requester"

export async function getRecords(){
  const {body} = await Requester.get('/records');
  return body
}

export async function newRecord(data:{
  title:string, 
  description: string, 
  metric: string, 
  categories: string|string[],
  questline_id: string
  status: {
    waitTime: string|number,
    stageAmount: number
  }
}){
  await Requester.post('/quests/records/new', JSON.stringify(data));
  return;
}

export async function levelUpRecord(identifier: string) {
  await Requester.get(`/leveling/records/up/${identifier}`);
}