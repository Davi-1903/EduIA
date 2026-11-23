from pathlib import Path

from flask_login import current_user
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from models.historico import Historico
from models.material import Difficulty
from models.quizzes import Quiz
from utils import setup_logger
from datetime import datetime, timezone
from schemas.quizzes import QuizSubmission


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'quizzes.log')

def get_quizzes_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Quiz)
            .where(Quiz.user_id == current_user.id)
            .where(Quiz.deleted_at.is_(None))
        )
        statement = (
            select(Quiz)
            .where(Quiz.user_id == current_user.id)
            .where(Quiz.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Quiz.created_at.desc())
        )

        total = session.scalar(count_stmt) or 0
        materials = session.scalars(statement).all()

        return {
            'total': total,
            'materials': [
                {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'difficulty': material.difficulty.value,
                    'timer_per_question': material.time_per_question,
                    'amount': material.amount,
                    'created_at': material.created_at,
                    'type': material.type.value,
                    'attempts_count': len((material.answers or {}).get('attempts', [])),
                    'last_score': (
                        (material.answers or {}).get('attempts', [{}])[-1].get('score')
                        if material.answers and material.answers.get('attempts')
                        else None
                    ),
                }
                for material in materials
            ],
        }
        


def get_quiz_service(id: int):
    with SessionLocal() as session:
        material = session.get(Quiz, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Quiz não encontrado')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'difficulty': material.difficulty.value,
            'timer_per_question': material.time_per_question,
            'amount': material.amount,
            'content': material.content,
            'answers': material.answers,
            'created_at': material.created_at,
            'type': material.type.value,
        }

def create_quiz_service(data: dict):
    with SessionLocal() as session:
        try:
            quiz = Quiz(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                difficulty=Difficulty(data['difficulty']),
                time_per_question=data['time_per_question'],
                amount=data['amount'],
                note=data['note'] if data['note'] != '' else None,
            )
            historico = Historico(material=quiz)
            session.add(quiz)
            session.add(historico)
            session.commit()
            logger.info('Quiz salvo no banco de dados')

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar quiz no banco de dados')
            raise MaterialServiceError('Ocorreu um erro interno') from exc

def submit_quiz_service(quiz_id: int, submission: QuizSubmission):
    with SessionLocal() as session:
        quiz = session.get(Quiz, quiz_id)
        if quiz is None or quiz.deleted_at is not None or quiz.user_id != current_user.id:
            raise MaterialNotFoundError('Quiz não encontrado')

        questions = {q['id']: q for q in quiz.content['content']}

        submitted = {}
        for item in submission.answers:
            question = questions.get(item.questionId)
            if question is None or item.questionId in submitted:
                raise MaterialValidationError('Respostas inválidas')
            if item.answerId is not None and item.answerId not in {a['id'] for a in question['answers']}:
                raise MaterialValidationError('Respostas inválidas')
            submitted[item.questionId] = item.answerId

        details = []
        score = 0
        for question_id, question in questions.items():
            answer_id = submitted.get(question_id)
            is_correct = answer_id is not None and answer_id == question['correctAnswerId']
            score += int(is_correct)
            details.append({
                'questionId': question_id,
                'answerId': answer_id,
                'correctAnswerId': question['correctAnswerId'],
                'isCorrect': is_correct,
            })

        attempt = {
            'score': score,
            'total': len(questions),
            'answered_at': datetime.now(timezone.utc).isoformat(),
            'details': details,
        }

        try:
            previous = (quiz.answers or {}).get('attempts', [])
            quiz.answers = {'attempts': [*previous, attempt]}
            session.commit()
            logger.info('Tentativa de quiz salva no banco de dados')
            return attempt

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar tentativa de quiz')
            raise MaterialServiceError('Ocorreu um erro interno') from exc
