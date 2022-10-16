import { useContext } from "react";
import { parsePath, RouterContext, splitedLocation } from "./Router";

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
  const {fullPath} = useContext(RouterContext)!;

  if (pattern) {
    let splitedPattern = splitedLocation(pattern);

    const regExpPattern = parsePath(splitedPattern);
    console.log(fullPath.match(regExpPattern))
    const match = fullPath.match(regExpPattern)
    
    if (match)
      return match.filter((v:any) => v);
  }

  return null;
}