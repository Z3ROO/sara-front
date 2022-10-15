import { useContext } from "react";
import { RouterContext, splitedLocation } from "./Router";

export function useLocation() {
  return useContext(RouterContext);
}

export function usePathName(directory?:string) {
  const {fullPath} = useContext(RouterContext)!;
  if (directory)
    return directory === fullPath ? true : false;
  
  return fullPath;
}

export function useParams(pattern?: string) {
  const {path} = useContext(RouterContext)!;

  if (pattern) {
    const splitedPattern = splitedLocation(pattern);
    const result: {[key:string]:string} = {};

    // if (splitedPattern.length !== path.length)
    //   return {}

    for (let i = 0; i < path.length; i++) {
      if (splitedPattern[i]) {
        if (splitedPattern[i].match(/^:.+/)){
          result[splitedPattern[i].replace(':', '')] = path[i];
        }
        else if (splitedPattern[i] !== path[i])
          return {};
      }
    }

    return result;
  }

  return {};
}