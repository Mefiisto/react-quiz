import axios from 'axios'
import {
	FETCH_QUIZES_START, 
	FETCH_QUIZES_SUCCES, 
	FETCH_QUIZES_ERROR, 
	FETCH_QUIZ_SUCCESS, 
	QUIZ_SET_STATE,
	FINISH_QUIZ,
	QUIZ_NEXT_QUESTION,
	QUIZ_RETRY
} from './actionsTypes'

// QuizList Actions

export function fetchQuizes() {
	return  async dispatch => {
		dispatch(fetchQuizesStart())
		try { 
			const response = await axios.get('https://react-quiz-37dfe.firebaseio.com/quizes.json')
			const quizes = []

			Object.keys(response.data).forEach((key,index) => {
				quizes.push({
					id:key,
					name: `Тест ${index + 1}`,
					quizTitle: response.data[key][0].quizTitle
				})
			})
			dispatch(fetchQuizesSuccses(quizes))
		} 
		catch (e) {
			dispatch(fetchQuizesError(e))
		}
	}
}



export function fetchQuizesStart() {
	return {
		type: FETCH_QUIZES_START
	}
}


export function fetchQuizesSuccses(quizes) {
	return {
		type: FETCH_QUIZES_SUCCES,
		quizes
	}
}


export function fetchQuizesError(e) {
	return {
		type: FETCH_QUIZES_ERROR,
		error: e
	}
}



//  Quiz Actions
export function fetchQuizById(quizId) {
	return async dispatch => {
		dispatch(fetchQuizesStart)
		try { 
			const response = await axios.get(`https://react-quiz-37dfe.firebaseio.com/quizes/${quizId}.json`)
			const quiz = response.data
			console.log(response)

			dispatch(fetchQuizSuccses(quiz))

		}
		catch (e) {
			dispatch(fetchQuizesError(e))
		}
	}
}


export function fetchQuizSuccses(quiz) {
	return {
		quiz,
		type: FETCH_QUIZ_SUCCESS
	}
}




export function quizAnswerClick(answerId) {
	return (dispatch, getState) => {
		const state = getState().quiz
		if (state.answerState) {
			const key = Object.keys(state.answerState)[0]
			if(state.answerState[key] === 'success') {
				return 
			}
		}

		const question = state.quiz[state.activeQuestion]
		const results = state.results;
		
		if(question.rightAnswerId === answerId ) {
			if(!results[question.id]) {
				results[question.id] = 'success'
			}

			dispatch(quizSetState({[answerId]: 'success'}, results))

			const timeout = window.setTimeout(() => {
				if(isQuizFinished(state)) {
					dispatch(finishQuiz())
				} else {
					dispatch(quizNextQuestion(state.activeQuestion + 1))
				}
				window.clearTimeout(timeout)
			}, 1000)

			
		} else {
			results[question.id] = 'error'
			dispatch(quizSetState({[answerId]: 'error'}, results))

		}
	}
}


export function quizSetState(answerState, results) {
	return {
		type: QUIZ_SET_STATE,
		answerState, results
	}
}


export function finishQuiz() {
	return {
		type: FINISH_QUIZ
	}
}


export function quizNextQuestion(questionNumber) {
	return {
		type: QUIZ_NEXT_QUESTION,
		number: questionNumber
	}
}


function isQuizFinished(state) {
	return state.activeQuestion + 1 === state.quiz.length
}


export function retryQuiz() {
	return {
		type: QUIZ_RETRY
	}
}



// QuizCreator Actions

