import { Modal, Button } from "react-bootstrap";

export default function PrivacyModal({ show, onClose, onAgree }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>개인정보 수집 및 이용 동의</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>1. 수집 항목: 이름, 전화번호, 이메일</p>
        <p>2. 수집 목적: 서비스 제공, 본인 확인, 문의 응대</p>
        <p>3. 보유 기간: 회원 탈퇴 시까지 또는 수집 후 1년간 보관</p>
        <p>
          4. 귀하는 개인정보 제공에 동의하지 않으실 수 있으며,
          <br />
          <span style={{ textIndent: "1em", display: "inline-block" }}>
            동의하지 않을 경우 서비스 이용에 제한이 있을 수 있습니다.
          </span>
        </p>
        <br />
        <p>※ 위 내용을 확인하였으며, 개인정보 수집 및 이용에 동의합니다.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          onClick={() => {
            onAgree(true); // 동의함
            onClose();
          }}
        >
          동의
        </Button>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
