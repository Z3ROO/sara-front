export type NotesControllerType = {
  navState: string[];
  newItemInputField: string;
  setNewItemInputField: React.Dispatch<React.SetStateAction<string>>;
  isEditorOpen: boolean;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSaved: boolean;
  inputAux: string;
  setInputAux: React.Dispatch<React.SetStateAction<string>>;

  editorTextareaField: string;
  onEditorTextareaFieldChange(event:Event): void;
  textareaRef: React.RefObject<HTMLPreElement>;
  
  pageState: PageMetaData[];
  
  viewerRef: React.RefObject<HTMLPreElement>;

  setPath(arg: string): void;

  categoryContent: string[];
  notebookContent: string[];
  sectionContent: string[];

  categoryListItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string): void;
  notebookListItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string): void;
  sectionListItemContextMenu(event: React.MouseEvent<HTMLLIElement, MouseEvent>, item: string): void;

  setCategory(category: string): void;
  setNotebook(notebook: string): void;
  setSection(section: string): void;
  setPage(page: string): void;

  getPageContent(category: string, notebook: string, section: string, page: string): void;
  
  createNew(type: string): void;
  saveNote(): void;
}

export type NavState = {
  title: string;
  type: string;
}

export interface DefaultProps {
  controller: NotesControllerType
}

export type PageMetaData = {
  category: string;
  notebook: string;
  section: string;
  page: string;
}