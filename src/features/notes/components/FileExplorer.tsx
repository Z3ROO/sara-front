import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "../../../lib/Router/RouterHooks";
import { useMainStateController } from "../../../core/App";
import { DefaultProps } from "../../../ui/types";
import { useNotesController } from "../NotesStateController";
import { INotesTree } from "../NotesTypes";

export function FileExplorer() {
  const [hideFileExplorer, setHideFileExplorer] = useState<boolean>(false);
  const { traversePath } = useLocation()!;

  return (
    <div className='flex flex-col'>
      {
        hideFileExplorer ?
        <div className="w-12 flex flex-col">
          <button 
          className='text-white text-xs rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'
          onClick={() => setHideFileExplorer(false)}>{'>>'}</button>
          <button 
          className='text-white text-xs rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'
          onClick={() => {traversePath('/notes')}}>back</button>
        </div> :
        <>
          <FileExplorerOptions {...{ hideFileExplorer, setHideFileExplorer }}/>
          <FilesListingContainer />
        </>
      }
    </div>
  )
}

function FileExplorerOptions(props: DefaultProps) {
  const { traversePath } = useLocation()!;
  const { setNewItemField } = useNotesController()!;
  const { hideFileExplorer, setHideFileExplorer } = props;

  return (
    <div className="flex">
      <div className="flex-grow">
        <button 
          onClick={() => {traversePath('/notes')}}
          className='text-white text-xs rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'
        >back</button>
        <span className='text-white'> | </span>
        <button onClick={() => setNewItemField('folder')}
          className='text-white text-xs rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'
        >+ Pasta</button>
        <button onClick={() => setNewItemField('file')}
          className='text-white text-xs rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'
        >+ Arquivo</button>
      </div>
      <button onClick={() => setHideFileExplorer(true)}
        className='text-white text-xs rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'
      >{'<<'}</button>
    </div>
  )
}

function FilesListingContainer() {
  const category = useParams('/notes/:category/**')![1];
  const [focusedItem, setFocusedItem] = useState<string>(category);

  return (
    <div 
    id="files-listing-container"
    onClick={(e) => {
      if ((e.target as Element).id === 'files-listing-container')
        setFocusedItem(category)
    }}
    className="bg-gray-700 text-slate-300 h-full p-2 w-72 overflow-auto">
      <FilesListing {...{focusedItem, setFocusedItem}} />
    </div>
  )
}

function FilesListing(props: DefaultProps) {
  const {notesTree, updateNotesTree, newItemField, deleteNote, deleteFolder} = useNotesController()!;
  const { traversePath } = useLocation()!;
  const category = useParams('/notes/:category/**')![1];
  const {contextMenuHandler} = useMainStateController()!;
  const { focusedItem, setFocusedItem } = props;
  
  let notes = (notesTree as INotesTree)[category].children!;
  const depth:string[] = props.depth || [];

  if (props.depth)
    depth.forEach(dir => {
      notes = notes[dir].children!
    });

  const contextMenu = useCallback((event: React.MouseEvent<Element, MouseEvent>, info: any) => {
    const { type, directory } = info;

    const options = [
        {title: 'Abrir', action:()=>{
          //setNotebook(item);
        }},
        {title: 'Editar', action:()=>{}},
        {title: 'Excluir', action:()=>{
          if (type === 'file')
            deleteNote(directory);
          else
            deleteFolder(directory);
        }}
      ];
    return contextMenuHandler(event, options)
  },[]);

  return (
    <ul className={`${depth.length > 0 && 'border-l-[1px] border-l-gray-500  border-b-[1px] border-b-gray-550 bg-gray-500 bg-opacity-5'} m-0 p-0`}> 
      <NewItemField currentPath={[category, ...depth]} {...{focusedItem}}/>
      {
      Object.keys(notes).map(itemName => {
        const {name, path, title, type, state, children} = notes[itemName];
        const icon = type === 'folder' ? (state === 'closed' ? '\u{1F5C0}' : '\u{1F5C1}') : '\u{1F5CE}';
        const hasChildren = children && Object.keys(children).length > 0;
        const contextMenuWrapper = (e:React.MouseEvent<Element, MouseEvent>) => contextMenu(e, {type, directory: path});
                
        if (type === 'folder') {

          if (state === 'open')
            return (
              <>
                <ListingItem
                  isFocused={[category, ...depth, itemName].join('/') === focusedItem}
                  onClick={() => {
                    updateNotesTree();
                    notes[itemName].state = 'closed';
                    setFocusedItem(path.join('/'));
                  }}
                  onContextMenu={contextMenuWrapper}
                >{icon} {title}</ListingItem>                
                {
                  (hasChildren || newItemField) &&
                  <li className='pl-4'>
                    <FilesListing depth={[...depth, itemName]} {...{focusedItem, setFocusedItem}}/>
                  </li>
                }
              </>
            )

          return (
            <ListingItem
              isFocused={[category, ...depth, itemName].join('/') === focusedItem} 
              onClick={() => {
                updateNotesTree();
                notes[itemName].state = 'open';
                setFocusedItem(path.join('/'));
              }}
              onContextMenu={contextMenuWrapper}
            >{icon} {title}</ListingItem>
          );
        }

        return (
          <ListingItem
            isFocused={[category, ...depth, itemName].join('/') === focusedItem}
            onClick={
              () => {
                traversePath(['notes', ...path]);
                setFocusedItem(path.join('/'));
              }
            }
            onContextMenu={contextMenuWrapper}
          >{icon} {title}</ListingItem>
        );
      })
      }
    </ul>
  )
}

function NewItemField(props: DefaultProps) {
  const { newItemField, createNewItem } = useNotesController()!;
  const { currentPath, focusedItem } = props;
  
  const [newItemInputField, setNewItemInputField] = useState<string>('');

  if (newItemField && currentPath.join('/') === focusedItem.replace(/\/[^\/]+\.md$/,'')) 
    return (
      <li className='pl-3'>
        <input 
          autoFocus type="text"
          placeholder={newItemField}
          value={newItemInputField}
          onChange={(e) => setNewItemInputField(e.target.value) }
          onBlur={() => createNewItem(currentPath, newItemInputField) } 
          className='bg-gray-600 w-full text-slate-300 text-sm outline-none focus:shadow-inner p-0.5 px-1' 
          />
      </li>
    )

  return null
}

function ListingItem(props: DefaultProps) {
  const {isFocused} = props;
  return (
    <li 
      {...props}
      className={`
        ml-1.5 m-0.5 p-0.5 pl-1.5 hover:bg-gray-550 rounded-sm select-none cursor-pointer
        ${isFocused && `
          border-[1px] border-purple-500 border-opacity-40 bg-purple-400 bg-opacity-10 
          hover:bg-purple-500 hover:bg-opacity-20`}
      `}
    >{props.children}</li>
  )
}