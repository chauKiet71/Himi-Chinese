import type { CourseLessonSeed, CourseModuleSeed } from "./course-seed-types.ts";
import type { IndustryCurriculum } from "./industry-curriculum-validation.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

type VocabularySeed = {
  slug: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
  translation: string;
};

type LessonBlueprint = {
  moduleSlug: string;
  slug: string;
  title: string;
  summary: string;
  situation: string;
  topic: string;
  topicPinyin: string;
  topicTranslation: string;
};

export const hospitalityModules: CourseModuleSeed[] = [
  {
    slug: "dat-phong-va-nhan-khach",
    title: "Đặt phòng & nhận khách",
    description: "Tiếp nhận đặt phòng, xác nhận nhu cầu, báo điều kiện và hỗ trợ khách làm thủ tục nhận phòng.",
  },
  {
    slug: "luu-tru-va-tien-ich",
    title: "Lưu trú & tiện ích",
    description: "Giới thiệu phòng, tiếp nhận yêu cầu dọn phòng, giữ hành lý, gọi xe và đặt dịch vụ trong thời gian lưu trú.",
  },
  {
    slug: "tour-va-diem-den",
    title: "Tour & điểm đến",
    description: "Tư vấn lịch trình, giới thiệu điểm tham quan, xác nhận vé, giờ tập trung và hỗ trợ khách trong chuyến đi.",
  },
  {
    slug: "su-co-va-cham-soc",
    title: "Sự cố & chăm sóc",
    description: "Báo chậm, xử lý thiết bị hỏng, đổi phòng, hỗ trợ sức khỏe và phản hồi phàn nàn một cách bình tĩnh.",
  },
  {
    slug: "tra-phong-va-dieu-phoi-doan",
    title: "Trả phòng & điều phối đoàn",
    description: "Đối chiếu chi phí, hoàn cọc, xin phản hồi, tiễn khách và điều phối đoàn trong các thay đổi phút chót.",
  },
];

