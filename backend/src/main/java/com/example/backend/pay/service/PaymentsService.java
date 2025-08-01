package com.example.backend.pay.service;

import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.pay.dto.TossPaymentResDto;
import com.example.backend.pay.entity.Payment;
import com.example.backend.pay.respository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentsService {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;

//    private final ModelMapper modelmapper;


    public void add(TossPaymentResDto dto, Authentication authentication) {

//        Payment payment = modelmapper.map(dto, Payment.class);

        Payment payment = new Payment();
        payment.setPaymentKey(dto.getPaymentKey());
        payment.setStatus(dto.getStatus());
        payment.setVersion(dto.getVersion());
        payment.setTransactionKey(dto.getLastTransactionKey());
        payment.setPaymentMethod(dto.getMethod());
        payment.setOrderId(dto.getOrderId());
        payment.setOrderName(dto.getOrderName());
        payment.setRequestedAt(dto.getRequestedAt());
        payment.setApprovedAt(dto.getApprovedAt());
        payment.setVirtualAccountInfo(String.valueOf(dto.getVirtualAccount()));
        payment.setErrorCode(dto.getCode());
        payment.setErrorMessage(dto.getMessage());
        payment.setAmount(dto.getTotalAmount());
        payment.setMid(dto.getMid());
        Member user = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
        payment.setUserid(user);

        paymentRepository.save(payment);
    }
}
