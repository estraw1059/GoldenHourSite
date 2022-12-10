import React, { useState, useEffect }  from 'react'
import './GoldenHour.css'

export const GoldenHour = () => {


    const UTC_MORNING_START_TIME = new Date("2011-04-22T17:00").getHours();
    const UTC_EVENING_START_TIME = new Date("2011-04-22T01:00").getHours();


    const [date, setDate] = useState(new Date());
    const [isGoldenHour, setIsGoldenHour] = useState(false);

    const checkGoldenHour = (currentHour: number) => {
        if(currentHour === UTC_MORNING_START_TIME || currentHour === UTC_EVENING_START_TIME) {
            setIsGoldenHour(true);
        } else {
            setIsGoldenHour(false);
        }
    }

    useEffect(() => {
        let timer = setInterval(() => {
            setDate(new Date());
            //Determine if it is Golden Hour
            checkGoldenHour(date.getHours());
        }, 1000);
        return function cleanup() {
            clearInterval(timer);
        }
    });

    const cardClass = "card " + (isGoldenHour ? "card-golden" : "card-not-golden");

    return(
        <div className={cardClass}>
            <div className='cardText'>Current UTC Time: {date.toUTCString()}</div>
            {isGoldenHour ? <div className='cardText'>It is Golden Hour</div> : <div className='cardText'>It is not golden hour</div>}
        </div>
    );

}