const vocabularyByModule: Record<string, VocabularySeed[]> = {
  "dat-phong-va-nhan-khach": [
    { slug: "yuding", hanzi: "预订", pinyin: "yùdìng", meaning: "đặt trước", example: "我想预订一间房。", translation: "Tôi muốn đặt trước một phòng." },
    { slug: "fangjian", hanzi: "房间", pinyin: "fángjiān", meaning: "phòng", example: "这间房很安静。", translation: "Phòng này rất yên tĩnh." },
    { slug: "ruzhu", hanzi: "入住", pinyin: "rùzhù", meaning: "nhận phòng, lưu trú", example: "客人下午三点入住。", translation: "Khách nhận phòng lúc ba giờ chiều." },
    { slug: "tuifang", hanzi: "退房", pinyin: "tuìfáng", meaning: "trả phòng", example: "退房时间是中午十二点。", translation: "Giờ trả phòng là 12 giờ trưa." },
    { slug: "danrenjian", hanzi: "单人间", pinyin: "dānrénjiān", meaning: "phòng đơn", example: "我需要一间单人间。", translation: "Tôi cần một phòng đơn." },
    { slug: "shuangrenjian", hanzi: "双人间", pinyin: "shuāngrénjiān", meaning: "phòng đôi", example: "双人间还有空房。", translation: "Phòng đôi vẫn còn phòng trống." },
    { slug: "huzhao", hanzi: "护照", pinyin: "hùzhào", meaning: "hộ chiếu", example: "请出示您的护照。", translation: "Vui lòng xuất trình hộ chiếu." },
    { slug: "dingdan", hanzi: "订单", pinyin: "dìngdān", meaning: "đơn đặt phòng", example: "我来确认您的订单。", translation: "Tôi sẽ xác nhận đơn đặt phòng của anh/chị." },
    { slug: "fangka", hanzi: "房卡", pinyin: "fángkǎ", meaning: "thẻ phòng", example: "这是您的房卡。", translation: "Đây là thẻ phòng của anh/chị." },
    { slug: "qiantai", hanzi: "前台", pinyin: "qiántái", meaning: "quầy lễ tân", example: "请到前台办理入住。", translation: "Vui lòng đến lễ tân làm thủ tục nhận phòng." },
    { slug: "yajin", hanzi: "押金", pinyin: "yājīn", meaning: "tiền đặt cọc", example: "入住时需要交押金。", translation: "Khi nhận phòng cần đặt cọc." },
    { slug: "baohan", hanzi: "包含", pinyin: "bāohán", meaning: "bao gồm", example: "房价包含早餐。", translation: "Giá phòng bao gồm bữa sáng." },
  ],
  "luu-tru-va-tien-ich": [
    { slug: "sheshi", hanzi: "设施", pinyin: "shèshī", meaning: "cơ sở vật chất, tiện nghi", example: "房间里的设施很齐全。", translation: "Tiện nghi trong phòng rất đầy đủ." },
    { slug: "kongtiao", hanzi: "空调", pinyin: "kōngtiáo", meaning: "điều hòa", example: "空调可以调节温度。", translation: "Điều hòa có thể điều chỉnh nhiệt độ." },
    { slug: "wuxianwangluo", hanzi: "无线网络", pinyin: "wúxiàn wǎngluò", meaning: "mạng Wi-Fi", example: "房间提供免费无线网络。", translation: "Phòng cung cấp Wi-Fi miễn phí." },
    { slug: "kefangfuwu", hanzi: "客房服务", pinyin: "kèfáng fúwù", meaning: "dịch vụ phòng", example: "客房服务二十四小时开放。", translation: "Dịch vụ phòng hoạt động 24 giờ." },
    { slug: "dasao", hanzi: "打扫", pinyin: "dǎsǎo", meaning: "dọn dẹp", example: "请下午再来打扫房间。", translation: "Vui lòng chiều hãy quay lại dọn phòng." },
    { slug: "maojin", hanzi: "毛巾", pinyin: "máojīn", meaning: "khăn", example: "请再送两条毛巾。", translation: "Vui lòng mang thêm hai chiếc khăn." },
    { slug: "xingli", hanzi: "行李", pinyin: "xíngli", meaning: "hành lý", example: "我可以帮您保管行李。", translation: "Tôi có thể giúp anh/chị giữ hành lý." },
    { slug: "baoxianxiang", hanzi: "保险箱", pinyin: "bǎoxiǎnxiāng", meaning: "két an toàn", example: "贵重物品请放进保险箱。", translation: "Vui lòng để đồ quý giá vào két an toàn." },
    { slug: "jiaoche", hanzi: "叫车", pinyin: "jiào chē", meaning: "gọi xe", example: "前台可以帮您叫车。", translation: "Lễ tân có thể giúp anh/chị gọi xe." },
    { slug: "jianshenfang", hanzi: "健身房", pinyin: "jiànshēnfáng", meaning: "phòng tập thể dục", example: "健身房在三楼。", translation: "Phòng tập ở tầng ba." },
    { slug: "xiyifuwu", hanzi: "洗衣服务", pinyin: "xǐyī fúwù", meaning: "dịch vụ giặt là", example: "您需要洗衣服务吗？", translation: "Anh/chị có cần dịch vụ giặt là không?" },
    { slug: "jiaoxingfuwu", hanzi: "叫醒服务", pinyin: "jiàoxǐng fúwù", meaning: "dịch vụ báo thức", example: "我想预约明早的叫醒服务。", translation: "Tôi muốn đặt dịch vụ báo thức sáng mai." },
  ],
  "tour-va-diem-den": [
    { slug: "xingcheng", hanzi: "行程", pinyin: "xíngchéng", meaning: "lịch trình", example: "我们先确认明天的行程。", translation: "Chúng ta xác nhận lịch trình ngày mai trước." },
    { slug: "jingdian", hanzi: "景点", pinyin: "jǐngdiǎn", meaning: "điểm tham quan", example: "这个景点很受欢迎。", translation: "Điểm tham quan này rất được yêu thích." },
    { slug: "daoyou", hanzi: "导游", pinyin: "dǎoyóu", meaning: "hướng dẫn viên", example: "导游会在大厅等您。", translation: "Hướng dẫn viên sẽ chờ anh/chị tại sảnh." },
    { slug: "menpiao", hanzi: "门票", pinyin: "ménpiào", meaning: "vé vào cửa", example: "门票已经包含在团费里。", translation: "Vé đã bao gồm trong phí tour." },
    { slug: "chufa", hanzi: "出发", pinyin: "chūfā", meaning: "khởi hành", example: "旅游团八点准时出发。", translation: "Đoàn du lịch khởi hành đúng 8 giờ." },
    { slug: "jihe", hanzi: "集合", pinyin: "jíhé", meaning: "tập trung", example: "请在酒店门口集合。", translation: "Vui lòng tập trung trước cửa khách sạn." },
    { slug: "ditu", hanzi: "地图", pinyin: "dìtú", meaning: "bản đồ", example: "这张地图标出了路线。", translation: "Bản đồ này đã đánh dấu tuyến đường." },
    { slug: "luxian", hanzi: "路线", pinyin: "lùxiàn", meaning: "tuyến đường", example: "今天的参观路线很轻松。", translation: "Tuyến tham quan hôm nay khá nhẹ nhàng." },
    { slug: "kaifangshijian", hanzi: "开放时间", pinyin: "kāifàng shíjiān", meaning: "giờ mở cửa", example: "请先确认景点的开放时间。", translation: "Vui lòng xác nhận giờ mở cửa của điểm tham quan." },
    { slug: "ziyouhuodong", hanzi: "自由活动", pinyin: "zìyóu huódòng", meaning: "hoạt động tự do", example: "下午有两个小时自由活动。", translation: "Buổi chiều có hai giờ hoạt động tự do." },
    { slug: "jinianpin", hanzi: "纪念品", pinyin: "jìniànpǐn", meaning: "quà lưu niệm", example: "这里可以买到当地纪念品。", translation: "Ở đây có thể mua quà lưu niệm địa phương." },
    { slug: "zoushi", hanzi: "走失", pinyin: "zǒushī", meaning: "đi lạc, lạc đoàn", example: "如果走失，请马上联系导游。", translation: "Nếu bị lạc, hãy liên hệ hướng dẫn viên ngay." },
  ],
  "su-co-va-cham-soc": [
    { slug: "guzhang", hanzi: "故障", pinyin: "gùzhàng", meaning: "sự cố, hỏng hóc", example: "房间的空调出现故障。", translation: "Điều hòa trong phòng gặp sự cố." },
    { slug: "weixiu", hanzi: "维修", pinyin: "wéixiū", meaning: "sửa chữa", example: "工程人员马上来维修。", translation: "Nhân viên kỹ thuật sẽ đến sửa ngay." },
    { slug: "genghuan", hanzi: "更换", pinyin: "gēnghuàn", meaning: "thay đổi, thay thế", example: "我们可以为您更换房间。", translation: "Chúng tôi có thể đổi phòng cho anh/chị." },
    { slug: "tousu", hanzi: "投诉", pinyin: "tóusù", meaning: "phàn nàn, khiếu nại", example: "我来记录您的投诉。", translation: "Tôi sẽ ghi nhận phản ánh của anh/chị." },
    { slug: "daoqian", hanzi: "道歉", pinyin: "dàoqiàn", meaning: "xin lỗi", example: "对这次不便，我们深表道歉。", translation: "Chúng tôi chân thành xin lỗi vì sự bất tiện này." },
    { slug: "jiejue", hanzi: "解决", pinyin: "jiějué", meaning: "giải quyết", example: "我们会尽快解决问题。", translation: "Chúng tôi sẽ giải quyết vấn đề sớm nhất." },
    { slug: "bushufu", hanzi: "不舒服", pinyin: "bù shūfu", meaning: "không khỏe, khó chịu", example: "客人觉得有点不舒服。", translation: "Khách cảm thấy hơi không khỏe." },
    { slug: "yisheng", hanzi: "医生", pinyin: "yīshēng", meaning: "bác sĩ", example: "我们可以帮您联系医生。", translation: "Chúng tôi có thể giúp anh/chị liên hệ bác sĩ." },
    { slug: "yanwu", hanzi: "延误", pinyin: "yánwù", meaning: "chậm, trì hoãn", example: "航班因为天气延误了。", translation: "Chuyến bay bị hoãn do thời tiết." },
    { slug: "quxiao", hanzi: "取消", pinyin: "qǔxiāo", meaning: "hủy bỏ", example: "今天的行程临时取消。", translation: "Lịch trình hôm nay bị hủy đột xuất." },
    { slug: "buchang", hanzi: "补偿", pinyin: "bǔcháng", meaning: "bồi thường, bù đắp", example: "酒店会提供合理的补偿。", translation: "Khách sạn sẽ đưa ra phương án bồi thường hợp lý." },
    { slug: "fuzeren", hanzi: "负责人", pinyin: "fùzérén", meaning: "người phụ trách", example: "负责人正在了解情况。", translation: "Người phụ trách đang tìm hiểu tình hình." },
  ],
  "tra-phong-va-dieu-phoi-doan": [
    { slug: "zhangdan", hanzi: "账单", pinyin: "zhàngdān", meaning: "hóa đơn, bảng kê", example: "请帮我核对一下账单。", translation: "Vui lòng giúp tôi đối chiếu hóa đơn." },
    { slug: "feiyong", hanzi: "费用", pinyin: "fèiyòng", meaning: "chi phí", example: "这项费用是什么？", translation: "Khoản chi phí này là gì?" },
    { slug: "fapiao", hanzi: "发票", pinyin: "fāpiào", meaning: "hóa đơn tài chính", example: "请为我开一张发票。", translation: "Vui lòng xuất cho tôi một hóa đơn." },
    { slug: "tuikuan", hanzi: "退款", pinyin: "tuìkuǎn", meaning: "hoàn tiền", example: "押金会原路退款。", translation: "Tiền cọc sẽ được hoàn lại theo phương thức ban đầu." },
    { slug: "pingjia", hanzi: "评价", pinyin: "píngjià", meaning: "đánh giá", example: "感谢您留下评价。", translation: "Cảm ơn anh/chị đã để lại đánh giá." },
    { slug: "manyi", hanzi: "满意", pinyin: "mǎnyì", meaning: "hài lòng", example: "请问您对住宿满意吗？", translation: "Anh/chị có hài lòng với kỳ lưu trú không?" },
    { slug: "tuandui", hanzi: "团队", pinyin: "tuánduì", meaning: "đội, đoàn khách", example: "这个团队一共有二十位客人。", translation: "Đoàn này có tổng cộng 20 khách." },
    { slug: "mingdan", hanzi: "名单", pinyin: "míngdān", meaning: "danh sách", example: "请核对客人的名单。", translation: "Vui lòng đối chiếu danh sách khách." },
    { slug: "daba", hanzi: "大巴", pinyin: "dàbā", meaning: "xe buýt lớn, xe đoàn", example: "大巴已经在门口等候。", translation: "Xe đoàn đã chờ ở cửa." },
    { slug: "jiaojie", hanzi: "交接", pinyin: "jiāojiē", meaning: "bàn giao", example: "我把团队情况交接给晚班。", translation: "Tôi bàn giao tình hình đoàn cho ca tối." },
    { slug: "linshibiangeng", hanzi: "临时变更", pinyin: "línshí biàngēng", meaning: "thay đổi phút chót", example: "行程有一个临时变更。", translation: "Lịch trình có một thay đổi phút chót." },
    { slug: "songbie", hanzi: "送别", pinyin: "sòngbié", meaning: "tiễn khách", example: "工作人员在大厅送别客人。", translation: "Nhân viên tiễn khách tại sảnh." },
  ],
};

