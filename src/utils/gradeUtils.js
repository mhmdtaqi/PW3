// Utility functions for consistent grade calculation across all pages

/**
 * Calculate grade based on score (0-100)
 * This is the SINGLE SOURCE OF TRUTH for grade calculation
 */
export const getGradeFromScore = (score) => {
  const numScore = Number(score) || 0;
  
  if (numScore >= 90) return 'A';
  if (numScore >= 80) return 'B';
  if (numScore >= 70) return 'C';
  if (numScore >= 60) return 'D';
  return 'E';
};

/**
 * Calculate grade based on correct answers and total questions
 */
export const getGradeFromAnswers = (correctAnswers, totalQuestions) => {
  if (!totalQuestions || totalQuestions === 0) return 'E';
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  return getGradeFromScore(percentage);
};

/**
 * Get grade color classes for UI
 */
export const getGradeColor = (grade) => {
  switch (grade) {
    case 'A':
      return 'text-green-600 bg-green-50';
    case 'B':
      return 'text-blue-600 bg-blue-50';
    case 'C':
      return 'text-yellow-600 bg-yellow-50';
    case 'D':
      return 'text-orange-600 bg-orange-50';
    case 'E':
    default:
      return 'text-red-600 bg-red-50';
  }
};

/**
 * Get score color classes for UI
 */
export const getScoreColor = (score) => {
  const numScore = Number(score) || 0;
  
  if (numScore >= 90) return 'text-green-600';
  if (numScore >= 80) return 'text-blue-600';
  if (numScore >= 70) return 'text-yellow-600';
  if (numScore >= 60) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Calculate percentage from correct answers and total questions
 */
export const calculatePercentage = (correctAnswers, totalQuestions) => {
  if (!totalQuestions || totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
};

/**
 * Get complete grade info (grade, color, percentage) from score
 */
export const getCompleteGradeInfo = (score) => {
  const numScore = Number(score) || 0;
  const grade = getGradeFromScore(numScore);
  const color = getGradeColor(grade);
  
  return {
    grade,
    color,
    score: numScore,
    percentage: numScore // Score is already a percentage (0-100)
  };
};

/**
 * Get complete grade info from correct answers and total questions
 */
export const getCompleteGradeInfoFromAnswers = (correctAnswers, totalQuestions) => {
  const percentage = calculatePercentage(correctAnswers, totalQuestions);
  const grade = getGradeFromScore(percentage);
  const color = getGradeColor(grade);

  return {
    grade,
    color,
    score: percentage,
    percentage,
    correctAnswers: Number(correctAnswers) || 0,
    totalQuestions: Number(totalQuestions) || 0
  };
};

/**
 * Convert legacy score to percentage if needed
 * This handles old data that might still use point-based scoring
 */
export const normalizeScore = (score, correctAnswers, totalQuestions) => {
  const numScore = Number(score) || 0;
  const numCorrect = Number(correctAnswers) || 0;
  const numTotal = Number(totalQuestions) || 0;

  console.log('🔧 normalizeScore input:', { score, correctAnswers, totalQuestions, numScore, numCorrect, numTotal });

  // Always calculate the correct percentage from correct answers if we have the data
  if (numTotal > 0 && numCorrect >= 0) {
    const calculatedPercentage = Math.round((numCorrect / numTotal) * 100);
    console.log('🔧 Calculated percentage from answers:', calculatedPercentage);
    return calculatedPercentage;
  }

  // If we don't have correct answers data, use the score as-is if it's reasonable
  if (numScore >= 0 && numScore <= 100) {
    console.log('🔧 Using score as-is:', numScore);
    return numScore;
  }

  console.log('🔧 Fallback to 0');
  return 0;
};

/**
 * Extract correct_answer from backend response that might have weird field names
 * Backend sometimes returns "correct_answer;constraint:OnDelete:CASCADE;" instead of "correct_answer"
 */
export const extractCorrectAnswers = (data) => {
  if (!data || typeof data !== 'object') return 0;

  // Try normal field name first
  if (data.correct_answer !== undefined) {
    return Number(data.correct_answer) || 0;
  }

  // Try alternative field names (case variations)
  if (data.Correct_Answer !== undefined) {
    return Number(data.Correct_Answer) || 0;
  }

  // Try to find any field that contains "correct_answer"
  for (const key in data) {
    if (key.includes('correct_answer')) {
      return Number(data[key]) || 0;
    }
  }

  return 0;
};

/**
 * Get consistent score and grade info, handling legacy data
 */
export const getConsistentScoreInfo = (score, correctAnswers, totalQuestions) => {
  const normalizedScore = normalizeScore(score, correctAnswers, totalQuestions);
  const grade = getGradeFromScore(normalizedScore);
  const color = getGradeColor(grade);

  return {
    score: normalizedScore,
    percentage: normalizedScore,
    grade,
    color,
    correctAnswers: Number(correctAnswers) || 0,
    totalQuestions: Number(totalQuestions) || 0
  };
};
