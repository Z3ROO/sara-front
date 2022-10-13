import { useContext } from "react";
import { RouterContext } from "./Router";

export function useLocation() {
  return useContext(RouterContext);
}

export function usePathName(directory?:string) {
  const {fullPath} = useContext(RouterContext)!;
  if (directory)
    return directory === fullPath ? true : false;
  
  return fullPath;
}
