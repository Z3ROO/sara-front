import Requester from "../../lib/Requester";


export async function getNotesTreeListingBranch(directory: string[]) {
  const parsedDirectory = '/'+directory.join('/');
  
  if (parsedDirectory === '/general')
    return [
      {
        name: 'folder_1',
        type: 'folder'
      },
      {
        name: 'file_1.md',
        type: 'file'
      }
    ]
  else if (parsedDirectory === '/general/folder_1')
    return [
      {
        name: 'folder_2',
        type: 'folder'
      },
      {
        name: 'file_2.md',
        type: 'file'
      }
    ]
  else if (parsedDirectory === '/general/folder_1/folder_2')
    return [
      {
        name: 'folder_3',
        type: 'folder'
      },
      {
        name: 'file_3.md',
        type: 'file'
      }
    ]
  else if (parsedDirectory === '/general/folder_1/folder_2/folder_3')
    return [
      {
        name: 'folder_4',
        type: 'folder'
      },
      {
        name: 'file_4.md',
        type: 'file'
      }
    ]
  else if (parsedDirectory === '/general/folder_1/folder_2/folder_3/folder_4')
    return [
      {
        name: 'folder_5',
        type: 'folder'
      },
      {
        name: 'file_5.md',
        type: 'file'
      }
    ]
  
  return [];
  
  const response = await Requester.get(`/notes/listing/${parsedDirectory}`);
  return response;
}

// export async function getCategoryContent(category: string) {
//   const response = await Requester.get(`/notes/${category}/content`)
//   return response;
// }

// export async function getNotebookContent(category: string, notebook: string) {
//   const response = await Requester.get(`/notes/${category}/${notebook}/content`)
//   return response;
// }

// export async function getSectionContent(category: string, notebook: string, section: string) {
//   const response = await Requester.post(
//     `/notes/${category}/${notebook}/section/content`, 
//     JSON.stringify({section})
//   );

//   return response;
// }

export async function getPageContent(category: string, notebook: string, section: string, page: string){
  const response = await Requester.post(
    `/notes/${category}/${notebook}/section/page`,
    JSON.stringify({section, page})
  );

  return response;
}

export async function createSection(name:string, pathDir:string){
  const response = await Requester.post('/notes/new-section',JSON.stringify({name, pathDir}));
  return response
}

export async function createPage(name:string, pathDir:string){
  const response = await Requester.post('/notes/new-page',JSON.stringify({name, pathDir}));
  return response
}

export async function saveNote(category:string, notebook:string, section:string, page:string, content: string) {
  const response = await Requester.put(
    `/notes/${category}/${notebook}/section/page/save`,
    JSON.stringify({content, section, page})
  );

  return response;
}