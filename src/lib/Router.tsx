import { createContext, useContext, useState } from "react";

const RouterContext = createContext<[string[], (newPath:string) => void]|null>(null);

export function Router(props:any) {
  //get props.children.props
  //if path is whats inside path prop then display the element
  
  //hook to change page
  const currentPath = splitedLocation();
  const [path, setPath] = useState(currentPath);

  function traversePath(newPath: string) {
    if (newPath === '__back')
      return setPath(path.slice(0,-1));
    setPath(splitedLocation(newPath));
  }
  
  if (Array.isArray(props.children))
    return  <RouterContext.Provider value={[path, traversePath]}>
              ({
                props.children.find((child:any) => {
                  const parsedChildPath = splitedLocation(child.props.path);
                  
                  if (path.length === 0 && parsedChildPath.length === 0) 
                    return true;
                  if (parsedChildPath[0] === path[0]) {
                    return true;
                  }
                })
              })
            </RouterContext.Provider>

  return (
    <></>
  )
}

export function Route(props: any) {
  return (
    <>{props.element}</>
  )
}

export function Link(props: any) {
  const href = props.href;
  const [path, traversePath] = useContext(RouterContext)!;

  return (
    <span onClick={(e) => linkHandler(e, href, traversePath)} style={{color:'blue'}}>{props.children}</span>
  )
}


function linkHandler(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, href: string, traversePath: (newPath: string) => void|null) {
  window.history.pushState({}, '', href);
  
  if (traversePath === null)
    console.log('pooooorqueeeeee');
  else
    traversePath(href);
}

const splitedLocation = (path?:string) => (path ? path : window.location.pathname).split('/').filter(dir => dir.trim() !== '');

export function useLocation() {
  return useContext(RouterContext);
}


/*

/
/notes
/fc

<Router>
  ...
</Router>


*/
