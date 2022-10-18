import { INotesTree, INotesTreeNode, ITree } from "../domains/notes/interfaces";
import { ITreeListing } from "../domains/notes/NotesAPI";

class TreeNode implements INotesTreeNode {
  name = '';
  path = [];
  title = '';
  type = '';
  state = 'closed';
  children = null;
  parent = null;

  [key: string]: any;

  constructor(values:INotesTreeNode) {
    for(const value in values) {
      this[value] = values[value as keyof typeof values];
    }
  }
}

export default class Tree implements ITree{
  [key: string]: any;

  constructor(roots: string[]) {
    for (const root of roots) {
      this[root] = new TreeNode({ type: 'category', parent: null, children: {}, title: root, name: root, path: [root]});
    }
  }

  updateTree(tree: ITreeListing, currentPath:string[] = []) {
    
    tree.forEach((node) => {
      const {name, type, content} = node;
      const focusedNode = currentPath.length > 0 ? this.findNode(currentPath) : null;
      const isFolder = type === 'folder' || type === 'category';
      
      let newCurrentPath = currentPath.concat(name);
      
      const newNode: INotesTreeNode = {
        name,
        path: newCurrentPath,
        title: name.replace(/_/g, ' '),
        type,
        parent: focusedNode,
        children: isFolder ? {} : null
      };

      const presentVersion = this.findNode(newCurrentPath);
      if (presentVersion) {
        newNode.state = presentVersion.state;
        newNode.children = presentVersion.children;
      }

      if (focusedNode)
        focusedNode.children[name] = new TreeNode(newNode);
      else
        this[name] = new TreeNode(newNode);

      if (content && content.length > 0)
        this.updateTree(content, newCurrentPath);
    });
  }

  remove(nodePath: string[]) {
    const nodeToDelete = this.findNode(nodePath);
    const parentNode = nodeToDelete.parent;
    delete parentNode.children[nodeToDelete.name];
  }

  findNode(nodePath: string[]) {
    if (nodePath.length === 0)
      throw new Error('nodePath parameter must contain at least a category!')

    const root = nodePath[0];
    nodePath = nodePath.slice(1);
    
    let currentNode = this[root];

    for (const node of nodePath) {
      currentNode = currentNode.children[node];
    }

    return currentNode;
  }

}

