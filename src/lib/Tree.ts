// interface ITreeNode {
//   parent: any;
//   children: any;
//   [key: string]: any;
// }

import { INotesTree, INotesTreeNode, ITree } from "../domains/notes/interfaces";

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

  insert(values:{[key:string]:string}[], nodePath: string[]) {
    const focusedNode = this.findNode(nodePath);

    values.forEach((value) => {
      const {name, type} = value;
      const isFolder = type === 'folder';
      
      const newNode = new TreeNode({
        name,
        path: nodePath.concat(name),
        title: name.replace(/_/g, ' '),
        type,
        parent: focusedNode,
        children: isFolder ? {} : null
      });

      focusedNode.children[name] = newNode;
    });
  }

  remove(nodePath: string[]) {
    const nodeToDelete = this.findNode(nodePath);
    const parentNode = nodeToDelete.parent;
    delete parentNode.children[Object.keys(nodeToDelete)[0]];
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