const lessonBlueprints: LessonBlueprint[] = [
  { moduleSlug: "dat-phong-va-nhan-khach", slug: "tiep-nhan-yeu-cau-dat-phong", title: "Tiếp nhận yêu cầu đặt phòng", summary: "Hỏi ngày ở, số khách và nhu cầu cơ bản để bắt đầu một lượt đặt phòng chính xác.", situation: "Khách gọi điện hỏi phòng trống", topic: "预订房间", topicPinyin: "yùdìng fángjiān", topicTranslation: "đặt phòng" },
  { moduleSlug: "dat-phong-va-nhan-khach", slug: "xac-nhan-loai-phong-va-ngay-o", title: "Xác nhận loại phòng và ngày ở", summary: "Làm rõ loại phòng, ngày đến, ngày đi và số đêm trước khi giữ phòng.", situation: "Khách phân vân giữa phòng đơn và phòng đôi", topic: "确认房型和日期", topicPinyin: "quèrèn fángxíng hé rìqī", topicTranslation: "xác nhận loại phòng và ngày ở" },
  { moduleSlug: "dat-phong-va-nhan-khach", slug: "bao-gia-va-dieu-kien-dat-phong", title: "Báo giá và điều kiện đặt phòng", summary: "Giải thích giá phòng, bữa sáng, tiền cọc và điều kiện thay đổi bằng câu ngắn rõ ràng.", situation: "Khách hỏi giá đã bao gồm những gì", topic: "房价和预订条件", topicPinyin: "fángjià hé yùdìng tiáojiàn", topicTranslation: "giá và điều kiện đặt phòng" },
  { moduleSlug: "dat-phong-va-nhan-khach", slug: "thay-doi-hoac-huy-dat-phong", title: "Thay đổi hoặc hủy đặt phòng", summary: "Tìm đúng đơn, xác nhận nội dung cần đổi và thông báo phương án xử lý.", situation: "Khách muốn đổi ngày đến", topic: "修改或取消订单", topicPinyin: "xiūgǎi huò qǔxiāo dìngdān", topicTranslation: "sửa hoặc hủy đơn đặt phòng" },
  { moduleSlug: "dat-phong-va-nhan-khach", slug: "don-khach-tai-sanh", title: "Đón khách tại sảnh", summary: "Chào đón, hỏi nhu cầu và hướng dẫn khách đến đúng quầy hoặc khu vực chờ.", situation: "Khách vừa đến sảnh cùng hành lý", topic: "在大厅迎接客人", topicPinyin: "zài dàtīng yíngjiē kèrén", topicTranslation: "đón khách tại sảnh" },
  { moduleSlug: "dat-phong-va-nhan-khach", slug: "kiem-tra-thong-tin-nhan-phong", title: "Kiểm tra thông tin nhận phòng", summary: "Đối chiếu hộ chiếu, đơn đặt, tiền cọc và giao thẻ phòng cho đúng khách.", situation: "Khách làm thủ tục nhận phòng tại lễ tân", topic: "办理入住手续", topicPinyin: "bànlǐ rùzhù shǒuxù", topicTranslation: "làm thủ tục nhận phòng" },
  { moduleSlug: "luu-tru-va-tien-ich", slug: "huong-dan-phong-va-tien-nghi", title: "Hướng dẫn phòng và tiện nghi", summary: "Giới thiệu vị trí, cách dùng tiện nghi và các dịch vụ quan trọng trong phòng.", situation: "Nhân viên đưa khách lên phòng", topic: "介绍房间设施", topicPinyin: "jièshào fángjiān shèshī", topicTranslation: "giới thiệu tiện nghi phòng" },
  { moduleSlug: "luu-tru-va-tien-ich", slug: "tiep-nhan-yeu-cau-don-phong", title: "Tiếp nhận yêu cầu dọn phòng", summary: "Hỏi thời gian thuận tiện, xác nhận vật dụng cần bổ sung và báo cho bộ phận buồng phòng.", situation: "Khách yêu cầu dọn phòng vào buổi chiều", topic: "安排打扫房间", topicPinyin: "ānpái dǎsǎo fángjiān", topicTranslation: "sắp xếp dọn phòng" },
  { moduleSlug: "luu-tru-va-tien-ich", slug: "giu-hanh-ly-va-do-gia-tri", title: "Giữ hành lý và đồ giá trị", summary: "Hướng dẫn gửi hành lý, dùng két an toàn và nhận lại đồ đúng quy trình giao tiếp.", situation: "Khách muốn gửi hành lý trước giờ nhận phòng", topic: "寄存行李和贵重物品", topicPinyin: "jìcún xíngli hé guìzhòng wùpǐn", topicTranslation: "gửi hành lý và đồ giá trị" },
  { moduleSlug: "luu-tru-va-tien-ich", slug: "goi-xe-va-chi-duong", title: "Gọi xe và chỉ đường", summary: "Hỏi điểm đến, thời gian khởi hành và hướng dẫn khách đón xe tại đúng vị trí.", situation: "Khách cần xe đến ga tàu", topic: "叫车和指路", topicPinyin: "jiào chē hé zhǐlù", topicTranslation: "gọi xe và chỉ đường" },
  { moduleSlug: "luu-tru-va-tien-ich", slug: "dat-dich-vu-khach-san", title: "Đặt dịch vụ khách sạn", summary: "Tiếp nhận yêu cầu giặt là, báo thức, phòng tập và xác nhận thời gian sử dụng.", situation: "Khách muốn đặt nhiều tiện ích trong ngày", topic: "预订酒店服务", topicPinyin: "yùdìng jiǔdiàn fúwù", topicTranslation: "đặt dịch vụ khách sạn" },
  { moduleSlug: "luu-tru-va-tien-ich", slug: "ho-tro-tim-do-that-lac", title: "Hỗ trợ tìm đồ thất lạc", summary: "Hỏi đặc điểm, nơi nhìn thấy lần cuối và hướng dẫn khách liên hệ bộ phận đồ thất lạc.", situation: "Khách không tìm thấy túi nhỏ trong phòng", topic: "寻找遗失物品", topicPinyin: "xúnzhǎo yíshī wùpǐn", topicTranslation: "tìm đồ thất lạc" },
  { moduleSlug: "tour-va-diem-den", slug: "tu-van-lich-trinh-tham-quan", title: "Tư vấn lịch trình tham quan", summary: "Hỏi sở thích và thời gian để gợi ý một lịch trình vừa sức, rõ điểm đến.", situation: "Khách có một ngày trống để tham quan", topic: "安排参观行程", topicPinyin: "ānpái cānguān xíngchéng", topicTranslation: "sắp xếp lịch trình tham quan" },
  { moduleSlug: "tour-va-diem-den", slug: "gioi-thieu-diem-den", title: "Giới thiệu điểm đến", summary: "Mô tả đặc điểm nổi bật, vị trí và thời gian phù hợp để đến một điểm tham quan.", situation: "Khách hỏi nơi ngắm cảnh gần khách sạn", topic: "介绍当地景点", topicPinyin: "jièshào dāngdì jǐngdiǎn", topicTranslation: "giới thiệu điểm đến địa phương" },
  { moduleSlug: "tour-va-diem-den", slug: "mua-ve-va-xac-nhan-gio", title: "Mua vé và xác nhận giờ", summary: "Hỏi số lượng, loại vé, giờ mở cửa và xác nhận thông tin trước khi thanh toán.", situation: "Khách nhờ mua vé điểm tham quan", topic: "购买门票并确认时间", topicPinyin: "gòumǎi ménpiào bìng quèrèn shíjiān", topicTranslation: "mua vé và xác nhận thời gian" },
  { moduleSlug: "tour-va-diem-den", slug: "huong-dan-tap-trung-va-khoi-hanh", title: "Hướng dẫn tập trung và khởi hành", summary: "Thông báo điểm tập trung, giờ có mặt và cách nhận biết đoàn trước khi xuất phát.", situation: "Đoàn chuẩn bị đi tour buổi sáng", topic: "集合和出发", topicPinyin: "jíhé hé chūfā", topicTranslation: "tập trung và khởi hành" },
  { moduleSlug: "tour-va-diem-den", slug: "thuyet-minh-quy-tac-tham-quan", title: "Thuyết minh quy tắc tham quan", summary: "Nói ngắn gọn về tuyến đường, thời gian tự do và các lưu ý tại điểm đến.", situation: "Hướng dẫn viên phổ biến quy tắc trước khi vào điểm", topic: "说明参观规则", topicPinyin: "shuōmíng cānguān guīzé", topicTranslation: "giải thích quy tắc tham quan" },
  { moduleSlug: "tour-va-diem-den", slug: "ho-tro-khach-bi-lac", title: "Hỗ trợ khách bị lạc", summary: "Xác định vị trí, hướng dẫn đứng yên và phối hợp với hướng dẫn viên để đón khách.", situation: "Một khách gọi điện báo đã lạc đoàn", topic: "帮助走失的客人", topicPinyin: "bāngzhù zǒushī de kèrén", topicTranslation: "hỗ trợ khách bị lạc" },
  { moduleSlug: "su-co-va-cham-soc", slug: "phong-chua-san-sang", title: "Phòng chưa sẵn sàng", summary: "Xin lỗi, báo thời gian dự kiến và đề xuất nơi chờ hoặc phương án thay thế.", situation: "Khách đến sớm nhưng phòng chưa dọn xong", topic: "房间还没准备好", topicPinyin: "fángjiān hái méi zhǔnbèi hǎo", topicTranslation: "phòng chưa sẵn sàng" },
  { moduleSlug: "su-co-va-cham-soc", slug: "thiet-bi-phong-gap-su-co", title: "Thiết bị phòng gặp sự cố", summary: "Hỏi biểu hiện, xác nhận mức ảnh hưởng và báo thời gian kỹ thuật đến kiểm tra.", situation: "Khách báo điều hòa không hoạt động", topic: "房间设备故障", topicPinyin: "fángjiān shèbèi gùzhàng", topicTranslation: "thiết bị phòng gặp sự cố" },
  { moduleSlug: "su-co-va-cham-soc", slug: "yeu-cau-doi-phong", title: "Yêu cầu đổi phòng", summary: "Lắng nghe lý do, kiểm tra phòng thay thế và xác nhận việc chuyển hành lý.", situation: "Khách muốn đổi sang phòng yên tĩnh hơn", topic: "客人要求换房", topicPinyin: "kèrén yāoqiú huàn fáng", topicTranslation: "yêu cầu đổi phòng" },
  { moduleSlug: "su-co-va-cham-soc", slug: "ho-tro-khach-khong-khoe", title: "Hỗ trợ khách không khỏe", summary: "Hỏi tình trạng cơ bản, đề nghị hỗ trợ phù hợp và liên hệ người có chuyên môn khi cần.", situation: "Khách cảm thấy chóng mặt tại sảnh", topic: "客人身体不舒服", topicPinyin: "kèrén shēntǐ bù shūfu", topicTranslation: "khách cảm thấy không khỏe" },
  { moduleSlug: "su-co-va-cham-soc", slug: "chuyen-di-bi-hoan", title: "Chuyến đi bị hoãn", summary: "Thông báo nguyên nhân, thời gian cập nhật tiếp theo và phương án hỗ trợ trong lúc chờ.", situation: "Tour bị lùi giờ vì thời tiết", topic: "行程或航班延误", topicPinyin: "xíngchéng huò hángbān yánwù", topicTranslation: "lịch trình hoặc chuyến bay bị hoãn" },
  { moduleSlug: "su-co-va-cham-soc", slug: "tiep-nhan-phan-nan-va-boi-hoan", title: "Tiếp nhận phàn nàn & bồi hoàn", summary: "Ghi nhận vấn đề, xin lỗi đúng mực và chuyển đề xuất bồi hoàn đến người phụ trách.", situation: "Khách không hài lòng về tiếng ồn ban đêm", topic: "处理投诉和补偿", topicPinyin: "chǔlǐ tóusù hé bǔcháng", topicTranslation: "xử lý phàn nàn và bồi hoàn" },
  { moduleSlug: "tra-phong-va-dieu-phoi-doan", slug: "kiem-tra-chi-phi-khi-tra-phong", title: "Kiểm tra chi phí khi trả phòng", summary: "Đọc bảng kê, giải thích từng khoản và sửa sai trước khi khách thanh toán.", situation: "Khách hỏi về một khoản phát sinh", topic: "退房时核对费用", topicPinyin: "tuìfáng shí héduì fèiyòng", topicTranslation: "đối chiếu chi phí khi trả phòng" },
  { moduleSlug: "tra-phong-va-dieu-phoi-doan", slug: "hoan-coc-va-xuat-hoa-don", title: "Hoàn cọc và xuất hóa đơn", summary: "Xác nhận phương thức hoàn cọc, thông tin hóa đơn và thời gian khách nhận chứng từ.", situation: "Khách doanh nghiệp yêu cầu xuất hóa đơn", topic: "退还押金并开发票", topicPinyin: "tuìhuán yājīn bìng kāi fāpiào", topicTranslation: "hoàn cọc và xuất hóa đơn" },
  { moduleSlug: "tra-phong-va-dieu-phoi-doan", slug: "hoi-phan-hoi-va-tam-biet", title: "Hỏi phản hồi & tạm biệt", summary: "Hỏi mức độ hài lòng, tiếp nhận góp ý và kết thúc kỳ lưu trú bằng lời chào thân thiện.", situation: "Khách hoàn tất trả phòng", topic: "征求评价并送别", topicPinyin: "zhēngqiú píngjià bìng sòngbié", topicTranslation: "xin đánh giá và tiễn khách" },
  { moduleSlug: "tra-phong-va-dieu-phoi-doan", slug: "phoi-hop-doan-khach", title: "Phối hợp đoàn khách", summary: "Đối chiếu danh sách, hành lý, phòng và xe để cả đoàn rời khách sạn đúng giờ.", situation: "Một đoàn lớn chuẩn bị trả phòng", topic: "接待团队客人", topicPinyin: "jiēdài tuánduì kèrén", topicTranslation: "phối hợp phục vụ đoàn khách" },
  { moduleSlug: "tra-phong-va-dieu-phoi-doan", slug: "thay-doi-lich-trinh-phut-chot", title: "Thay đổi lịch trình phút chót", summary: "Thông báo thay đổi, xác nhận người đã nhận tin và phối hợp xe cùng phòng theo kế hoạch mới.", situation: "Giờ khởi hành của đoàn thay đổi đột xuất", topic: "处理临时行程变更", topicPinyin: "chǔlǐ línshí xíngchéng biàngēng", topicTranslation: "xử lý thay đổi lịch trình phút chót" },
  { moduleSlug: "tra-phong-va-dieu-phoi-doan", slug: "thuc-hanh-ca-phuc-vu-tron-ven", title: "Thực hành ca phục vụ trọn vẹn", summary: "Kết nối đặt phòng, lưu trú, hỗ trợ tour, xử lý vấn đề và trả phòng trong một ca mô phỏng hoàn chỉnh.", situation: "Nhân viên phụ trách trọn hành trình của một đoàn nhỏ", topic: "完整服务演练", topicPinyin: "wánzhěng fúwù yǎnliàn", topicTranslation: "thực hành một ca phục vụ hoàn chỉnh" },
];

