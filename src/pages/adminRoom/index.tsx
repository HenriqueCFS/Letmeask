import { useParams } from 'react-router-dom';
import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
//import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase'
import './styles.scss';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom'

const newSwal = withReactContent(Swal)

type RoomParams = {
    id: string;
}





export function AdminRoom(){
    //const {user} = useAuth()
    const history = useHistory();
    const roomParams = useParams<RoomParams>();
    const roomId = roomParams.id;
    const {title, questions} = useRoom(roomId);

    function handleDeleteQuestion(questionId: string){

        newSwal.fire({
            title: `Tem certeza que deseja deletar a pergunta?`,
            text: "Isso não pode ser desfeito!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#835afd',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
                database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
                newSwal.resumeTimer()
                newSwal.fire({
                    title : 'Deletado!',
                    text: 'A pergunta foi deletada.',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true
                });
            }
          })   
            
    }

    async function handleMarkQuestionAsAnswered(questionId: string, isAnswered: boolean){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !isAnswered,

        })
    }

    async function handleHighlightQuestion(questionId: string, isHighlighted: boolean){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: !isHighlighted,
            
        })
    }

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        history.push('/')
    }

    

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={()=>handleEndRoom()}>Encerrar Sala</Button>
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
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                        >   
                            {!question.isAnswered && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleMarkQuestionAsAnswered(question.id, question.isAnswered)}
                                    >
                                        <img src={checkImg} alt="Marcar como respondida" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                    >
                                        <img src={answerImg} alt="Destacar" />
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    )
}