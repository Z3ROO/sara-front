import Requester from "../../lib/Requester";

export type ITreeListing = {name:string, type:string, content?:ITreeListing}[];
export interface APIResponse<Body> {
  status: string
  err: string
  body: Body
}

export async function getNotesTreeListing(category?: string): Promise<ITreeListing> {
  const { body } = await Requester.get(`/notes/tree-listing/${category}`);
  return body;
}

export async function getPageContent(path: string[]){
  const { body } = await Requester.get(
    `/notes/note/${path.join('/')}`
  );
  console.log(body)
  return body;
}

export async function createFolder(directory: string[], name: string) {
  const { body } = await Requester.post('/notes/folder',JSON.stringify({directory, name}));
  return body;
}

export async function createNote(directory: string[], name: string) {
  const { body } = await Requester.post('/notes/note',JSON.stringify({directory, name}));
  return body;
}

export async function deleteNote(directory: string[]) {
  const { body } = await Requester.delete('/notes/note', JSON.stringify({directory}))
  return body;
}

export async function deleteFolder(directory: string[]) {
  const { body } = await Requester.delete('/notes/folder', JSON.stringify({directory}))
  return body;
}

export async function saveNote(path: string[], content: string) {
  const { body } = await Requester.put('/notes/save-note', JSON.stringify({directory: path, content}))
  return body;
}

export class ErrorTest {
  setErrorState: React.Dispatch<any>;
  constructor(setErrorState: React.Dispatch<any>) {
    this.setErrorState = setErrorState
  }

  callToAPI(fn: () => void) {
    try{
      fn();
    }
    catch(e) {
      this.setErrorState({
        type: '500',
        msg: 'Deu um erro daqueles paizão'
      })
    }
  }

  apiCall() {
    const response = this.callToAPI(() => {
      throw new Error('errreiiii')
    });
  }
}