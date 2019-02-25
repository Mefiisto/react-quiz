import {
  CREATE_QUIZ_QUESTION,
  RESET_QUIZ_CREATION
} from './actionsTypes'
import axios from 'axios'

export function createQuizQuestion(item) {
	return {
		type: CREATE_QUIZ_QUESTION,
		item
	}
}

export function resetQuizCreation() {
	return {
		type: RESET_QUIZ_CREATION
	}
}

export function finishCreateQuiz() {
	return async (dispatch, getState) => {
		await axios.post('https://react-quiz-37dfe.firebaseio.com/quizes.json', getState().create.quiz)
		dispatch(resetQuizCreation())
	}
}