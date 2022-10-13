export interface IRouterStateController {
  path: string[];
  traversePath: (newPath: string) => void;
  fullPath: string;
}
