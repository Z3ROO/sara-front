import { useState } from "react";
import { Loading } from "../../_general/Loading";
import { useStatsController } from "../Stats";

export default function Records() {
  const controller = useStatsController()!;

  if (controller.records.length === 0)
    return  <Loading/>

  return  <div>
            <div>
              <span>Records: </span>
              <button className="button-icon" onClick={() => controller.modalHandler(CreateNewRecord)}>
                <img className="w-4" src="/icons/ui/plus-sign.svg" alt="add-record" />
              </button>
            </div>
            <div>
              {
                controller.records.map(record => {
                  return  <div className="button-sm">
                            <span>{record.title} - {record.level}</span>
                            <button className="button-sm" onClick={() => controller.updateRecordLevel(record._id!)}>Uppar</button>
                          </div>
                })
              }
            </div>
          </div>
}

function CreateNewRecord() {
  const controller = useStatsController()!;

  const [recordTitle, setRecordTitle] = useState<string>('');
  const [recordDescription, setRecordDescription] = useState<string>('');
  const [recordQtd, setRecordQtd] = useState<number>(0);
  const [recordCategories, setRecordCategories] = useState<string>('');
  const [recordTier, setRecordTier] = useState<number>(1);
  const [recordQuestLine, setRecordQuestLine] = useState<string>('');
  

  return  <div>
            <h1>Criar um novo Recorde:</h1>
            <div className="flex flex-col">
              <label>Titulo: </label>
              <input id="record-title" type="text" value={recordTitle} onChange={e => setRecordTitle(e.target.value)}/>
              <label>Descrição: </label>
              <input id="record-description" type="text" value={recordDescription} onChange={e => setRecordDescription(e.target.value)}/>
              <label>Quantidade: </label>
              <input id="record-qtd" type="text" value={recordQtd} onChange={e => setRecordQtd(Number(e.target.value))}/>
              <label>Categoria: </label>
              <input id="record-categories" type="text" value={recordCategories} onChange={e => setRecordCategories(e.target.value)}/>
              <div>
                <h2>Tier: </h2>
                <label>1 </label>
                <input name="record-tier" type="radio" value="1" onChange={e => setRecordTier(Number(e.target.value))} checked={recordTier===1}/>
                <label>2 </label>
                <input name="record-tier" type="radio" value="2" onChange={e => setRecordTier(Number(e.target.value))} />
                <label>3 </label>
                <input name="record-tier" type="radio" value="3" onChange={e => setRecordTier(Number(e.target.value))} />
              </div>
              <label>Quest Line: </label>
              <select onChange={e => setRecordQuestLine(e.target.value)}>
                {
                  controller.listOfQuestLines.map(questLine => {
                    if (questLine.type === 'main' && recordQuestLine === '')
                      setRecordQuestLine(questLine._id);
                    return <option value={questLine._id}>{questLine.title}</option>
                  })
                }
              </select>
              <button className="button-md"
                onClick={() => controller.createNewRecord(recordTitle, recordDescription, recordQtd, recordCategories, recordTier, recordQuestLine)}
              >Criar</button>
            </div>
          </div>
}
