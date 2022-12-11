import { networkInterfaces } from 'os';
import React, { useState, useEffect }  from 'react'
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

    const cardClass = "card " + (isGoldenHour ? "card-golden" : "card-not-golden");
    const currentDate = new Date();

    return(
        <div className={cardClass}>
            <div className='cardText'>Current UTC Time: {date.toUTCString()}</div>
            {isGoldenHour ? <div className='cardText'>It is Golden Hour</div> : <div className='cardText'>It is not golden hour</div>}
            <div className='cardText'>There is {(timeToNextGoldenHour()/(1000*60*60)).toFixed(2)} hours till next golden hour</div>
        </div>
    );

}