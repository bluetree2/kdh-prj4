package com.example.backend.email;

import com.example.backend.util.RedisUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${spring.mail.username}")
    private String senderEmail;

    private final JavaMailSender mailSender;
    private final RedisUtil redisUtil;

    public EmailAuthResponseDto sendEmail(String toEmail) {
        // 이미 인증번호가 Redis 에 있다면 재전송 제한
        if (redisUtil.existData(toEmail)) {
            long remainTime = redisUtil.getExpire(toEmail); // 남은 유효 시간 (초 단위)
            return new EmailAuthResponseDto(false,
                    "이미 인증번호가 전송되었습니다." + remainTime + "초 후 다시 시도하세요.", remainTime);
        }

        try {
            MimeMessage emailForm = createEmailForm(toEmail);
            mailSender.send(emailForm);
            long remainTime = redisUtil.getExpire(toEmail); // 남은 유효 시간 (초 단위)
            return new EmailAuthResponseDto(true, "인증번호가 메일로 전송되었습니다.", remainTime);
        } catch (MessagingException | MailSendException e) {
            return new EmailAuthResponseDto(false, "메일 전송 중 오류가 발생하였습니다. 다시 시도해주세요.", 0);
        }
    }

    private MimeMessage createEmailForm(String email) throws MessagingException {

        String authCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        MimeMessage message = mailSender.createMimeMessage();
        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO, email);
        message.setSubject("인증코드입니다.");
        message.setText(setContext(authCode), "utf-8", "html");

        redisUtil.setDataExpire(email, authCode, 3 * 60L); // 3분

        return message;
    }

    private String setContext(String authCode) {
        String body = "";
        body += "<h4>" + "인증 코드를 입력하세요." + "</h4>";
        body += "<h2>" + "[" + authCode + "]" + "</h2>";
        return body;
    }

    public EmailAuthResponseDto validateAuthCode(String email, String authCode) {
        String findAuthCode = redisUtil.getData(email);
        if (findAuthCode == null) {
            return new EmailAuthResponseDto(false, "인증번호가 만료되었습니다. 다시 시도해주세요.", 0);
        }

        if (findAuthCode.equals(authCode)) {
            redisUtil.deleteData(email);
            return new EmailAuthResponseDto(true, "인증 성공에 성공했습니다.", 0);

        } else {
            return new EmailAuthResponseDto(false, "인증번호가 일치하지 않습니다.", 0);
        }
    }
}