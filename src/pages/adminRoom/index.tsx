import { useParams } from 'react-router-dom';
import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
//import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import './styles.scss';

type RoomParams = {
    id: string;
}





export function AdminRoom(){
    //const {user} = useAuth()
    const roomParams = useParams<RoomParams>()
    const roomId = roomParams.id;
    const {title, questions} = useRoom(roomId)
    

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
                </div>
                

                <div className="question-list">
                    {questions.map(question => {
                        return(
                            <Question 
                                content={question.content}
                                author={question.author}
                                key={question.id}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    )
}