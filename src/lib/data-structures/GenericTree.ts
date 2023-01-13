function char() {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',  'i', '1', '2', '3'];
  const random = Math.floor(Math.random()*letters.length);
  return letters[random];
}

function genID() {
  let result = '';
  for (let i = 0; i < 10; i++)
    result += char();

  return result;
}

interface IRawNodes { 
  parents?: string[],
  [key: string]: any
}


export class TreeNode<T extends {_id?: string}> {
  #node_id: string;
  #parent: TreeNode<T>|null
  #children: TreeNode<T>[]
  #value: T|null

  constructor(value: T, node_id?: string) {
    if (!node_id && value._id)
      node_id = value._id;

    this.#node_id = node_id || genID();
    this.#parent = null;
    this.#children = [];
    this.#value = value;
  }

  get node_id() { return this.#node_id }

  get parent() {
    if (!this.#parent)
      throw new Error('This node does not have a parent.');
    return this.#parent;
  }

  set parent(node: TreeNode<T>) { 
    this.#parent = node;
  }

  get children() { return this.#children }

  get value() { return this.#value }
}

export class Tree<T extends {_id: string}> {
  #root: TreeNode<T>;
  #currentNode: TreeNode<T>;
  #nodesListing: TreeNode<T>[] = [];

  constructor(value: T, id = 'root') {
    this.#root = new TreeNode<T>(value, id);
    this.#currentNode = this.#root;
  }

  public insertNode(parent_id: string, value: T, self_id?: string) {
    const parent = this.#findNode(parent_id);
    if (!parent)
      return;

    const child = new TreeNode<T>(value, self_id);
    child.parent = parent;
    parent.children.push(child);

    this.#nodesListing.push(child);
  }

  public removeNode(node: TreeNode<T>, forced: boolean = false) {
    const parent = node.parent;
    parent.children.filter(child => child.node_id !== node.node_id);
    if (!forced)
      parent.children.push(...node.children);
  }

  public findFromCurrentNode(node_id: string) {
    const node = this.#traverseTree(node_id, this.#currentNode);
    if (!node)
      throw new Error("Could not find node under current child")
    this.#currentNode = node;
    return node;
  }

  public find(node_id: string) {
    const node = this.#findNode(node_id);
    this.#currentNode = node;
    return node;
  }

  #findNode(node_id: string): TreeNode<T> {
    const node = this.#traverseTree(node_id);

    if (!node)
      throw new Error('Could not find node with "node_id": '+node_id)

    return node;
  }

  #traverseTree(node_id: string, node:TreeNode<T> = this.#root): TreeNode<T>|false {
    if (node.node_id === node_id)
      return node;

    for (let child of node.children) {
      const resultNode = this.#traverseTree(node_id, child);

      if (resultNode)
        return resultNode;
    }

    return false;
  }

  public populate(rawNodes: IRawNodes[]) {
    this.#populateTree('root', rawNodes);
  }

  #populateTree(parent_id: string, arr:IRawNodes[]) {
    console.log(parent_id)
    arr.forEach((node) => {
      if (node.parents?.includes(parent_id)){
        const { parents , ...rest } = node;
        const newNode = rest as T;
        
        this.insertNode(parent_id, newNode);

        const newParent_id = node._id;
        this.#populateTree(newParent_id,  arr);
      }
    });
  }


  get root() { return this.#root }
  get current() { return this.#currentNode }
  get parent() { return this.#currentNode?.parent }
  get children() { return this.#currentNode?.children }
  get value() { return this.#currentNode?.value }
  get listing() { return this.#nodesListing }
}

