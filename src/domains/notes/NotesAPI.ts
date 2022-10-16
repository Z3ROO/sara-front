import Requester from "../../lib/Requester";

export type ITreeListing = {name:string, type:string, content?:ITreeListing}[];

export async function getNotesTreeListing(category?: string):Promise<ITreeListing> {
  
  return [
    {
      name: 'general',
      type: 'category',
      content: [
        {
          name: 'folder_1',
          type: 'folder',
          content: [
            {
              name: 'folder_2',
              type: 'folder',
              content: [
                {
                  name: 'folder_3',
                  type: 'folder',
                  content: [
                    {
                      name: 'folder_4',
                      type: 'folder',
                      content: [
                        {
                          name: 'folder_5',
                          type: 'folder'
                        },
                        {
                          name: 'file_5.md',
                          type: 'file'
                        }
                      ]
                    },
                    {
                      name: 'file_4.md',
                      type: 'file'
                    }
                  ]
                },
                {
                  name: 'file_3.md',
                  type: 'file'
                }
              ]
            },
            {
              name: 'file_2.md',
              type: 'file'
            }
          ]
        },
        {
          name: 'file_1.md',
          type: 'file'
        }
      ]
    }
  ]

  
  // const response = await Requester.get(`/notes/listing/${parsedDirectory}`);
  // return response;
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

export async function getPageContent(path: string[]){
  return `
## asdasdasd

asd**asd**asd
asdasdasdas
a**sas**dasd
adasdasd
  `
  // const response = await Requester.post(
  //   `/notes/${category}/${notebook}/section/page`,
  //   JSON.stringify({section, page})
  // );

  //return response;
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
  
  // const response = await Requester.put(
  //   `/notes/${category}/${notebook}/section/page/save`,
  //   JSON.stringify({content, section, page})
  // );

  // return response;
}