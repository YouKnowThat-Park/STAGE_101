export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ `ReviewAddModal`에 필요한 속성 추가
export interface ReviewModalProps extends ModalProps {
  watchedTheaters: { id: string; name: string }[]; // ✅ 감상한 극장 목록
  onSubmit: () => void; // ✅ 리뷰 작성 완료 시 호출할 함수
}
