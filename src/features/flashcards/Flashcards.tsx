import { useEffect, useRef, useState } from "react";
import { IAppController } from "../../core/App";
import {marked} from 'marked';

type FlashcardsControllerType = {
  state: string;
  card: {
      pageDir: string;
      questions: string[];
  } | null;
  answer: string;
  answerRef: React.RefObject<HTMLPreElement>;
  startGame: () => void;
  getAnswer: () => Promise<void>;
  setScore: (score: number) => Promise<void>;
  nextCard: () => void;
}

function SilverTape({children}:{children:JSX.Element}) {
  return <div
            className="p-4 rounded-md bg-gray-600 text-slate-300 max-h-[90vh] max-w-[1080px] overflow-auto"
            >
            {children}
          </div>
}


function FlashcardsController() {
  const [state,setState] = useState<string>('sleep');
  const [card, setCard] = useState<{pageDir: string, questions: string[]}|null>(null);
  const [answer, setAnswer] = useState<string>('');
  const answerRef = useRef<HTMLPreElement>(null);
  const cardsBatch = useRef<{pageDir: string, questions: string[]}[]|null>(null);

  function startGame() {
    if (!cardsBatch.current) return 

    setCard(cardsBatch.current[0]);
    setState('questions');
    cardsBatch.current = cardsBatch.current.slice(1)
  }

  async function getAnswer() {
    setState('answers');
    if (!card) return
    console.log('teste2')
    let pageDir = card.pageDir.split('/');

    if (pageDir.length === 3) 
      pageDir = [pageDir[0],pageDir[1],'',pageDir[2]];

    //const category = pageDir[0];
    const notebook = pageDir[1];
    const section = pageDir.slice(2,pageDir.length - 1).join('/');
    const page = pageDir[pageDir.length - 1];

    const headers = {
      method: 'post',
      body: JSON.stringify({section, page}),
      headers: {
        'Content-Type':'application/json; charset=utf-8'
      }
    }
    //card.pageDir
    const get = await fetch(`/notes/study/${notebook}/section/page`, headers);
    const res = await get.json();

    setAnswer(res);

    answerRef.current!.innerHTML = marked.parse(res);
  }

  async function setScore(score: number) {
    setState('sleep');
    if (!card) return 

    const headers = {
      method: 'post',
      body: JSON.stringify({score, pageDir: card.pageDir}),
      headers: {
        'Content-Type':'application/json; charset=utf-8'
      }
    }

    const post = await fetch('/flashcards/answer', headers);
    const res: Promise<{ok: boolean}> = await post.json();
    
    if ((await res).ok)
      setState('result');
    else
      setState('err');
  }

  function nextCard() {
    if (!cardsBatch.current) return

    if (cardsBatch.current.length > 0) setState('start');
    else setState('final');
  }

  async function getCards() {
    const get = await fetch('/flashcards');
    const res = await get.json();
    
    if(res.length === 0)
      return setState('final')
      
    cardsBatch.current = res;
    
    setState('start');
    
  }

  useEffect(()=>{
    getCards();
  },[])

  return {
    state,
    card,
    answer,
    answerRef,
    startGame,
    getAnswer,
    setScore,
    nextCard
  }
}

export function Flashcards(props: {AppController: IAppController}) {
  const controller = FlashcardsController();

  let content: JSX.Element|null = null;

  if (controller.state === 'sleep')
    content = <SleepScreen controller={controller} />
  else if (controller.state === 'start')
    content = <StartScreen controller={controller} />
  else if (controller.state === 'questions')
    content = <Questions controller={controller} />
  else if (controller.state === 'answers')
    content = <Answers controller={controller} />
  else if (controller.state === 'result')
    content = <Result controller={controller} />
  else if (controller.state === 'err')
    content = <Err controller={controller} />
  else if (controller.state === 'final')
    content = <Final controller={controller} />
  
  return  <div className="flex justify-center items-center h-full">
            {content}
          </div>
}

function SleepScreen(props: {controller: FlashcardsControllerType}) {
  const {controller} = props;

  return <SilverTape><h2>Loading...</h2></SilverTape>
}

function StartScreen(props: {controller: FlashcardsControllerType}) {
  const {controller} = props;

  return  <SilverTape>
            <>
              <h2>Tire uma carta</h2>
              <button onClick={()=> controller.startGame()}>Carta</button>
            </>
          </SilverTape>
}

function Questions(props: {controller: FlashcardsControllerType}) {
  const {controller} = props;

  return  <SilverTape>
            <>
              <h2>{controller.card?.pageDir}</h2>
              <div className="text-lg font-bold mb-6">
                {controller.card?.questions.map((question)=>(
                  <div className="m-3">{question}</div>
                  ))}
              </div>
              <button onClick={() => controller.getAnswer()}>Mostrar respostas</button>
            </>
          </SilverTape>
}

function Answers(props: {controller: FlashcardsControllerType}) {
  const {controller} = props;

  return  <SilverTape>
            <>
              <h3>{controller.card?.pageDir}</h3>
              {[0,1,2,3,4,5].map(num => <button onClick={() => controller.setScore(num)}>{num}</button>)}
              <div className="min-h-0 bg-gray-550 text-gray-300 p-4 text-lg shadow-inner">
                <pre ref={controller.answerRef}>

                </pre>
              </div>
            </>
          </SilverTape>
}

function Result(props: {controller: FlashcardsControllerType}) {
  const {controller} = props;

  return  <SilverTape>
            <>
              <h2>Resultado registrado</h2>
              <button onClick={() => controller.nextCard()}>Proxima pergunta.</button>
            </>
          </SilverTape>
}

function Err(props: {controller: FlashcardsControllerType}) {
  const {controller} = props;

  return <SilverTape><h2>Algum erro ocorreu.</h2></SilverTape>
}

function Final(props: {controller: FlashcardsControllerType}) {
  const {controller} = props;

  return <SilverTape><h2>Todos os cards foram respondidos.</h2></SilverTape>
}