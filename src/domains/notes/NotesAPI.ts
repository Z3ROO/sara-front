import Requester from "../../lib/Requester";

export type ITreeListing = {name:string, type:string, content?:ITreeListing}[];

export async function getNotesTreeListing(category?: string):Promise<ITreeListing> {
  
  const response = await Requester.get(`/notes/tree-listing/${category}`);
  return response.body;
}

export async function getPageContent(path: string[]){
  const response = await Requester.get(
    `/notes/note/${path.join('/')}`
  );
  
  return response.body;
}

export async function createFolder(directory: string[], name: string){
  const response = await Requester.post('/notes/folder',JSON.stringify({directory, name}));
  return response.body;
}

export async function createNote(directory: string[], name: string){
  const response = await Requester.post('/notes/note',JSON.stringify({directory, name}));
  return response.body;
}

export async function deleteNote(directory: string[]) {
  const response = await Requester.delete('/notes/note', JSON.stringify({directory}))
  return response.body;
}

export async function deleteFolder(directory: string[]) {
  const response = await Requester.delete('/notes/folder', JSON.stringify({directory}))
  return response.body;
}

export async function saveNote(path: string[], content: string) {
  
}