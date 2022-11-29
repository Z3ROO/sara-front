export default function Home(props: {path:string}) {

  return (
    <div className="relative w-full h-full">
      <div className="absolute w-full h-full bg-cover bg-bottom " style={{backgroundImage: 'url("/petra.jpg")'}}></div>
    </div>
  )
}