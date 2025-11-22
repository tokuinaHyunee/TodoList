interface Props {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <h3>삭제 확인</h3>
        <p>정말 "{title}" 을(를) 삭제하시겠습니까?</p>

        <div className="modal-button-group">
          <button className="confirm-btn" onClick={onConfirm}>
            삭제
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
