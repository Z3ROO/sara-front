import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "./RouterHooks";
import { RouterStateController } from "./RouterStateController";
import { IRouterStateController } from "./RouterTypes";

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
        {
          props.children.filter((child:any) => child.props.path === undefined)
        }
      </RouterContext.Provider>
    )

  return (
    <></>
  )
}

export function Routes(props: any) {
  const {path, fullPath} = useLocation()!;

  return (
    <>
      {
        props.children.find((child: any) => {
          let parsedChildPath = splitedLocation(child.props.path);

          const pattern = parsePath(parsedChildPath);
          
          return !!fullPath.match(pattern);

        }) || <div className="flex justify-center items-center w-full h-full"><span className="text-7xl text-red-500">404</span></div>
      }
      {
        props.children.filter((child:any) => child.props.path === undefined)
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
    <span
      onClick={(e) => linkHandler(e, href, traversePath)}
      {...props}
    >
      {props.children}
    </span>
  )
}


function linkHandler(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, href: string, traversePath: (newPath: string) => void|null) {
  if (traversePath === null)
    console.log('pooooorqueeeeee');
  else
    traversePath(href);
}

export const splitedLocation = (path?:string) => (path ? path : window.location.pathname).split('/').filter(dir => dir.trim() !== '');


export function parsePath(splitedPathPattern: string[]) {
  splitedPathPattern = splitedPathPattern.map((pathChunk, index) => {
    if (pathChunk === '*') 
      return '([^/]+)(?:/([^/]+))*';
    if (pathChunk === '**')
      return '?(?:([^/]+)(?:/([^/]+))*)?';

    if (pathChunk.length > 1){
      if (pathChunk.charAt(0) === ':')
        return '([^/]+)';

      if (pathChunk.charAt(0) === '*')
        return '([^/]+'+pathChunk.slice(1).replace(/(\.|\+)/g,'\\$1')+')';
      if (pathChunk[pathChunk.length-1] === '*')
        return '('+pathChunk.slice(0,-1).replace(/(\.|\+)/g,'\\$1')+'[^/]+)';
    }
    
    return '('+pathChunk.replace(/(\.|\+)/g,'\\$1')+')';
  });

  const regExpPattern = new RegExp('^/'+splitedPathPattern.join('/')+'$');

  return regExpPattern;
}
