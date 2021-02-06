import React, { useState, useEffect } from 'react';
import './Home.css';
import TimerIcon from '@material-ui/icons/Timer';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import FastfoodRoundedIcon from '@material-ui/icons/FastfoodRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const toSeconds = minutes => {
  return minutes * 60;
};
const toStringMMSS = remaining => {
  let minutes = Math.floor(remaining / 60);
  let seconds = remaining % 60;

  minutes = toTwoDigits(minutes);
  seconds = toTwoDigits(seconds);

  return minutes + ":" + seconds;
};
const toTwoDigits = number => {
  return number < 10 ? "0" + number : number;
};
const isPomodoro = state => {
  return state.componentName === "pomodoro";
}

const Home = () => {

  const [states] = useState(
    {
      "pomodoro":  {componentName:"pomodoro", min: 25},
      "pauseShort":  {componentName:"pause-short", min: 5},
      "pauseLong":  {componentName:"pause-long", min: 25}
    });
  const [state, setState] = useState(states.pomodoro);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(toSeconds(state.min));
  const [isActive, setActive] = useState(false);

  const start = () => {
    if (!isActive) {
      setActive(true);
      setRemainingSeconds(seconds => seconds - 1);
    }
  };
  const stop = () => {
    if (remainingSeconds > 10) {
      setActive(false);
    }
  };
  const changeState = async (st, active) => {
    setActive(active);

    await delay(1500);

    setState(st);
    setRemainingSeconds(toSeconds(st.min));
  };
  const toggleRunning = () => {
    if (!isActive) {
      return <div className="running-toggle" onClick={() => start()}>
                <PlayArrowRoundedIcon fontSize="large" htmlColor="#ffffff" />
              </div>;
    } else {
      return <div className="running-toggle" onClick={() => stop()}>
                <StopRoundedIcon fontSize="large" htmlColor="#ffffff" />
              </div>;
    }
  };
  const transitionToNextState = () => {
    if (isPomodoro(state)) {
      (pomodoroCount !== 0 && (pomodoroCount + 1) % 4 === 0
        ? () => changeState(states.pauseLong, true)
        : () => changeState(states.pauseShort, true)
      )();
    } else {
      changeState(states.pomodoro, true);
    }
  };

  useEffect(() => {
    if (isActive && remainingSeconds > 0){
      setTimeout(() => {
        setRemainingSeconds(seconds => seconds - 1);
      }, 1000);
    }
    
    if (remainingSeconds < 1){
      if (isPomodoro(state)) {
        setPomodoroCount(pomodoro => pomodoro + 1);
      }
      transitionToNextState();
    }
  }, [remainingSeconds]);

  const percent = 1 - ((remainingSeconds) / toSeconds(state.min));

  return (
    <div className={"container " + (state.componentName)}>
      <main>
        <section className="content ">
          <section className="clock">
            <section className="timer">
              <div className="symbol countdown">{toStringMMSS(remainingSeconds)}</div>
              <div className={"symbol one " + (remainingSeconds < 8 || percent >= 0.125 ? 'passed' : '')}>|</div>
              <div className={"symbol two " + (remainingSeconds < 7 || percent >= 0.25 ? 'passed' : '')}>|</div>
              <div className={"symbol three " + (remainingSeconds < 6 || percent >= 0.375 ? 'passed' : '')}>|</div>
              <div className={"symbol four " + (remainingSeconds < 5 || percent >= 0.5 ? 'passed' : '')}>|</div>
              <div className={"symbol five " + (remainingSeconds < 4 || percent >= 0.625 ? 'passed' : '')}>|</div>
              <div className={"symbol six " + (remainingSeconds < 3 || percent >= 0.75 ? 'passed' : '')}>|</div>
              <div className={"symbol seven " + (remainingSeconds < 2 || percent >= 0.875 ? 'passed' : '')}>|</div>
              <div className={"symbol eight " + (remainingSeconds < 1 || percent >= 1 ? 'passed' : '')}>|</div>
            </section>
            <section className="board">
              <section className="board-top">
                <div className="board-btn" onClick={() => changeState(states.pomodoro, false)}>
                  <TimerIcon fontSize="large" htmlColor="#ffffff" />
                </div>
                <div className="board-btn" onClick={() => changeState(states.pauseShort, false)}>
                  <FreeBreakfastIcon fontSize="large"  htmlColor="#ffffff" />
                </div>
                <div className="board-btn" onClick={() => changeState(states.pauseLong, false)}>
                  <FastfoodRoundedIcon fontSize="large" htmlColor="#ffffff" />
                </div>
              </section>
              <section className="board-middle">
              {toggleRunning()}
              </section>
              <section className="board-bottom">
                {pomodoroCount} Pomodoros
              </section>
            </section>
          </section>
        </section>
      </main>
    </div>
  );
};

export default Home;