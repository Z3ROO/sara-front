export interface IRouterStateController {
  path: string[];
  cwd: React.MutableRefObject<string>;
  setCwd: (value: string) => string;
  traversePath: (newPath: string|string[]) => void;
  fullPath: string;
}
