import React, { useState, useEffect }  from 'react'
import { Container, Card} from 'react-bootstrap';
import './GoldenHour.css'

const UTC_MORNING_START_TIME = new Date();
UTC_MORNING_START_TIME.setHours(17);
UTC_MORNING_START_TIME.setMinutes(0);
UTC_MORNING_START_TIME.setSeconds(0);

const UTC_EVENING_START_TIME = new Date();
UTC_EVENING_START_TIME.setHours(1);
UTC_EVENING_START_TIME.setMinutes(0);
UTC_EVENING_START_TIME.setSeconds(0);

export const GoldenHour = () => {

    const [date, setDate] = useState(new Date());
    const [isGoldenHour, setIsGoldenHour] = useState(false);

    const checkGoldenHour = (currentHour: number) => {
        if(currentHour === UTC_MORNING_START_TIME.getHours() || currentHour === UTC_EVENING_START_TIME.getHours()) {
            setIsGoldenHour(true);
        } else {
            setIsGoldenHour(false);
        }
    }

    const timeToNextGoldenHour = (): number => {
        const currentTime = new Date();
        const currentUTCHour = currentTime.getUTCHours();
        console.log(`UTC Hours are ${currentUTCHour}`);
        if(currentUTCHour === 0) {
            //Next is 1:00 that day
            const nextTime = new Date();
            nextTime.setUTCHours(1);
            nextTime.setMinutes(0);
            nextTime.setSeconds(0);
            return nextTime.getTime() - currentTime.getTime();
        } else if (currentUTCHour > 1 && currentUTCHour < 17) {
            //Next is 17:00 that day
            const nextTime = new Date();
            nextTime.setUTCHours(17);
            nextTime.setMinutes(0);
            nextTime.setSeconds(0);
            return nextTime.getTime() - currentTime.getTime();
        } else if (currentUTCHour >= 18) {
            //Next is 1:00 the next day
            const nextTime = new Date(new Date().getTime() + 60 * 60 *24* 1000);
            nextTime.setUTCHours(1);
            nextTime.setMinutes(0);
            nextTime.setSeconds(0);
            return nextTime.getTime() - currentTime.getTime();
        } else {
            //We are in a golden hour
            return 0;
        }

    }

    useEffect(() => {
        let timer = setInterval(() => {
            setDate(new Date());
            //Determine if it is Golden Hour
            checkGoldenHour(date.getUTCHours());
        }, 1000);
        return function cleanup() {
            clearInterval(timer);
        }
    });

    const cardClass = "card " + (isGoldenHour ? "card-golden cardText card" : "card-not-golden cardText card");

    return(
        <div className="d-flex justify-content-center">
                <Card className={cardClass}>
                    <Card.Body>
                        <Card.Title>{isGoldenHour ? "It is Gold Rush Hour" : "It is not Gold Rush Hour"}</Card.Title>
                        <Card.Text>Current UTC Time: {date.toUTCString()}</Card.Text>
                        <Card.Text>There is {(timeToNextGoldenHour()/(1000*60*60)).toFixed(2)} hours till the next Gold Rush Hour</Card.Text>
                    </Card.Body>
                </Card>
        </div>
    );

}