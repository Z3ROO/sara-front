import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "./hooks";
import { RouterStateController } from "./RouterStateController";
import { IRouterStateController } from "./types";

export const RouterContext = createContext<IRouterStateController|null>(null);


export function Router(props:any) {
  const routerStateController = RouterStateController();
  const {path} = routerStateController;
  
  if (Array.isArray(props.children))
    return  (
      <RouterContext.Provider value={routerStateController}>
        {
          props.children.find((child:any) => {
            const parsedChildPath = splitedLocation(child.props.path);

            if (path.length === 0 && parsedChildPath.length === 0) 
              return true;
            if (parsedChildPath[0] === path[0]) {
              return true;
            }
          })
        }
      </RouterContext.Provider>
    )

  return (
    <></>
  )
}

export function Routes(props: any) {
  const {path} = useLocation()!;

  return (
    <>
      {
        props.children.find((child: any) => {
          const parsedChildPath = splitedLocation(child.props.path);
          let starred = false;
          for (let i = 0; i < path.length; i++) {
            const isNotParameter = !(parsedChildPath[i]||'').match(/^:.+/);
            
            if (parsedChildPath[i] === '*')
              starred = true;

            if (parsedChildPath[i] !== path[i] && isNotParameter && !starred)
              return false;
          }

          return true;
        }) || <div className="flex justify-center items-center w-full h-full"><span className="text-7xl text-red-500">404</span></div>
      }
    </>
  )
}

function Routess(props: any) {
  const {path} = useLocation()!;
  return (
    <>
      {
        props.children.find((child: any) => {
          const parsedChildPath = splitedLocation(child.props.path);
          
          for (let i = 0; i < path.length; i++) {
            if (parsedChildPath[i] !== path[i])
              return false;
          }

          return true;
        })
      }
    </>
  )
}

export function Route(props: any) {
  return (
    <>{props.element}</>
  )
}

export function Link(props: any) {
  const href = props.href;
  const {path, traversePath} = useLocation()!;

  return (
    <a
      onClick={(e) => linkHandler(e, href, traversePath)}
      {...props}
    >
      {props.children}
    </a>
  )
}


function linkHandler(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, href: string, traversePath: (newPath: string) => void|null) {
  // window.history.pushState({}, '', href);
  
  if (traversePath === null)
    console.log('pooooorqueeeeee');
  else
    traversePath(href);
}

export const splitedLocation = (path?:string) => (path ? path : window.location.pathname).split('/').filter(dir => dir.trim() !== '');
