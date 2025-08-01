import {
  Button,
  Card,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";

export function MemberDetail() {
  const [member, setMember] = useState(null);
  const [withdrawModalShow, setWithdrawModalShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 버튼 중복 클릭 방어
  const [isWithdrawProcessing, setIsWithdrawProcessing] = useState(false);

  const [memberParams] = useSearchParams();

  const navigate = useNavigate();

  const { logout, hasAccess } = useContext(AuthenticationContext);

  // 회원 정보 조회
  useEffect(() => {
    axios
      .get(`/api/member?id=${memberParams.get("id")}`)
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) => {})
      .finally(() => {});
  }, [memberParams]);

  // 회원 정보 없을때 (ex: null)
  if (!member) {
    return (
      <div>
        <div>
          <Spinner />
        </div>
        회원 정보를 불러오는 중 . . .{" "}
      </div>
    );
  }

  // 회원 탈퇴
  function handleWithdrawButtonClick() {
    if (isWithdrawProcessing) return; // 중복 클릭 방어
    setIsWithdrawProcessing(true);

    axios
      .delete(`/api/member`, {
        data: { id: member.id, oldPassword: oldPassword },
      })
      .then((res) => {
        navigate("/");
        logout();
      })
      .catch((err) => {
        setPasswordError("비밀번호가 일치하지 않습니다");
      })
      .finally(() => {
        setIsWithdrawProcessing(false);
      });
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ paddingTop: "40px" }}
      >
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <Card className="p-4 shadow rounded">
            <Card.Body>
              <Row>
                <Col>
                  <h2 className="mb-4 text-center">회원 정보</h2>
                  <div>
                    <FormGroup controlId="loginId1" className="mb-2">
                      <FormLabel className="fw-semibold">아이디</FormLabel>
                      <FormControl readOnly value={member.loginId} />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="name1" className="mb-2">
                      <FormLabel className="fw-semibold">이름</FormLabel>
                      <FormControl readOnly value={member.name} />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="birthday1" className="mb-2">
                      <FormLabel className="fw-semibold">생년월일</FormLabel>
                      <FormControl readOnly value={member.birthday} />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="phone1" className="mb-2">
                      <FormLabel className="fw-semibold">전화번호</FormLabel>
                      <FormControl readOnly value={member.phone} />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="email1" className="mb-2">
                      <FormLabel className="fw-semibold">이메일</FormLabel>
                      <FormControl readOnly value={member.email} />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="address1" className="mb-2">
                      <FormLabel className="fw-semibold">주소</FormLabel>
                      <FormControl readOnly value={member.zipCode} />
                      <FormControl readOnly value={member.address} />
                      <FormControl readOnly value={member.addressDetail} />
                    </FormGroup>
                  </div>
                  {hasAccess(member.loginId) && (
                    <div className="text-end">
                      <Button
                        className="me-2"
                        variant="dark"
                        onClick={() => navigate(`/member/edit?id=${member.id}`)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setWithdrawModalShow(true)}
                      >
                        탈퇴
                      </Button>
                    </div>
                  )}
                </Col>
                <Modal
                  show={withdrawModalShow}
                  onHide={() => setWithdrawModalShow(false)}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>회원 탈퇴 확인</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="mb-3" style={{ fontSize: "13px" }}>
                      정말 탈퇴하시겠습니까? 탈퇴를 위해 비밀번호를
                      입력해주세요.
                    </p>
                    <FormGroup>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl
                        id="withdraw-password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                          setPasswordError("");
                        }}
                        autoFocus
                        isInvalid={!!passwordError}
                      />
                      {passwordError && (
                        <FormText className="text-danger">
                          {passwordError}
                        </FormText>
                      )}
                    </FormGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="dark"
                      onClick={() => {
                        setWithdrawModalShow(false);
                        setOldPassword("");
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleWithdrawButtonClick}
                      variant="danger"
                      disabled={!oldPassword || isWithdrawProcessing}
                    >
                      {isWithdrawProcessing ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          전송 중...
                        </>
                      ) : (
                        "탈퇴"
                      )}
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}
