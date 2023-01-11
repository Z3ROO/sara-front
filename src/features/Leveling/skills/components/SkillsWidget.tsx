import { useEffect, useState } from "react"
import * as Icons from '../../../../ui/icons/UI'

export function SkillsWidget() {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    (async () =>  setSkills([]) )();
  },[]);

  return (
    <div>
      <h5>Skills: </h5>
      <div className="flex flex-wrap justify-between">
        {
          skills.map(skill => (
            <div className="flex justify-between w-28 ml-2">
              <Icons.TripleGear className="w-5 fill-purple-500"/>
              <span className="text-xs">{skill.name}</span>
              <span>17</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}