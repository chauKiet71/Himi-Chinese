export type CourseVisual = {
  src: string;
  alt: string;
  position: string;
};

const courseVisuals: Record<string, CourseVisual> = {
  "van-phong-hanh-chinh": {
    src: "/assets/courses/himi-concepts/himi-office-administration.webp",
    alt: "Himi sắp xếp lịch làm việc tại bàn hành chính",
    position: "center",
  },
  "nha-may-san-xuat": {
    src: "/assets/courses/himi-concepts/himi-factory-production.webp",
    alt: "Himi đội mũ bảo hộ kiểm tra máy móc trong nhà máy",
    position: "center",
  },
  "kho-van-logistics": {
    src: "/assets/courses/himi-concepts/himi-warehouse-logistics.webp",
    alt: "Himi quét kiện hàng trên xe đẩy trong kho logistics",
    position: "center",
  },
  "ban-hang-cham-soc-khach-hang": {
    src: "/assets/courses/himi-concepts/himi-sales-customer-care.webp",
    alt: "Himi đeo tai nghe và tư vấn bộ mẫu sản phẩm cho khách hàng",
    position: "center",
  },
  "nha-hang-dich-vu": {
    src: "/assets/courses/himi-concepts/himi-restaurant-service.webp",
    alt: "Himi phục vụ trà và món hấp trong nhà hàng",
    position: "center",
  },
  "thuong-mai-dien-tu": {
    src: "/assets/courses/himi-concepts/himi-ecommerce-operations.webp",
    alt: "Himi vận hành gian hàng trực tuyến và đóng gói đơn hàng",
    position: "center",
  },
  "giao-tiep-cong-so": {
    src: "/assets/courses/himi-concepts/himi-workplace-communication.webp",
    alt: "Himi chủ trì cuộc họp và điều phối giao tiếp công sở",
    position: "center",
  },
  "tieng-trung-tan-suat-cao": {
    src: "/assets/courses/himi-concepts/himi-hsk-curriculum-v2.webp",
    alt: "Himi học tiếng Trung qua nhiều chủ đề giao tiếp thiết thực",
    position: "center",
  },
};

