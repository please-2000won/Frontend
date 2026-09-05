import { useState } from 'react';

// Props 타입 정의
interface FeedbackModalProps {
  type: 'LIKE' | 'DISLIKE' | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackType: 'LIKE' | 'DISLIKE' | null, comment: string) => void;
}

const FeedbackModal = ({
  type,
  isOpen,
  onClose,
  onSubmit,
}: FeedbackModalProps) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null; // 열려있지 않으면 아무것도 그리지 않음

  // type에 따라 모달 제목 변경
  const title =
    type === 'LIKE' ? '어떤 점이 좋으셨나요?' : '어떤 점이 아쉬우셨나요?';
  const placeholder =
    type === 'LIKE'
      ? '좋았던 점을 자유롭게 남겨주세요.'
      : '더 나은 답변을 위해 아쉬운 점을 남겨주세요.';

  const handleSubmit = () => {
    onSubmit(type, comment); // 부모 컴포넌트로 타입과 내용 전달
    setComment(''); // 입력창 초기화
    onClose(); // 모달 닫기
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-[400px] shadow-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-mint-900 resize-none text-sm"
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-primary-mint-900 text-white hover:bg-primary-mint-900/90 text-sm font-semibold"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
