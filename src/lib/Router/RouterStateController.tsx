import { useEffect, useState } from "react";
import { splitedLocation } from "./Router";
import { IRouterStateController } from "./types";

export function RouterStateController(): IRouterStateController {
  const currentPath = splitedLocation();
  const [path, setPath] = useState(currentPath);

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
    fullPath: '/'+path.join('/')
  }
}