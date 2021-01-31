import React, { useState, useEffect } from 'react';
import './Home.css';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
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
  return number < 10 ? "0" + number: number;
};

const isPomodoroState = state => {
  return state.componentName === "pomodoro";
}

/* TODO refactor clock, conditions etc. */
const Home = () => {

  const [states] = useState(
    {
      "pomodoro":  {componentName:"pomodoro", min: 25},
      "pauseShort":  {componentName:"pause-short", min: 5},
      "pauseLong":  {componentName:"pause-long", min: 25}
    });
  const [state, setState] = useState(states.pomodoro);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [remaining, setRemaining] = useState(toSeconds(state.min));
  const [isActive, setActive] = useState(false);

  const start = () => {
    if (!isActive) {
      setActive(true);
      setRemaining(r => r - 1);
    }
  };
  const stop = () => {
    if (remaining > 10) {
      setActive(false);
    }
  };
  const stateChange = async (st, active) => {
    setActive(active);

    await delay(1500);

    setState(st);
    setRemaining(toSeconds(st.min));
  };
  const changeToNextState = () => {
    if (isPomodoroState(state)) {
      (pomodoroCount !== 0 && (pomodoroCount + 1) % 4 === 0
        ? () => stateChange(states.pauseLong, true)
        : () => stateChange(states.pauseShort, true)
      )();
    } else {
      stateChange(states.pomodoro, true);
    }
  };
  const toggleStartStop = () => {
    if (!isActive) {
      return <div className="startstop" onClick={() => start()}>
                <PlayArrowRoundedIcon fontSize="large" htmlColor="#ffffff" />
              </div>;
    } else {
      return <div className="startstop" onClick={() => stop()}>
                <StopRoundedIcon fontSize="large" htmlColor="#ffffff" />
              </div>;
    }
  };
 
  useEffect(() => {
    if (isActive && remaining > 0){
      const timeout = () => {
        setRemaining(r => r - 1);
      };
      setTimeout(timeout, 1000);
    }
    
    if (remaining < 1){
      if (isPomodoroState(state)) {
        setPomodoroCount(p => p + 1);
      }
      changeToNextState();
    }
  }, [remaining]);

  const percent = 1 - ((remaining) / toSeconds(state.min));

  return (
    <div className={"container " + (state.componentName)}>
      <header></header>
      <main>
        <section className="content ">
          <section className="clock">
            <section className="timer">
            <div className="symbol countdown">{toStringMMSS(remaining)}</div>
            <div className={"symbol one " + (remaining < 8 || percent >= 0.125 ? 'passed' : '')}>|</div>
            <div className={"symbol two " + (remaining < 7 || percent >= 0.25 ? 'passed' : '')}>|</div>
            <div className={"symbol three " + (remaining < 6 || percent >= 0.375 ? 'passed' : '')}>|</div>
            <div className={"symbol four " + (remaining < 5 || percent >= 0.5 ? 'passed' : '')}>|</div>
            <div className={"symbol five " + (remaining < 4 || percent >= 0.625 ? 'passed' : '')}>|</div>
            <div className={"symbol six " + (remaining < 3 || percent >= 0.75 ? 'passed' : '')}>|</div>
            <div className={"symbol seven " + (remaining < 2 || percent >= 0.875 ? 'passed' : '')}>|</div>
            <div className={"symbol eight " + (remaining < 1 || percent >= 1 ? 'passed' : '')}>|</div>
          </section>
          <section className="board">
            <section className="board-top">
              <div className="board-btn" onClick={() => stateChange(states.pomodoro, false)}><AddCircleRoundedIcon fontSize="large" htmlColor="#ffffff" /></div>
              <div className="board-btn" onClick={() => stateChange(states.pauseShort, false)}><FreeBreakfastIcon fontSize="large"  htmlColor="#ffffff" /></div>
              <div className="board-btn" onClick={() => stateChange(states.pauseLong, false)}><FastfoodRoundedIcon fontSize="large" htmlColor="#ffffff" /></div>
            </section>
            <section className="board-middle">
             {toggleStartStop()}
            </section>
            <section className="board-bottom">
              {pomodoroCount} Pomodoros
            </section>
          </section>
          </section>
        </section>
      </main>
      <footer></footer>
    </div>
  );
};

export default Home;