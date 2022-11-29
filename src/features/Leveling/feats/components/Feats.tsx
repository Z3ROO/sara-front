import { useState, createContext, useContext } from "react";
import * as FeatsAPI from '../FeatsAPI';
import { Loading } from "../../../../ui/Loading";
import { QuestlineStateController } from "../../../Leveling/questlines/components/Questlines";

interface IFeats {
  _id?:string
  id: string
  questline_id: string
  title: string
  description: string
  categories: string
  type: 'feat'|'record'
  tier: number
  level: number
  completed: boolean
  xp: number
  finished_at?: string
}

export interface IFeatsStateController {
  feats: IFeats[]
  createNewFeat(title: string, description: string, category: string, tier: number, questline: string): Promise<void>
  completeFeat(featId: string): Promise<void>
}

const FeatsStateControllerContext = createContext<any|null>(null);
function FeatsStateController() {

  const [feats, setFeats] = useState<IFeats[]>([]);

  async function createNewFeat(title: string, description: string, category: string, tier: number, questline: string) {

    const response = await FeatsAPI.newFeat({
      title,
      description,
      category,
      tier,
      questline_id: questline
    });
    
    fetchFeats();
  }

  async function fetchFeats() {
    const response = await FeatsAPI.getFeats();

    setFeats(response);
  }

  async function completeFeat(featId: string) {
    await FeatsAPI.completeFeat(featId);

    fetchFeats();
  }

  return {
    createNewFeat,
    feats,
    completeFeat,
  }
}
const useFeatsSC = () => useContext(FeatsStateControllerContext);

export default function Feats() {
  const controller = FeatsStateController();

  if (controller.feats.length === 0)
    return  <Loading/>

  return  (
    <FeatsStateControllerContext.Provider value={controller}>
      <div>
        <div>
          <span>Feats: </span>
          <button className="button-icon" onClick={() => {}}>
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
    </FeatsStateControllerContext.Provider>
  )
}

function CreateNewFeat() {
  const controller = useFeatsSC()!;
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
