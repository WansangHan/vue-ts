import { QuizType } from "@/types/QuizItem";
import { saveQuizResult, getQuizItem } from "@/store/modules/indexedDB";

export class SpacedRepetition {
  /**
   * 에빙하우스의 망각 곡선을 기반으로 다음 학습 날짜를 계산
   * @param lastInterval 마지막 학습 간격 (단위: 일)
   * @param isCorrect 정답 여부
   * @returns 다음 학습까지의 간격 (단위: 일)
   */
  private static calculateNextInterval(lastInterval: number, isCorrect: boolean): number {
    if (isCorrect) {
      return lastInterval > 0 ? lastInterval * 2 : 1; // 정답이면 복습 간격 증가 (1일 → 2일 → 4일 ...)
    } else {
      return 1; // 오답이면 다음날 다시 복습
    }
  }

  /**
   * 퀴즈 결과를 저장하고 다음 학습 일정을 조정
   * @param quizId 퀴즈 ID
   * @param quizType 퀴즈 유형
   * @param isCorrect 정답 여부
   */
  static async updateQuizSchedule(quizId: string, quizType: QuizType, isCorrect: boolean) {
    const quizItem = await getQuizItem(quizId, quizType);

    if (!quizItem) {
      console.error("해당 퀴즈를 찾을 수 없음:", quizId);
      return;
    }

    const nextInterval = this.calculateNextInterval(quizItem.interval, isCorrect);
    quizItem.interval = nextInterval;
    quizItem.lastReviewed = new Date();

    await saveQuizResult(quizId, quizType, quizItem);
  }
}