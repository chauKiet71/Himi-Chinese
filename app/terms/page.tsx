import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Heart, ShieldCheck, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng dịch vụ học tiếng Trung Himi Chinese.",
};

const terms = [
  {
    title: "Chấp nhận điều khoản và tài khoản",
    subtitle: "Quyền, trách nhiệm và an toàn tài khoản",
    content: <>
      <p>Khi tạo tài khoản hoặc tiếp tục sử dụng Himi Chinese, bạn xác nhận đã đọc và đồng ý với các điều khoản này. Nếu không đồng ý, bạn nên ngừng sử dụng dịch vụ.</p>
      <p>Bạn cần cung cấp thông tin chính xác, giữ bí mật thông tin đăng nhập và chịu trách nhiệm đối với hoạt động phát sinh trên tài khoản của mình. Hãy thông báo ngay cho Himi khi phát hiện truy cập trái phép hoặc dấu hiệu mất an toàn.</p>
      <p>Tài khoản chỉ dành cho người sở hữu đăng ký và không được chuyển nhượng, cho thuê hoặc bán lại. Himi có thể tạm khóa tài khoản khi cần bảo vệ người dùng, ngăn chặn gian lận hoặc xử lý hành vi vi phạm điều khoản.</p>
    </>,
  },
  {
    title: "Dịch vụ và nội dung học tập",
    subtitle: "Phạm vi sử dụng của phiên bản chính thức",
    content: <>
      <p>Himi Chinese đang được cung cấp dưới dạng sản phẩm phát hành chính thức, gồm nội dung miễn phí và nội dung dành cho thành viên VIP. Phạm vi quyền truy cập của từng tài khoản được xác định theo trạng thái hiển thị trên dịch vụ.</p>
      <p>Bài học, âm thanh, hình ảnh, dữ liệu từ vựng, trò chơi và các tài liệu liên quan chỉ được cấp quyền sử dụng cá nhân, có giới hạn và không thể chuyển nhượng. Quyền sở hữu nội dung vẫn thuộc Himi Chinese hoặc bên cấp phép tương ứng.</p>
      <p>Bạn không được sao chép hàng loạt, bán lại, phát hành lại, tự động thu thập dữ liệu hoặc vượt qua cơ chế giới hạn truy cập khi chưa có sự đồng ý bằng văn bản. Kết quả học tập phụ thuộc vào quá trình sử dụng của từng người và không phải là cam kết về điểm thi hay kết quả nghề nghiệp cụ thể.</p>
    </>,
  },
  {
    title: "Gói VIP và thanh toán",
    subtitle: "Giá bán, chuyển khoản và kích hoạt quyền học",
    content: <>
      <p>Các gói VIP, thời hạn, quyền lợi và mức giá có hiệu lực là thông tin được hiển thị tại trang VIP ở thời điểm bạn tạo đơn. Himi có thể điều chỉnh gói hoặc giá cho các giao dịch trong tương lai; thay đổi này không làm giảm thời hạn VIP đã được kích hoạt trước đó.</p>
      <p>Thanh toán được thực hiện một lần cho từng đơn thông qua mã VietQR hoặc chuyển khoản ngân hàng và được SePay hỗ trợ đối soát. Bạn cần đăng nhập đúng tài khoản, chuyển đúng số tiền, đúng nội dung thanh toán và hoàn tất trước khi mã hết hạn.</p>
      <p>Khi ngân hàng và SePay xác nhận giao dịch hợp lệ, quyền VIP sẽ được kích hoạt tự động. Giao dịch sai số tiền, sai nội dung hoặc đến sau thời hạn có thể chuyển sang đối soát thủ công; bạn nên giữ lại biên lai cho đến khi quyền học được cập nhật.</p>
      <p>Thời hạn VIP bắt đầu từ lúc kích hoạt. Khi gia hạn trong lúc gói còn hiệu lực, thời gian mới được cộng tiếp vào thời hạn hiện có. Gói VIP vĩnh viễn không có ngày hết hạn, với điều kiện tài khoản tiếp tục tuân thủ các điều khoản này.</p>
    </>,
  },
  {
    title: "Hủy giao dịch và hoàn tiền",
    subtitle: "Cách xử lý giao dịch cần kiểm tra hoặc điều chỉnh",
    content: <>
      <p>Giao dịch chỉ được xem là hoàn tất sau khi hệ thống xác nhận đã thanh toán. Nếu chuyển khoản trùng, sai số tiền, sai nội dung, giao dịch không do bạn thực hiện hoặc quyền VIP chưa được kích hoạt, hãy liên hệ Himi và cung cấp mã đơn cùng biên lai để được đối soát.</p>
      <p>Yêu cầu hủy hoặc hoàn tiền không được xử lý tự động. Mỗi yêu cầu sẽ được xem xét dựa trên trạng thái giao dịch, thời điểm gửi yêu cầu, mức độ sử dụng quyền VIP và quy định pháp luật áp dụng. Việc thay đổi nhu cầu học sau khi quyền VIP đã được kích hoạt không mặc nhiên tạo quyền hoàn tiền, trừ trường hợp pháp luật có quy định khác.</p>
      <p>Nếu giao dịch đủ điều kiện hoàn tiền, Himi sẽ thông báo phương thức và thời gian xử lý qua thông tin liên hệ gắn với tài khoản. Bạn có trách nhiệm cung cấp thông tin chính xác để việc đối soát được thực hiện an toàn.</p>
    </>,
  },
  {
    title: "Sử dụng phù hợp và liên hệ",
    subtitle: "Bảo vệ dịch vụ và tiếp nhận yêu cầu hỗ trợ",
    content: <>
      <p>Bạn không được khai thác lỗi, gửi dữ liệu độc hại, gây gián đoạn dịch vụ, mạo danh người khác, chia sẻ trái phép quyền VIP hoặc sử dụng Himi cho mục đích vi phạm pháp luật. Himi có thể giới hạn hoặc chấm dứt quyền truy cập để bảo vệ hệ thống và cộng đồng người học.</p>
      <p>Himi có thể bảo trì, cập nhật tính năng và điều chỉnh nội dung học tập để nâng cao chất lượng hoặc đáp ứng yêu cầu an toàn, kỹ thuật và pháp lý. Các thay đổi quan trọng đối với điều khoản sẽ được công bố trên website và có hiệu lực từ thời điểm được thông báo.</p>
      <p>Nếu cần hỗ trợ về tài khoản, nội dung hoặc thanh toán, hãy gửi email đến <a href="mailto:giahuy041204@gmail.com">giahuy041204@gmail.com</a>. Khi liên hệ về giao dịch, vui lòng kèm mã đơn và biên lai nhưng không gửi mật khẩu hoặc mã xác thực.</p>
    </>,
  },
];

