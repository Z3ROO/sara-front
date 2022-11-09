import { useEffect, useRef, useState } from "react";
import { splitedLocation } from ".";
import { IRouterStateController } from "./RouterTypes";

export function RouterStateController(): IRouterStateController {
  const currentPath = splitedLocation();
  const [path, setPath] = useState(currentPath);
  const cwd = useRef('/');
  const setCwd = (value:string) => cwd.current = value

  function traversePath(newPath: string|string[]) {
    if (newPath === '__back') {
      //missing history.pushState()
      return setPath((currentPath) => currentPath.slice(0,-1));
    }

    if (Array.isArray(newPath))
      return setPath(newPath);

    setPath(splitedLocation(newPath));
  }

  useEffect(() => {
    window.history.pushState({}, '', '/'+path.join('/'));
  },[path])

  useEffect(() => {
    const handler = () => {
      traversePath(window.location.pathname);
    }

    window.addEventListener('popstate', handler)

    return () => window.removeEventListener('popstate', handler)
  },[])

  return {
    path,
    traversePath,
    cwd, 
    setCwd,
    fullPath: '/'+path.join('/')
  }
}