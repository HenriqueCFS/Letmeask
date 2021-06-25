import {useHistory} from 'react-router-dom';

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import '../../styles/auth.scss'
import {Button} from '../../components/Button'
import {useAuth} from '../../hooks/useAuth'
import { FormEvent, useState } from 'react';
import { database } from '../../services/firebase';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const newSwal = withReactContent(Swal)

export function Home(){
    const history = useHistory();
    const {user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');
   
    async function handleCreateRoom(){
        if (!user) {
            await signInWithGoogle()
        }
        history.push('/rooms/new');
    }
    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if (roomCode.trim() === '') return;
        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()){
            alert('A sala não existe.');
            return;
        }
        if (roomRef.val().endedAt){
            newSwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Esta sala já foi encerrada!',
                timer: 3500,
                timerProgressBar: true
              })
            return;
        }
        history.push(`/rooms/${roomCode}`);
    }
    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg}  alt="Ilustração simbolizando perguntas e respostas "/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="Google"/>
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text" 
                            placeholder="Digite o código da sala"
                            value={roomCode}
                            onChange={ e => setRoomCode(e.target.value) }
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}