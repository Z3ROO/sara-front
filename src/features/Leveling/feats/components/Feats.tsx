import { useState } from "react";
import { Loading } from "../../../../ui/Loading";
import { useStatsController } from "../../../stats/Stats";
import { QuestlineStateController } from "../../../Leveling/questlines/components/Questlines";

export default function Feats() {
  const controller = useStatsController()!;

  if (controller.feats.length === 0)
    return  <Loading/>

  return  <div>
            <div>
              <span>Feats: </span>
              <button className="button-icon" onClick={() => controller.modalHandler(CreateNewFeat)}>
                <img className="w-4" src="/icons/ui/plus-sign.svg" alt="add-feat" />
              </button>
            </div>            
            <div>
              {
                controller.feats.map(feat => {
                  return  <div className="button-sm">
                            <span>{feat.title} {feat.completed && 'complete'}</span>
                            {!feat.completed && <button className="button-sm" onClick={() => controller.completeFeat(feat._id!)}>finish</button>}
                          </div>
                })
              }
            </div>
          </div>
}

function CreateNewFeat() {
  const controller = useStatsController()!;
  const questlineController = QuestlineStateController();

  const [featTitle, setFeatTitle] = useState<string>('');
  const [featDescription, setFeatDescription] = useState<string>('');
  const [featCategory, setFeatCategory] = useState<string>('');
  const [featTier, setFeatTier] = useState<number>(1);
  const [featQuestLine, setFeatQuestLine] = useState<string>('');

  return  <div>
            <h1>Criar um novo feito:</h1>
            <div className="flex flex-col">
              <label>Titulo: </label>
              <input id="feat-title" type="text" value={featTitle} onChange={e => setFeatTitle(e.target.value)}/>
              <label>Descrição: </label>
              <input id="feat-description" type="text" value={featDescription} onChange={e => setFeatDescription(e.target.value)}/>
              <label>Categoria: </label>
              <input id="feat-category" type="text" value={featCategory} onChange={e => setFeatCategory(e.target.value)}/>
              <div>
                <h2>Tier: </h2>
                <label>1 </label>
                <input name="feat-tier" type="radio" value="1" onChange={e => setFeatTier(Number(e.target.value))} checked={featTier===1}/>
                <label>2 </label>
                <input name="feat-tier" type="radio" value="2" onChange={e => setFeatTier(Number(e.target.value))} />
                <label>3 </label>
                <input name="feat-tier" type="radio" value="3" onChange={e => setFeatTier(Number(e.target.value))} />
              </div>
              <label>Quest Line: </label>
              <select onChange={e => setFeatQuestLine(e.target.value)}>
                {
                  // questlineController.allQuestlines?.skill.map(questLine => {
                  //   if (questLine.type === 'main' && featQuestLine === '')
                  //     setFeatQuestLine(questLine._id);
                  //   return <option value={questLine._id}>{questLine.title}</option>
                  // })
                }
              </select>
              <button className="button-md"
                onClick={() => controller.createNewFeat(featTitle, featDescription, featCategory, featTier, featQuestLine)}
              >Criar</button>
            </div>
          </div>
}