const principles = [
  { icon: ShieldCheck, title: "Minh bạch", copy: "Thông tin rõ ràng, dễ hiểu, không mập mờ." },
  { icon: Heart, title: "Tôn trọng", copy: "Tôn trọng người học và cộng đồng của chúng tôi." },
  { icon: UsersRound, title: "An toàn", copy: "Bảo vệ dữ liệu và môi trường học tập lành mạnh." },
];

export default function TermsPage() {
  return <main className="terms-page-v3">
    <aside className="terms-story" aria-labelledby="terms-title">
      <header className="terms-story-heading">
        <h1 id="terms-title">Điều khoản sử dụng</h1>
      </header>

      <div className="terms-mascot-wrap" aria-hidden="true">
        <Image
          alt=""
          className="terms-mascot"
          height={800}
          priority
          src="/assets/mascot/himi-v2/himi-cheer.webp"
          unoptimized
          width={800}
        />
      </div>

      <div className="terms-story-copy">
        <h2>Điều khoản rõ ràng để bạn học an tâm</h2>
      </div>

      <ul className="terms-principles" aria-label="Nguyên tắc của Himi">
        {principles.map(({ icon: Icon, title, copy }) => <li key={title}>
          <span className="terms-principle-icon"><Icon aria-hidden="true" size={25} strokeWidth={2.2} /></span>
          <span><strong>{title}</strong><small>{copy}</small></span>
        </li>)}
      </ul>
    </aside>

    <section className="terms-content" aria-label="Nội dung điều khoản sử dụng">
      <header className="terms-content-heading">
        <span>Nội dung điều khoản</span>
      </header>

      <div className="terms-accordion">
        {terms.map((term, index) => <details className="terms-item" key={term.title} open={index === 0}>
          <summary>
            <span className="terms-item-number" aria-hidden="true">{index + 1}</span>
            <span className="terms-item-heading">
              <strong>{term.title}</strong>
              <small>{term.subtitle}</small>
            </span>
            <ChevronDown aria-hidden="true" className="terms-item-chevron" size={24} strokeWidth={2.4} />
          </summary>
          <div className="terms-item-body">
            <div className="terms-item-copy">{term.content}</div>
            {index === terms.length - 1 ? <Link className="terms-support-link" href="mailto:giahuy041204@gmail.com">
              Liên hệ hỗ trợ <ArrowRight aria-hidden="true" size={18} />
            </Link> : null}
          </div>
        </details>)}
      </div>
    </section>
  </main>;
}
