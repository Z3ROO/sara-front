export interface IRouterStateController {
  path: string[];
  traversePath: (newPath: string|string[]) => void;
  fullPath: string;
}
