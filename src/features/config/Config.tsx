import { Link, Route, Routes } from "../../lib/Router";
import SkillsConfigPage from "../Leveling/skills/components/SkillsConfigPage";

export interface IConfigRoute {
  route: string,
  name: string,
  element: JSX.Element,
  children: IConfigRoute[]
}

const routesTree: IConfigRoute[] = [{
  route: 'general',
  name: 'General',
  element: <div className="text-white"> <h2>Testtttee</h2></div>,
  children: [
    {
      route: 'teys',
      name: 'Teys',
      element: <div className="text-white"> <h2>Testtttee</h2></div>,
      children: []
    }
  ]
}]

routesTree.push({
  route: 'skills', 
  name: 'Skills', 
  element:<SkillsConfigPage/>, 
  children:[]})

export function ConfigPage(props: {options?:IConfigRoute[], prefix?:string}) {
  let { options, prefix } = props;

  if (!options)
    options = routesTree;

  if (options.length === 0)
    return null;
  
  if (!prefix)
    prefix = '/config';

  return (
    <div className="flex w-full h-full bg-gray-800 bg-opacity-40" style={{backdropFilter:'blur(8px)'}}>
      <div className="h-full min-w-fit bg-gray-600">
        <ul className="list-none text-gray-100 mt-4">
          {
            options.map(route => (
              <Link href={prefix+'/'+route.route}>
                <li className="p-2 px-5 bg-gray-600 hover:bg-gray-550 border border-gray-650 cursor-pointer">{route.name}</li>
              </Link>
            ))
          }
        </ul>
      </div>
      <Routes prefix={prefix}>
        {
          options.map(route => {
            if (route.children.length)
              return <Route path={`./${route.route}`}><ConfigPage options={route.children} prefix={`${prefix}/${route.route}`}/></Route>

            return <Route path={`./${route.route}`}>{route.element}</Route>
          })
        }
      </Routes>
    </div>
  )
}
