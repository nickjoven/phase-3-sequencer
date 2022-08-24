import { useState, useEffect } from 'react'
import Grid from './Grid';
import Bar from './SequencerBar'
import PlayButton from './PlayButton';


const steps = 16;
const initialCellState = { triggered: false, activated: false };
const lineMap = ["BD", "BD2"];
// const initialState = [
//     new Array(16).fill(initialCellState),
//     new Array(16).fill(initialCellState),
// ];
const initialState = new Array(lineMap.length).fill().map(() => Array(16).fill(initialCellState))


const MiniSequencer = ({ player }) => {
    const [sequence, setSequence] = useState(initialState);
    const [playing, setPlaying] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const toggleStep = (line, step) => {
        const sequenceCopy = [...sequence];
        const { triggered, activated } = sequenceCopy[line][step];
        sequenceCopy[line][step] = { triggered, activated: !activated };
        console.log("toggled");
        setSequence(sequenceCopy);
    };

    const nextStep = time => {
        for (let i = 0; i < sequence.length; i++) {
            for (let j = 0; j < sequence[i].length; j++) {
                const { triggered, activated } = sequence[i][j];
                sequence[i][j] = { activated, triggered: j === time };
                if (triggered && activated) {
                    player.player(lineMap[i]).start();
                }
            }
        }
        setSequence(sequence);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (playing) {
                setCurrentStep((currentStep + 1) % steps);
                nextStep(currentStep);
            }
        }, 112);
        return () => {
            clearTimeout(timer);
        };
    }, [currentStep, playing]);

    return (
        <>
            <Bar>
                <PlayButton playing={playing} onClick={() => setPlaying(!playing)} />
            </Bar>
            <Grid sequence={sequence} toggleStep={toggleStep} steps={steps} lineMap={lineMap} />
        </>
    );
};

export default MiniSequencer;