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

export async function createSection(name:string, pathDir:string){
  const response = await Requester.post('/notes/new-section',JSON.stringify({name, pathDir}));
  return response
}

export async function createPage(name:string, pathDir:string){
  const response = await Requester.post('/notes/new-page',JSON.stringify({name, pathDir}));
  return response
}

export async function saveNote(path:string[], content: string) {
  
}