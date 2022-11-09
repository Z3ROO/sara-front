import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "./RouterHooks";
import { RouterStateController } from "./RouterStateController";
import { IRouterStateController } from "./RouterTypes";

export const RouterContext = createContext<IRouterStateController|null>(null);


export function Router(props:{children: JSX.Element[]|JSX.Element}) {
  const routerStateController = RouterStateController();
  const {path} = routerStateController;
  let { children } = props;

  if (!Array.isArray(children))
    children = [children];

  return  (
    <RouterContext.Provider value={routerStateController}>
      { filterRouteOptions(children, path) }
    </RouterContext.Provider>
  )
}

function filterRouteOptions(nodes: JSX.Element[], path: string[], prefix?:string) {
  let mostEspecificRoute = '/';

  const filteringPossibleOptions = nodes.filter((child) => {
    if (child.props.path === undefined) //NODES WITHOUD PATH PROPS ARE INCLUDED
      return true;
    
    let childPath = attachRoutePrefix(child.props.path, prefix); //attaching route prefix if has one

    let splitedChildPath = splitedLocation(childPath);

    if (splitedChildPath.length === 0) { // CHECKING IF IS ROOT DIRECTORY
      if (path.length === 0)
        return true
      return false
    }

    const isRecursiveDirectory = ['**', '*'].includes(splitedChildPath[splitedChildPath.length-1]);

    let relevantPath:string;
    if (isRecursiveDirectory)
      relevantPath = '/'+path.join('/');
    else
      relevantPath = '/'+path.slice(0, splitedChildPath.length).join('/');

    const pattern = parsePath(splitedChildPath);
    if (!!relevantPath.match(pattern)) {
      if (isRecursiveDirectory)
        mostEspecificRoute = childPath;
      else if (relevantPath.length > mostEspecificRoute.length && mostEspecificRoute[mostEspecificRoute.length-1] !== '*')
        mostEspecificRoute = relevantPath;

      return true;
    }

    return false;
  });

  const filteringExactOptions = filteringPossibleOptions.filter((child) => {
    
    if(child.props.path) {
      let childPath = attachRoutePrefix(child.props.path, prefix); //attaching route prefix if has one

      if (childPath === mostEspecificRoute)
        return true;
      
      return false;
    }

    return true
  })

  return filteringExactOptions;
}

function attachRoutePrefix(childPath: string, prefix?: string) {
  if (childPath.match(/^\.\/.*/)) {
    if (!prefix)
      throw new Error('Route prefix must be set for local directories');

    childPath = prefix + childPath.substring(1);
  }
  
  childPath = childPath.replace(/(?<=.+)\/$/g,''); // REMOVE '/' OF THE END IF HAS ONE

  return childPath;
}

export function Routes(props: {children: JSX.Element[]|JSX.Element, prefix?:string}) {
  const {path, fullPath} = useLocation()!;
  let { children, prefix } = props;

  if (!Array.isArray(children))
    children = [children];

  return (
    <>
      { filterRouteOptions(children, path, prefix) }
    </>
  )
}

export function Route(props: any) {
  return (
    <>{props.element}</>
  )
}

export function Link(props: any) {
  let href:string = props.href;
  const {path, traversePath} = useLocation()!;

  return (
    <span
      onClick={(e) => linkHandler(e, href, traversePath) }
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


export function parsePath(splitedPathPattern: string[], contains?:boolean) {
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

  if (contains)
    return new RegExp('^/'+splitedPathPattern.join('/'));

  const regExpPattern = new RegExp('^/'+splitedPathPattern.join('/')+'$');

  return regExpPattern;
}
