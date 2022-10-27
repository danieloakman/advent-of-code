import { readFileSync } from 'fs';
const isAllCapitals = /^[A-Z]+$/;

class Node {
  static nodes = {};

  /** @private */
  constructor(id) {
    Node.nodes[id] = this;
    this.id = id;
    this.bigCave = isAllCapitals.test(id);
    // this.visits = 0;
    this.paths = [];
  }

  addPath(path) {
    if (this.paths.includes(path)) return false;
    this.paths.push(path);
    return true;
  }

  // traverse () {
  //   const visited = [];
  //   const t = () => {

  //   };
  // }

  static get(id) {
    return Node.nodes[id] || new Node(id);
  }

  static traverse() {
    const smallVisited = [];
    const start = Node.get('start');
    for (const path of start.paths) {
    }
  }
}

readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .forEach(str => {
    const nodes = str.split('-').map(id => Node.get(id));
    nodes[0].addPath(nodes[1].id);
    nodes[1].addPath(nodes[0].id);
  });

// First star:
console.log(Node.traverse());
