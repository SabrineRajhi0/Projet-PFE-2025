import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  LinearProgress,
  Typography,
  Box,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const location = useLocation();
  const [quizData, setQuizData] = useState(null);
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showScoreNotification, setShowScoreNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");
  // Convert answer letter (A,B,C,D) to index (0,1,2,3)
  const getAnswerIndex = (letter) => {
    if (!letter) return -1;
    return letter.charCodeAt(0) - 65; // A->0, B->1, etc.
  };

  // Convert index to letter
  const getAnswerLetter = (index) => {
    return String.fromCharCode(65 + index); // 0->A, 1->B, etc.
  };

  useEffect(() => {
    if (showResult && quizData) {
      const totalQuestions = quizData.length;
      const successRatio = score / totalQuestions;

      if (successRatio > 0.5) {
        setNotificationMessage(
          "Félicitations ! Continuez comme ça, les cours en ligne vous conviennent parfaitement !"
        );
        setNotificationSeverity("success");
      } else {
        setNotificationMessage(
          "Bon effort ! Pour progresser davantage, nous vous recommandons un cours en présentiel."
        );
        setNotificationSeverity("info");
      }

      setShowScoreNotification(true);
    }
  }, [showResult, quizData, score]);

  useEffect(() => {
    // Check for pending results first
    const pendingResult = localStorage.getItem("pendingResult");
    if (pendingResult) {
      const result = JSON.parse(pendingResult);
      setQuizData(result.quiz);
      setAnswers(result.answers);
      setScore(result.score);
      setShowResult(true);
      setCurrentQuestionIndex(result.total);
      localStorage.removeItem("pendingResult"); // Clean up

      return;
    }

    // If no pending results, load quiz from location state
    if (location.state?.quiz) {
      setQuizData(location.state.quiz);
    } else {
      // If no quiz data at all, redirect or handle error
      navigate("/"); // or wherever you want to redirect
    }
  }, [location.state, navigate]);
  const handleNext = React.useCallback(() => {
    if (!quizData || !quizData[currentQuestionIndex]) return;

    const question = quizData[currentQuestionIndex];
    const correctAnswerIndex = getAnswerIndex(question.answer);
    const correctAnswer = question.choices[correctAnswerIndex];
    const isCorrect = selectedOption === correctAnswer;

    const answerData = {
      question: question.question,
      selected: selectedOption,
      correct: correctAnswer,
      isCorrect,
      choices: question.choices,
      correctLetter: question.answer,
      selectedLetter: selectedOption
        ? getAnswerLetter(question.choices.indexOf(selectedOption))
        : null,
    };
    // Ajouter cette fonction de fermeture

    const newAnswers = [...answers, answerData];
    const newScore = isCorrect ? score + 1 : score;

    setAnswers(newAnswers);
    if (isCorrect) {
      setScore(newScore);
    }

    setSelectedOption(null);

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(20);
    } else {
      const user = localStorage.getItem("user");

      const finalResult = {
        answers: newAnswers,
        score: newScore,
        total: quizData.length,
        quiz: quizData,
      };

      if (!user) {
        localStorage.setItem("pendingResult", JSON.stringify(finalResult));
        setShowLoginDialog(true);
        return;
      }

      setShowResult(true);
    }
  }, [quizData, currentQuestionIndex, selectedOption, answers, score]);

  useEffect(() => {
    if (!showResult && quizData) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            handleNext();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentQuestionIndex, showResult, quizData, handleNext]);

  if (!quizData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (showResult) {
    const handleCloseNotification = () => {
      setShowScoreNotification(false);
    };
    return (
      <Box maxWidth={800} mx="auto" mt={4} p={2}>
        <Typography variant="h4" gutterBottom>
          Résultat du Quiz
        </Typography>
        <Snackbar
          open={showScoreNotification}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notificationSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notificationMessage}
          </Alert>
        </Snackbar>
        )
        <Box mb={4} p={3} bgcolor="#f5f5f5" borderRadius={2} boxShadow={1}>
          <Typography variant="h5" align="center">
            Votre score: {score} / {quizData.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(score / quizData.length) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 2,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  score / quizData.length > 0.7
                    ? "#4caf50"
                    : score / quizData.length > 0.4
                    ? "#ffc107"
                    : "#f44336",
              },
            }}
          />
          <Typography variant="subtitle1" align="center" mt={1}>
            {score === quizData.length
              ? "Excellent!"
              : score / quizData.length > 0.7
              ? "Bon travail!"
              : score / quizData.length > 0.4
              ? "Pas mal!"
              : "Essayez encore!"}
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" gutterBottom>
          Détail des réponses:
        </Typography>
        {answers.map((ans, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Question {index + 1}: {ans.question}
              </Typography>

              <Box mt={2} mb={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Options disponibles:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {ans.choices.map((choice, idx) => (
                    <Chip
                      key={idx}
                      label={`${getAnswerLetter(idx)}. ${choice}`}
                      variant="outlined"
                      color={
                        getAnswerLetter(idx) === ans.correctLetter
                          ? "success"
                          : getAnswerLetter(idx) === ans.selectedLetter
                          ? "error"
                          : "default"
                      }
                      sx={{
                        fontWeight:
                          getAnswerLetter(idx) === ans.correctLetter ||
                          getAnswerLetter(idx) === ans.selectedLetter
                            ? "bold"
                            : "normal",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={2} display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body1"
                    sx={{ mr: 1, fontWeight: "bold" }}
                  >
                    Votre réponse:
                  </Typography>
                  {ans.selected ? (
                    <>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: ans.isCorrect ? "success.main" : "error.main",
                        }}
                      >
                        {ans.selectedLetter}. {ans.selected}
                      </Typography>
                      <Chip
                        label={ans.isCorrect ? "Correct" : "Incorrect"}
                        color={ans.isCorrect ? "success" : "error"}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      Non répondue
                    </Typography>
                  )}
                </Box>

                {!ans.isCorrect && (
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="body1"
                      sx={{ mr: 1, fontWeight: "bold" }}
                    >
                      Réponse correcte:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "success.main" }}
                    >
                      {ans.correctLetter}. {ans.correct}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => window.location.reload()}
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            Recommencer le Quiz
          </Button>
        </Box>
      </Box>
    );
  }

  const question = quizData[currentQuestionIndex];

  return (
    <Box maxWidth={600} mx="auto" mt={4} p={2}>
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle>Connexion requise</DialogTitle>
        <DialogContent>
          <Typography>
            Vous devez être connecté pour voir vos résultats de quiz. Veuillez
            vous connecter pour continuer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={() => navigate("/auth/login")}
            variant="contained"
            color="primary"
          >
            Se connecter
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" mb={2}>
        Question {currentQuestionIndex + 1} sur {quizData.length}
      </Typography>

      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={3}>
            {question.question}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {question.choices.map((option, idx) => (
              <Button
                key={idx}
                variant={selectedOption === option ? "contained" : "outlined"}
                onClick={() => setSelectedOption(option)}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  py: 1.5,
                  fontSize: "1rem",
                }}
                startIcon={
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor:
                        selectedOption === option ? "white" : "primary.main",
                      color:
                        selectedOption === option ? "primary.main" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                      fontWeight: "bold",
                    }}
                  >
                    {getAnswerLetter(idx)}
                  </Box>
                }
              >
                {option}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Box display="flex" alignItems="center" mb={3}>
        <LinearProgress
          variant="determinate"
          value={(timer / 20) * 100}
          sx={{
            flexGrow: 1,
            mr: 2,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                timer > 10 ? "#4caf50" : timer > 5 ? "#ffc107" : "#f44336",
            },
          }}
        />
        <Typography variant="body1" fontWeight="bold">
          {timer}s restantes
        </Typography>
      </Box>

      <Box textAlign="right">
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!selectedOption}
          size="large"
          sx={{ px: 4, fontSize: "1.1rem" }}
        >
          {currentQuestionIndex < quizData.length - 1
            ? "Question suivante →"
            : "Voir les résultats"}
        </Button>
      </Box>
    </Box>
  );
};

export default QuizPage;
