import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTimer } from '../../hooks/useTimer';
import { getConsistentScoreInfo } from '../../utils/gradeUtils';
import { quizAPI, questionAPI, quizResultAPI } from '../../services/quizApi';
import QuizTimer from '../../components/quiz/QuizTimer';
import QuizProgress from '../../components/quiz/QuizProgress';
import QuizQuestion from '../../components/quiz/QuizQuestion';
import QuizNavigation from '../../components/quiz/QuizNavigation';
import QuizResult from '../../components/quiz/QuizResult';

const JawabKuisPage = () => {
  const { kuisId } = useParams();
  const navigate = useNavigate();
  const { user, getUserInfo } = useAuth();
  
  // State management
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  // Timer hook with auto-submit on time up
  const {
    timeLeft,
    startTimer,
    stopTimer,
    getTimeStatus,
    formattedTime
  } = useTimer(1800, handleAutoSubmit); // 30 minutes

  // Auto-submit when time runs out
  function handleAutoSubmit() {
    if (!showResult) {
      handleSubmit();
    }
  }

  // Get user info
  const { userId, userName } = getUserInfo();

  // Load quiz and questions on mount
  useEffect(() => {
    if (kuisId) {
      loadQuizData();
    }
  }, [kuisId]);

  // Start timer when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !showResult) {
      startTimer();
    }
  }, [questions, showResult, startTimer]);

  // Load quiz and questions data
  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      // Load quiz details and questions in parallel
      const [quizResponse, questionsResponse] = await Promise.all([
        quizAPI.getAll(),
        questionAPI.getByQuizId(kuisId)
      ]);

      // Find the specific quiz
      const quizDetail = quizResponse.data?.find(q => q.ID === parseInt(kuisId));
      setQuiz(quizDetail);
      
      // Set questions
      setQuestions(questionsResponse.data || []);
      
    } catch (error) {
      console.error('Error loading quiz data:', error);
      alert('Gagal memuat data kuis. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle answer change
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    if (!userId) {
      alert('User ID tidak ditemukan. Silakan login ulang.');
      return;
    }

    setSubmitting(true);
    stopTimer();

    try {
      // Format answers according to backend expectation
      const formattedAnswers = questions.map(question => ({
        Soal_id: question.ID,
        Answer: answers[question.ID] || '',
        User_id: parseInt(userId)
      }));

      console.log('Submitting answers:', formattedAnswers);

      const response = await quizResultAPI.submit(formattedAnswers);
      console.log('Submit response:', response);

      if (response) {
        // Process result data
        const resultData = response.data || response;
        const totalQuestions = questions.length;
        const rawScore = resultData.score || resultData.Score || 0;
        const correctAnswers = resultData.correct_answer || resultData.Correct_Answer || 0;

        const scoreInfo = getConsistentScoreInfo(rawScore, correctAnswers, totalQuestions);

        setResult({
          ...resultData,
          ...scoreInfo,
          totalQuestions
        });
        setShowResult(true);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Terjadi kesalahan saat mengirim jawaban: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  const handleNext = () => {
    setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1));
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestion(index);
  };

  // Get answered count
  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key] !== '').length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat soal kuis...</p>
        </div>
      </div>
    );
  }

  // Show result
  if (showResult) {
    return <QuizResult result={result} />;
  }

  // No quiz or questions found
  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Kuis tidak ditemukan</h3>
          <p className="text-slate-600 mb-6">Kuis yang Anda cari tidak tersedia atau belum memiliki soal.</p>
          <button
            onClick={() => navigate('/ambil-kuis')}
            className="btn-primary"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{quiz.title}</h1>
            <p className="text-slate-600">{quiz.description}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <QuizTimer 
              timeLeft={timeLeft} 
              status={getTimeStatus} 
            />
            
            <QuizProgress 
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
              answeredCount={getAnsweredCount()}
              onQuestionSelect={handleQuestionSelect}
              answers={answers}
              questions={questions}
              className="hidden md:block"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto mb-8">
        <QuizQuestion
          question={currentQuestionData}
          questionNumber={currentQuestion + 1}
          selectedAnswer={answers[currentQuestionData.ID]}
          onAnswerChange={handleAnswerChange}
        />
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto">
        <QuizNavigation
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden mt-8">
        <QuizProgress 
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          answeredCount={getAnsweredCount()}
          onQuestionSelect={handleQuestionSelect}
          answers={answers}
          questions={questions}
        />
      </div>
    </div>
  );
};

export default JawabKuisPage;