const courseModuleVisuals: Record<string, Record<string, CourseVisual>> = {
  "van-phong-hanh-chinh": {
    "giao-tiep-van-phong-can-ban": {
      src: "/assets/courses/office-modules/office-basics.webp",
      alt: "Himi chào đồng nghiệp trong ngày đầu tại văn phòng",
      position: "center",
    },
    "phoi-hop-va-giai-quyet-cong-viec": {
      src: "/assets/courses/office-modules/office-collaboration.webp",
      alt: "Himi phối hợp xử lý công việc trên bảng nhiệm vụ",
      position: "center",
    },
    "hop-bao-cao-va-du-an": {
      src: "/assets/courses/office-modules/office-meetings-reports.webp",
      alt: "Himi trình bày báo cáo dự án trong phòng họp",
      position: "center",
    },
    "hanh-chinh-va-giao-tiep-nang-cao": {
      src: "/assets/courses/office-modules/office-admin-communication.webp",
      alt: "Himi trực điện thoại và sắp xếp hồ sơ hành chính",
      position: "center",
    },
    "thuc-hanh-giao-tiep-doc-lap": {
      src: "/assets/courses/office-modules/office-coordination-practice.webp",
      alt: "Himi thực hành phối hợp công việc với đồng nghiệp từ xa",
      position: "center",
    },
  },
  "nha-may-san-xuat": {
    "an-toan-va-bat-dau-ca": {
      src: "/assets/courses/factory-modules/factory-safety-shift-start.webp",
      alt: "Himi kiểm tra trang bị an toàn trước khi bắt đầu ca",
      position: "center",
    },
    "van-hanh-va-san-luong": {
      src: "/assets/courses/factory-modules/factory-operation-output.webp",
      alt: "Himi theo dõi vận hành và sản lượng trên bảng điều khiển",
      position: "center",
    },
    "chat-luong-va-su-co": {
      src: "/assets/courses/factory-modules/factory-quality-incident.webp",
      alt: "Himi kiểm tra chất lượng và cách ly sản phẩm lỗi",
      position: "center",
    },
    "ban-giao-va-cai-tien": {
      src: "/assets/courses/factory-modules/factory-handover-improvement.webp",
      alt: "Himi sắp xếp dụng cụ và cải tiến khu vực làm việc",
      position: "center",
    },
    "thuc-hanh-giao-tiep-doc-lap": {
      src: "/assets/courses/factory-modules/factory-workshop-communication.webp",
      alt: "Himi trao đổi trạng thái máy bằng bộ đàm tại xưởng",
      position: "center",
    },
  },
  "kho-van-logistics": {
    "nhap-kho-va-kiem-dem": {
      src: "/assets/courses/logistics-modules/logistics-inbound-counting.webp",
      alt: "Himi quét kiện hàng khi nhập kho và kiểm đếm",
      position: "center",
    },
    "ton-kho-va-vi-tri": {
      src: "/assets/courses/logistics-modules/logistics-inventory-location.webp",
      alt: "Himi quét vị trí và kiểm tra hàng trên kệ kho",
      position: "center",
    },
    "soan-hang-va-xuat-kho": {
      src: "/assets/courses/logistics-modules/logistics-picking-outbound.webp",
      alt: "Himi soạn và đóng gói hàng trước khi xuất kho",
      position: "center",
    },
    "van-chuyen-va-bat-thuong": {
      src: "/assets/courses/logistics-modules/logistics-transport-exception.webp",
      alt: "Himi điều phối vận chuyển và xử lý kiện hàng bất thường",
      position: "center",
    },
    "thuc-hanh-giao-tiep-doc-lap": {
      src: "/assets/courses/logistics-modules/logistics-dispatch-coordination.webp",
      alt: "Himi thực hành điều phối giao nhận tại khu xuất hàng",
      position: "center",
    },
  },
  "ban-hang-cham-soc-khach-hang": {
    "tu-van-nhu-cau": {
      src: "/assets/courses/sales-modules/sales-needs-consulting.webp",
      alt: "Himi lắng nghe và tư vấn nhu cầu sản phẩm cho khách hàng",
      position: "center",
    },
    "bao-gia-va-chot-don": {
      src: "/assets/courses/sales-modules/sales-quotation-close.webp",
      alt: "Himi xác nhận báo giá và hoàn tất đơn hàng",
      position: "center",
    },
    "theo-doi-don-va-giao-hang": {
      src: "/assets/courses/sales-modules/sales-order-delivery.webp",
      alt: "Himi theo dõi hành trình đơn hàng và phối hợp giao nhận",
      position: "center",
    },
    "cham-soc-va-khieu-nai": {
      src: "/assets/courses/sales-modules/sales-aftercare-complaint.webp",
      alt: "Himi hỗ trợ đổi trả và xử lý phản hồi sau bán",
      position: "center",
    },
    "thuc-hanh-giao-tiep-doc-lap": {
      src: "/assets/courses/sales-modules/sales-independent-followup.webp",
      alt: "Himi thực hành tư vấn và theo dõi khách hàng độc lập",
      position: "center",
    },
  },
  "nha-hang-dich-vu": {
    "don-khach-va-xep-ban": {
      src: "/assets/courses/restaurant-modules/restaurant-welcome-seating.webp",
      alt: "Himi đón khách và hướng dẫn tới bàn đã chuẩn bị",
      position: "center",
    },
    "goi-mon-va-yeu-cau-an-uong": {
      src: "/assets/courses/restaurant-modules/restaurant-order-dietary.webp",
      alt: "Himi giới thiệu món và xác nhận yêu cầu ăn uống",
      position: "center",
    },
    "phuc-vu-tai-ban": {
      src: "/assets/courses/restaurant-modules/restaurant-table-service.webp",
      alt: "Himi phục vụ món ăn và trà tại bàn",
      position: "center",
    },
    "thanh-toan-va-phan-hoi": {
      src: "/assets/courses/restaurant-modules/restaurant-payment-feedback.webp",
      alt: "Himi hỗ trợ thanh toán và tiếp nhận phản hồi",
      position: "center",
    },
    "thuc-hanh-giao-tiep-doc-lap": {
      src: "/assets/courses/restaurant-modules/restaurant-service-coordination.webp",
      alt: "Himi thực hành điều phối chăm sóc khách tại bàn",
      position: "center",
    },
  },
  "thuong-mai-dien-tu": {
    "san-pham-va-gian-hang": {
      src: "/assets/courses/ecommerce-modules/ecommerce-product-storefront.webp",
      alt: "Himi chuẩn bị hình ảnh sản phẩm và gian hàng trực tuyến",
      position: "center",
    },
    "nha-cung-cap-va-gia": {
      src: "/assets/courses/ecommerce-modules/ecommerce-supplier-pricing.webp",
      alt: "Himi so sánh nhà cung cấp, mẫu hàng và báo giá",
      position: "center",
    },
    "van-hanh-don-va-ton": {
      src: "/assets/courses/ecommerce-modules/ecommerce-order-inventory.webp",
      alt: "Himi quét đơn hàng và đồng bộ tồn kho",
      position: "center",
    },
    "hau-mai-va-toi-uu": {
      src: "/assets/courses/ecommerce-modules/ecommerce-aftercare-optimization.webp",
      alt: "Himi xử lý đổi trả và theo dõi hiệu quả gian hàng",
      position: "center",
    },
    "thuc-hanh-giao-tiep-doc-lap": {
      src: "/assets/courses/ecommerce-modules/ecommerce-independent-operations.webp",
      alt: "Himi thực hành điều phối đơn hàng trực tuyến độc lập",
      position: "center",
    },
  },
  "giao-tiep-cong-so": {
    "giao-tiep-hang-ngay": {
      src: "/assets/courses/workplace-modules/workplace-daily-communication.webp",
      alt: "Himi chào hỏi và xác nhận thông tin trong giao tiếp hằng ngày",
      position: "center",
    },
    "hieu-viec-va-phoi-hop": {
      src: "/assets/courses/workplace-modules/workplace-task-coordination.webp",
      alt: "Himi làm rõ nhiệm vụ, ưu tiên và thời hạn phối hợp",
      position: "center",
    },
    "bao-cao-va-xu-ly-van-de": {
      src: "/assets/courses/workplace-modules/workplace-report-problem-solving.webp",
      alt: "Himi báo cáo trở ngại và đề xuất phương án xử lý",
      position: "center",
    },
    "giao-tiep-da-kenh": {
      src: "/assets/courses/workplace-modules/workplace-multichannel-communication.webp",
      alt: "Himi giao tiếp qua điện thoại, tin nhắn và cuộc họp trực tuyến",
      position: "center",
    },
  },
  "tieng-trung-tan-suat-cao": {
    "giao-tiep-hang-ngay": {
      src: "/assets/courses/high-frequency-modules/high-frequency-daily-topics.webp",
      alt: "Himi học từ vựng tần suất cao qua các chủ đề sinh hoạt hằng ngày",
      position: "center",
    },
    "giao-tiep-theo-tinh-huong": {
      src: "/assets/courses/high-frequency-modules/high-frequency-situational-topics.webp",
      alt: "Himi luyện giao tiếp theo các tình huống công việc và dịch vụ",
      position: "center",
    },
  },
};

export function getCourseVisual(slug: string): CourseVisual {
  return courseVisuals[slug] ?? courseVisuals["giao-tiep-cong-so"];
}

export function getCourseModuleVisual(courseSlug: string, moduleSlug: string): CourseVisual {
  return courseModuleVisuals[courseSlug]?.[moduleSlug] ?? getCourseVisual(courseSlug);
}
