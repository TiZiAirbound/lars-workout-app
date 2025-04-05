import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/nl';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://www.airbound.nl/workout/api';

moment.locale('nl');

const workoutData = {
  warmingUp: [
    {
      name: 'Springtouwen',
      time: 30,
      description: 'Draai het touw met je polsen, blijf op de bal van je voet, hou je knieën licht gebogen. Focus op ritme en soepele sprongen.',
    },
    {
      name: 'Walking lunges met armen gestrekt naar voren',
      sets: 2,
      reps: 10,
      description: 'Stap naar voren, breng beide knieën in 90graden, draai je bovenlichaam met gestrekte armen naar de kant van je achterste been. Wissel been bij elke stap. Houd je romp recht.',
    },
    {
      name: 'Side shuffles met armcirkels',
      sets: 2,
      reps: 10,
      description: 'Stap zijwaarts laag met knieën gebogen in 90graden. Tegelijk maak je cirkelbewegingen met de armen. Houd tempo erin.',
    },
    {
      name: 'Skipping high knees',
      time: 30,
      description: 'Loop ter plaatse met hoge knieën, afgewisseld met sprongetjes. Tik met je handen je knieën aan.',
    },
  ],
  krachtExplosie: [
    {
      name: 'Jump squats 2x1kg',
      sets: 3,
      reps: 10,
      description: 'Zak door je knieën alsof je op een stoel gaat zitten, spring omhoog, land zacht en ga direct door naar de volgende herhaling.',
    },
    {
      name: 'Push-ups met verhoging',
      sets: 3,
      reps: 12,
      description: 'Handen op de bars, lichaam in rechte lijn. Zak gecontroleerd tot je borst net boven de bar is, duw jezelf omhoog. Core aanspannen!',
    },
    {
      name: 'Ab wheel rollouts',
      sets: 3,
      reps: 10,
      description: 'Begin op knieën, handen op het wiel. Rol langzaam naar voren met gestrekte armen, houd je buik aangespannen, rol weer terug.',
    },
    {
      name: '5kg Dumbbell Romanian Deadlift',
      sets: 3,
      reps: 10,
      description: 'Dumbbells langs je benen, lichte gebogen knieën. Scharnier bij je heupen, rug recht, voel rek in je hamstrings. Kom langzaam omhoog.',
    },
    {
      name: 'Med ball 6kg overhead throw',
      sets: 3,
      reps: 10,
      description: 'Til gewicht boven je hoofd, werp explosief naar beneden of "werp" beweging naar beneden met controle. Focus op kracht en snelheid.',
    },
    {
      name: 'Side plank rotations',
      sets: 3,
      reps: 5,
      description: 'In zijplank op je elleboog, draai je bovenste arm onder je lichaam door en terug omhoog. Rustige rotatie met focus op balans.',
    },
  ],
  coreStabiliteit: [
    {
      name: 'Plank met arm lift',
      sets: 1,
      reps: 5,
      description: 'In plankpositie (ellebogen of handen), til afwisselend één arm gestrekt naar voren. Hou je heupen stil.',
    },
    {
      name: 'V-ups',
      sets: 3,
      reps: 12,
      description: 'Ga op je rug liggen, strek armen en benen. Kom omhoog in een "V" en raak met je handen je tenen aan. Rustig omlaag.',
    },
    {
      name: 'Superman hold',
      sets: 5,
      reps: 1,
      time: 5,
      description: 'Ga op je buik liggen, til tegelijk je armen, borst en benen van de grond. Houd deze positie vast.',
    },
  ],
};

const Workout = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSection, setCurrentSection] = useState('warmingUp');
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    // Fetch completed workouts
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${API_URL}/workout`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompletedWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const startTimer = (seconds) => {
    setTimeLeft(seconds);
    setTimer(seconds);
  };

  const handleComplete = async () => {
    const token = localStorage.getItem('token');
    const today = moment().format('YYYY-MM-DD');

    try {
      await axios.post(
        `${API_URL}/workout`,
        {
          date: today,
          completed: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Move to next exercise or section
      const currentExercises = workoutData[currentSection];
      if (currentExercise < currentExercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        const nextExercise = currentExercises[currentExercise + 1];
        if (nextExercise.time) {
          startTimer(nextExercise.time);
        } else {
          setTimer(null);
        }
      } else {
        // Move to next section
        const sections = ['warmingUp', 'krachtExplosie', 'coreStabiliteit'];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex < sections.length - 1) {
          setCurrentSection(sections[currentIndex + 1]);
          setCurrentExercise(0);
          const nextExercise = workoutData[sections[currentIndex + 1]][0];
          if (nextExercise.time) {
            startTimer(nextExercise.time);
          } else {
            setTimer(null);
          }
        } else {
          // Workout completed
          alert('Gefeliciteerd! Je hebt de workout voltooid!');
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const currentExerciseData = workoutData[currentSection][currentExercise];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {currentSection === 'warmingUp'
            ? 'Warming-up'
            : currentSection === 'krachtExplosie'
            ? 'Kracht & Explosie'
            : 'Core & Stabiliteit'}
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {currentExerciseData.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {currentExerciseData.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentExerciseData.sets && `Sets: ${currentExerciseData.sets}`}
              {currentExerciseData.reps && ` | Herhalingen: ${currentExerciseData.reps}`}
            </Typography>
            {timer !== null && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <CircularProgress
                  variant="determinate"
                  value={(timeLeft / timer) * 100}
                  sx={{ mr: 2 }}
                />
                <Typography>{timeLeft} seconden</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          onClick={handleComplete}
          fullWidth
        >
          Oefening Voltooien
        </Button>
      </Box>
    </Container>
  );
};

export default Workout; 