import { z } from "zod";

export const inquirySubmissionSchema = z.object({
  name: z
    .string()
    .min(2, { message: "성함을 2자 이상 입력해 주세요." })
    .max(50, { message: "성함은 50자 이내로 입력해 주세요." }),
  company: z.string().max(100, { message: "회사명은 100자 이내로 입력해 주세요." }).optional().nullable(),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해 주세요." }),
  phone: z
    .string()
    .min(9, { message: "올바른 연락처를 입력해 주세요." })
    .max(20, { message: "연락처가 너무 깁니다." }),
  inquiryType: z.string().min(1, { message: "문의 구분을 선택해 주세요." }),
  serviceCategory: z.string().optional().nullable(),
  location: z.string().max(200, { message: "지역/현장 위치는 200자 이내로 입력해 주세요." }).optional().nullable(),
  message: z
    .string()
    .min(10, { message: "문의 내용을 최소 10자 이상 상세히 입력해 주세요." })
    .max(3000, { message: "문의 내용은 3000자 이내로 입력해 주세요." }),
  preferredContactMethod: z.enum(["PHONE", "EMAIL", "KAKAO"]).default("PHONE"),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "개인정보 수집 및 이용에 동의해야 문의를 접수할 수 있습니다.",
  }),
});

export type InquirySubmissionInput = z.infer<typeof inquirySubmissionSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해 주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});

export const inquiryStatusUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "UNREAD",
    "IN_PROGRESS",
    "WAITING_FOR_CUSTOMER",
    "COMPLETED",
    "REJECTED",
  ]),
});

export const inquiryNoteSchema = z.object({
  content: z.string().min(2, { message: "메모 내용을 입력해 주세요." }),
});

export const inquiryAssignSchema = z.object({
  userId: z.string().min(1, { message: "담당자를 선택해 주세요." }),
  notes: z.string().optional(),
});
