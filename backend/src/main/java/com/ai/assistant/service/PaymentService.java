package com.ai.assistant.service;

import com.ai.assistant.dto.PaymentDto;
import com.ai.assistant.entity.Payment;
import com.ai.assistant.entity.Project;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.PaymentRepository;
import com.ai.assistant.repository.ProjectRepository;
import com.ai.assistant.repository.UserRepository;
import com.ai.assistant.security.CustomUserDetails;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private static final BigDecimal GST_RATE = new BigDecimal("0.18");

    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    public PaymentService(
            PaymentRepository paymentRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    private RazorpayClient getRazorpayClient() {
        if (razorpayClient == null && isRazorpayConfigured()) {
            try {
                razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            } catch (Exception e) {
                log.error("Failed to initialize Razorpay client", e);
            }
        }
        return razorpayClient;
    }

    public boolean isRazorpayConfigured() {
        return razorpayKeyId != null && !razorpayKeyId.isBlank()
                && razorpayKeySecret != null && !razorpayKeySecret.isBlank();
    }

    public List<Map<String, Object>> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 100))
                .getContent().stream()
                .map(this::toRow)
                .toList();
    }

    public Map<String, Object> getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .map(this::toRow)
                .orElse(null);
    }

    @Transactional
    public Map<String, Object> createOrder(Map<String, Object> request) {
        User currentUser = getCurrentUser();

        BigDecimal amount = new BigDecimal(String.valueOf(request.getOrDefault("amount", "0")));
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        BigDecimal gstAmount = amount.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = amount.add(gstAmount);

        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setGstAmount(gstAmount);
        payment.setTotalAmount(totalAmount);
        payment.setCurrency("INR");
        payment.setStatus("CREATED");
        payment.setDescription(String.valueOf(request.getOrDefault("description", "")));
        payment.setUser(currentUser);

        String invoiceNumber = "INV-" + System.currentTimeMillis();
        payment.setInvoiceNumber(invoiceNumber);

        if (request.containsKey("projectId")) {
            Long projectId = Long.valueOf(String.valueOf(request.get("projectId")));
            projectRepository.findById(projectId).ifPresent(payment::setProject);
        }

        // Create Razorpay order (real or mock)
        String orderId;
        RazorpayClient client = getRazorpayClient();
        if (client != null) {
            try {
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", Math.round(totalAmount.doubleValue() * 100)); // paise
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", invoiceNumber);
                orderRequest.put("payment_capture", 1); // auto-capture

                Order rzpOrder = client.orders.create(orderRequest);
                orderId = rzpOrder.get("id");
                log.info("Razorpay order created: {}", orderId);
            } catch (Exception e) {
                log.warn("Razorpay order creation failed, using mock: {}", e.getMessage());
                orderId = "order_" + System.currentTimeMillis();
            }
        } else {
            orderId = "order_" + System.currentTimeMillis();
        }
        payment.setRazorpayOrderId(orderId);

        Payment saved = paymentRepository.save(payment);
        Map<String, Object> row = toRow(saved);
        row.put("razorpayKeyId", razorpayKeyId);

        // Include customer details for Razorpay prefill
        row.put("customerName", String.valueOf(request.getOrDefault("customerName", "")));
        row.put("customerEmail", String.valueOf(request.getOrDefault("customerEmail", "")));
        row.put("customerPhone", String.valueOf(request.getOrDefault("customerPhone", "")));
        return row;
    }

    @Transactional
    public Map<String, Object> verifyPayment(Map<String, Object> request) {
        String orderId = String.valueOf(request.getOrDefault("razorpay_order_id", ""));
        String paymentId = String.valueOf(request.getOrDefault("razorpay_payment_id", ""));
        String signature = String.valueOf(request.getOrDefault("razorpay_signature", ""));

        Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        // Verify signature if Razorpay is configured
        if (isRazorpayConfigured()) {
            try {
                String payload = orderId + "|" + paymentId;
                Mac mac = Mac.getInstance("HmacSHA256");
                mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
                byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
                String expectedSignature = HexFormat.of().formatHex(hash);
                if (!expectedSignature.equals(signature)) {
                    payment.setStatus("FAILED");
                    paymentRepository.save(payment);
                    throw new IllegalArgumentException("Payment verification failed - invalid signature");
                }
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception e) {
                log.error("Signature verification error", e);
                payment.setStatus("FAILED");
                paymentRepository.save(payment);
                throw new IllegalArgumentException("Payment verification failed");
            }
        }

        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus("SUCCESS");
        payment.setPaymentMethod(String.valueOf(request.getOrDefault("paymentMethod", "CARD")));

        return toRow(paymentRepository.save(payment));
    }

    @Transactional
    public Map<String, Object> processRefund(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (!"SUCCESS".equals(payment.getStatus())) {
            throw new IllegalArgumentException("Can only refund successful payments");
        }

        payment.setRefundId("refund_" + System.currentTimeMillis());
        payment.setRefundStatus("PROCESSED");
        payment.setStatus("REFUNDED");

        return toRow(paymentRepository.save(payment));
    }

    public Map<String, Object> getStats() {
        long total = paymentRepository.count();
        long success = paymentRepository.countByStatus("SUCCESS");
        long pending = paymentRepository.countByStatus("CREATED");
        long refunded = paymentRepository.countByStatus("REFUNDED");

        return new LinkedHashMap<>(Map.of(
                "totalPayments", total,
                "successful", success,
                "pending", pending,
                "refunded", refunded
        ));
    }

    private String generateSignature(String orderId, String paymentId) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            log.error("Signature generation failed", e);
            return "";
        }
    }

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getUser();
        }
        return null;
    }

    private Map<String, Object> toRow(Payment payment) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", payment.getId());
        row.put("invoiceNumber", payment.getInvoiceNumber());
        row.put("amount", payment.getAmount());
        row.put("gstAmount", payment.getGstAmount());
        row.put("totalAmount", payment.getTotalAmount());
        row.put("currency", payment.getCurrency());
        row.put("status", payment.getStatus());
        row.put("paymentMethod", payment.getPaymentMethod());
        row.put("description", payment.getDescription());
        row.put("razorpayOrderId", payment.getRazorpayOrderId());
        row.put("razorpayPaymentId", payment.getRazorpayPaymentId());
        row.put("refundId", payment.getRefundId());
        row.put("refundStatus", payment.getRefundStatus());
        row.put("createdAt", payment.getCreatedAt());
        row.put("updatedAt", payment.getUpdatedAt());
        if (payment.getUser() != null) {
            row.put("user", payment.getUser().getFullName());
            row.put("userEmail", payment.getUser().getEmail());
        }
        if (payment.getProject() != null) {
            row.put("project", payment.getProject().getProjectName());
        }
        return row;
    }
}
