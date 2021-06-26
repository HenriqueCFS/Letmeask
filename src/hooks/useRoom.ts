import { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string,
    author:{
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;

}

type FirebaseQuestions = Record<string, {
    author:{
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>


export function useRoom(roomId: string, setLoading?: any){
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const {user} = useAuth()
    const history = useHistory()
    const location = useLocation().pathname.toLocaleLowerCase()

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)
        roomRef.on('value', room =>{
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            if(databaseRoom.endedAt){
                const location = {
                    pathname: '/',
                    state: { fromRoomClosed: true }
                }
                history.push(location)
            }
            let amIAuthor = databaseRoom.authorId === user?.id
            
            if (location.includes('admin') && !amIAuthor){
                roomRef.off('value')
                history.push(`/rooms/${roomId}`)
                
            }
            if (!location.includes('admin') && amIAuthor){
                roomRef.off('value')
                console.log(location, amIAuthor)
                history.push(`/admin/rooms/${roomId}`)
                
            }
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key,like]) => like.authorId === user?.id)?.[0]
                }
            })
            parsedQuestions.sort((a, b) => {
                if (a.likeCount < b.likeCount) {
                  return 1;
                }
                if (a.likeCount > b.likeCount) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });



            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
            setLoading?.(false);
            return () => {
                roomRef.off('value')
            }
            
        })
    }, [roomId, user?.id, history, location, setLoading ])
    return {questions, title}
}