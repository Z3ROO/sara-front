import Requester from "../../lib/Requester";
import { IPills } from "./components/Pills";

export async function getTakeablePills(): Promise<IPills[]|null> {
  const { body } = await Requester.get('/leveling/pills');
  
  if (body.length === 0)
    return null;

  return body;
}

export async function getAllPills(): Promise<IPills[]> {
  const { body } = await Requester.get(`/leveling/pills/all`);
  return body;
}

export async function takePill(pill_id: string) {
  await Requester.get(`/leveling/pills/take/${pill_id}`);
}

export async function addPills(data: {name: string, description: string}) {
  await Requester.post('/leveling/pills/new', JSON.stringify(data));
}