function selectVocabulary(moduleSlug: string, lessonIndex: number) {
  const pool = vocabularyByModule[moduleSlug];
  const offset = (lessonIndex % 6) * 2;
  return Array.from({ length: 6 }, (_, index) => pool[(offset + index) % pool.length]);
}

function buildLesson(blueprint: LessonBlueprint, lessonIndex: number): CourseLessonSeed {
  const selectedVocabulary = selectVocabulary(blueprint.moduleSlug, lessonIndex);
  const vocabulary = selectedVocabulary.map((word) => ({
    ...word,
    slug: `hospitality-${String(lessonIndex + 1).padStart(2, "0")}-${word.slug}`,
    audioUrl: null,
  }));
  const meaningOptions = selectedVocabulary.slice(0, 3).map((word) => word.meaning);

  return {
    moduleSlug: blueprint.moduleSlug,
    slug: blueprint.slug,
    title: blueprint.title,
    summary: blueprint.summary,
    situation: blueprint.situation,
    estimatedMinutes: 11 + (lessonIndex % 4),
    isFree: lessonIndex < 6,
    vocabulary,
    content: {
      dialogue: [
        { speaker: "Khách", hanzi: "您好，请问您现在方便吗？", pinyin: "Nínhǎo, qǐngwèn nín xiànzài fāngbiàn ma?", translation: "Xin chào, bây giờ anh/chị có tiện không?" },
        { speaker: "Nhân viên", hanzi: `您好，我可以帮您${blueprint.topic}。`, pinyin: `Nínhǎo, wǒ kěyǐ bāng nín ${blueprint.topicPinyin}.`, translation: `Xin chào, tôi có thể giúp anh/chị ${blueprint.topicTranslation}.` },
        { speaker: "Khách", hanzi: "好的，请问接下来需要做什么？", pinyin: "Hǎode, qǐngwèn jiēxiàlái xūyào zuò shénme?", translation: "Vâng, xin hỏi tiếp theo tôi cần làm gì?" },
        { speaker: "Nhân viên", hanzi: "我先确认具体情况，然后马上为您处理。", pinyin: "Wǒ xiān quèrèn jùtǐ qíngkuàng, ránhòu mǎshàng wèi nín chǔlǐ.", translation: "Tôi sẽ xác nhận tình hình cụ thể rồi xử lý ngay cho anh/chị." },
      ],
      phrases: [
        { speaker: "Mẫu 1", hanzi: `我想咨询一下${blueprint.topic}。`, pinyin: `Wǒ xiǎng zīxún yíxià ${blueprint.topicPinyin}.`, translation: `Tôi muốn hỏi về việc ${blueprint.topicTranslation}.` },
        { speaker: "Mẫu 2", hanzi: "请您稍等，我马上为您确认。", pinyin: "Qǐng nín shāoděng, wǒ mǎshàng wèi nín quèrèn.", translation: "Anh/chị vui lòng chờ một chút, tôi sẽ xác nhận ngay." },
        { speaker: "Mẫu 3", hanzi: "如果有变化，请及时告诉我。", pinyin: "Rúguǒ yǒu biànhuà, qǐng jíshí gàosu wǒ.", translation: "Nếu có thay đổi, vui lòng báo cho tôi kịp thời." },
        { speaker: "Mẫu 4", hanzi: "问题已经处理好了，谢谢您的理解。", pinyin: "Wèntí yǐjīng chǔlǐ hǎo le, xièxie nín de lǐjiě.", translation: "Vấn đề đã được xử lý xong, cảm ơn anh/chị đã thông cảm." },
      ],
      notes: [
        { title: "Xác nhận trước khi xử lý", pattern: "我先确认……，然后……", explanation: "Dùng mẫu này để khách biết bạn sẽ kiểm tra thông tin trước khi đưa ra phương án." },
        { title: "Giữ giọng lịch sự", pattern: "请您…… / 为您……", explanation: "您 và 为您 tạo sắc thái lịch sự, phù hợp môi trường khách sạn và du lịch." },
      ],
      challenge: {
        title: `Kiểm tra: ${blueprint.title}`,
        description: "Chọn cách hiểu và phản hồi phù hợp với tình huống phục vụ.",
        passScore: 3,
        questions: [
          {
            id: `${blueprint.slug}-situation`,
            prompt: `Trong tình huống “${blueprint.title}”, nhân viên nên làm gì trước?`,
            options: ["Xác nhận nhu cầu và thông tin cụ thể", "Hứa kết quả ngay khi chưa kiểm tra", "Chuyển khách sang bộ phận khác mà không giải thích"],
            correctOption: 0,
            explanation: "Xác nhận đúng nhu cầu giúp tránh xử lý sai và tạo cảm giác chuyên nghiệp.",
          },
          {
            id: `${blueprint.slug}-vocabulary`,
            prompt: `“${selectedVocabulary[0].hanzi}” có nghĩa phù hợp nhất là gì?`,
            options: meaningOptions,
            correctOption: 0,
            explanation: `${selectedVocabulary[0].hanzi} (${selectedVocabulary[0].pinyin}) nghĩa là “${selectedVocabulary[0].meaning}”.`,
          },
          {
            id: `${blueprint.slug}-response`,
            prompt: `Câu nào phù hợp nhất để kết thúc lượt xử lý “${blueprint.title}”?`,
            options: ["问题已经处理好了，谢谢您的理解。", "这不是我的工作。", "你自己再想办法吧。"],
            correctOption: 0,
            explanation: "Câu đầu xác nhận việc đã hoàn tất và cảm ơn khách một cách lịch sự.",
          },
        ],
      },
    },
  };
}

export const hospitalityLessons = lessonBlueprints.map(buildLesson);

export const hospitalityCurriculum: IndustryCurriculum = {
  schemaVersion: 1,
  courseSlug: "khach-san-du-lich",
  category: "Du lịch",
  language: "zh-CN",
  translationLanguage: "vi",
  level: "Cơ bản đến ứng dụng",
  learningDesign: {
    audience: "Người Việt cần giao tiếp tiếng Trung trong khách sạn, tour và dịch vụ du lịch.",
    sequence: ["Từ vựng theo ngữ cảnh", "Câu mẫu phục vụ", "Nghe và nói", "Kiểm tra tình huống"],
    authoredAppliedLessons: 30,
    originalLessonCount: 0,
    audio: "Dùng cơ chế phát âm tiếng Trung hiện có; audioUrl để null cho nội dung mới.",
  },
  modules: hospitalityModules,
  lessons: hospitalityLessons,
};

export const hospitalityCourseStats = industryCourseStats(hospitalityCurriculum);
