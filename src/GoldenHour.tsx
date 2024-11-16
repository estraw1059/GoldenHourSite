import React, { useState, useEffect }  from 'react'
import {Card, Container, Row, Col} from 'react-bootstrap';
import './GoldenHour.css'

const UTC_MORNING_START_TIME = new Date();
UTC_MORNING_START_TIME.setHours(17);
UTC_MORNING_START_TIME.setMinutes(0);
UTC_MORNING_START_TIME.setSeconds(0);

const UTC_EVENING_START_TIME = new Date();
UTC_EVENING_START_TIME.setHours(1);
UTC_EVENING_START_TIME.setMinutes(0);
UTC_EVENING_START_TIME.setSeconds(0);

const GoldenHourState = {
    Loading: 0,
    GoldRushHour: 1,
    NotGoldRushHour: 2
}

export const GoldenHour = () => {

    const [date, setDate] = useState(new Date());
    const [isGoldenHour, setIsGoldenHour] = useState(GoldenHourState.Loading);

    const checkGoldenHour = (currentHour: number) => {
        if(currentHour === UTC_MORNING_START_TIME.getHours() || currentHour === UTC_EVENING_START_TIME.getHours()) {
            setIsGoldenHour(GoldenHourState.GoldRushHour);
        } else {
            setIsGoldenHour(GoldenHourState.NotGoldRushHour);
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

    const cardClass = "card " + (isGoldenHour === GoldenHourState.GoldRushHour ? "card-golden cardText card" : "card-not-golden cardText card");

    return(
        <Container fluid className="d-flex align-items-center justify-content-center full-height">
            {GoldenHourState.GoldRushHour !== GoldenHourState.Loading &&
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className={cardClass}>
                            <Card.Body>
                                <Card.Title>
                                    {isGoldenHour === GoldenHourState.GoldRushHour ? (
                                        <div>It is <a className='link-text' target='_blank' rel="noreferrer" href='https://seaofthieves.fandom.com/wiki/Gold_Rush'>Gold Rush Hour</a></div>
                                    ) : (
                                        <div>It is not <a target='_blank' className='link-text' rel="noreferrer" href='https://seaofthieves.fandom.com/wiki/Gold_Rush'>Gold Rush Hour</a></div>
                                    )}
                                </Card.Title>
                                <Card.Text>Current UTC Time: {date.toUTCString()}</Card.Text>
                                <Card.Text>There is {(timeToNextGoldenHour() / (1000 * 60 * 60)).toFixed(2)} hours till the next <a target='_blank' rel="noreferrer" className='link-text' href='https://seaofthieves.fandom.com/wiki/Gold_Rush'>Gold Rush Hour</a></Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            }
        </Container>
        
    );

}