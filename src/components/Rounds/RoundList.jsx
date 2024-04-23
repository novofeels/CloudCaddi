import { useEffect, useState } from "react"
import './RoundList.css'
import lowBlip from '../../assets/LowBlip.mp3';
import mediumBlip from '../../assets/MediumBlip.mp3';
import highBlip from '../../assets/HighBlip.mp3';
import animatedGif from '../../assets/CloudCaddiInClubhouse.gif';
import staticGif from '../../assets/staticGif.png';
import { getScoreCardsByUserId } from "../../services/ScoreCardService";
export const RoundList = ({currentUser}) => {
    const [myRounds, setMyRounds] = useState()

    useEffect(() => {
getScoreCardsByUserId(parseInt(currentUser.id)).then(roundObjs => setMyRounds(roundObjs))

    },[currentUser.id])

return(
<>this a round list bruh</>
)
}