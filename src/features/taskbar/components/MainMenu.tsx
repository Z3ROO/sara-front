import * as Icons from '../../../ui/icons/UI'
import { Link } from '../../../lib/Router';

export default function MainMenu(props: {close: () => void}) {
  const iconList = [
    { title: 'Home', link: '/', Icon: Icons.Menu9Square },
    { title: 'Notes', link: '/notes', Icon: Icons.NoteApp },
    { title: 'Flashcard', link: '/flashcards', Icon: Icons.InfoCards},
    { title: 'Design Systems', link: '/design-systems', Icon: Icons.DesignSystems },
    { title: 'Config', link: '/config', Icon: Icons.TripleGear },
    { title: 'Teste', link: '/teste', Icon: Icons.Menu9Square },
    { title: 'Home', link: '/', Icon: Icons.Menu9Square }
  ];

  return (
    <div className="flex flex-wrap w-72 shadow-md">
      {
        iconList.map(icon => (
            <SectionIcon {...icon} onClick={props.close} />
          )
        )
      }
    </div>
  )
}

function SectionIcon(props: {Icon:(props:Icons.IconType) => JSX.Element, title:string, link: string, [key: string]:any}) {
  const {Icon, title, link} = props;

  return (
    <div className="flex flex-col w-24 h-24 justify-center items-center text-center">
      <Link href={link}>
        <div className="rounded p-2 shadow-md cursor-pointer" onClick={props.onClick}>
          <Icon className="w-6" />
        </div>
      </Link>
      <span className='text-sm'>{title}</span>
    </div>
  )
}