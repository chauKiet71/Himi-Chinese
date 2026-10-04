import type { CourseLessonSeed, CourseModuleSeed } from "./course-seed-types.ts";
import type { DialogueLine, UsageNote, Vocabulary } from "./content-types.ts";
import { industryCourseStats } from "./industry-curriculum-validation.ts";

type WordSource = readonly [
  slug: string,
  hanzi: string,
  pinyin: string,
  meaning: string,
  example: string,
  translation: string,
];

type LineSource = readonly [speaker: string, hanzi: string, pinyin: string, translation: string];
type NoteSource = readonly [title: string, pattern: string, explanation: string];

type TravelLessonSource = {
  slug: string;
  title: string;
  summary: string;
  situation: string;
  words: WordSource[];
  phrases: LineSource[];
  sentences: LineSource[];
  notes: NoteSource[];
};

const moduleSlug = "hanh-trinh-du-lich-tu-tuc";

export const travelModules: CourseModuleSeed[] = [
  {
    slug: moduleSlug,
    title: "Hành trình du lịch tự túc",
    description: "Năm tình huống thiết yếu từ chuẩn bị chuyến đi đến xử lý sự cố khi khám phá Trung Quốc.",
  },
];

const lessonSources: TravelLessonSource[] = [
  {
    slug: "dat-ve-va-chuan-bi-hanh-trinh",
    title: "Đặt vé và chuẩn bị hành trình",
    summary: "Chuẩn bị giấy tờ, đặt vé, sắp xếp hành trình và xử lý thay đổi trước chuyến đi.",
    situation: "Chuẩn bị cho chuyến du lịch tự túc",
    words: [
      ["travel-01-huzhao", "护照", "hùzhào", "hộ chiếu", "出发前，请检查一下护照的有效期。", "Trước khi khởi hành, vui lòng kiểm tra thời hạn của hộ chiếu."],
      ["travel-01-qianzheng", "签证", "qiānzhèng", "thị thực, visa", "我需要提前办理中国签证。", "Tôi cần làm visa Trung Quốc trước."],
      ["travel-01-jipiao", "机票", "jīpiào", "vé máy bay", "我想预订一张去北京的机票。", "Tôi muốn đặt một vé máy bay đi Bắc Kinh."],
      ["travel-01-chepiao", "车票", "chēpiào", "vé tàu, vé xe", "请问，在哪里可以买去上海的车票？", "Xin hỏi, tôi có thể mua vé đi Thượng Hải ở đâu?"],
      ["travel-01-xingcheng", "行程", "xíngchéng", "hành trình, lịch trình", "这是我们这几天的行程。", "Đây là lịch trình của chúng tôi trong mấy ngày tới."],
      ["travel-01-chufa", "出发", "chūfā", "xuất phát, khởi hành", "我们明天早上八点从酒店出发。", "Chúng tôi sẽ xuất phát từ khách sạn lúc 8 giờ sáng mai."],
      ["travel-01-daoda", "到达", "dàodá", "đến nơi", "火车预计下午三点到达上海。", "Tàu dự kiến đến Thượng Hải lúc 3 giờ chiều."],
      ["travel-01-xingli", "行李", "xíngli", "hành lý", "这件行李可以直接托运吗？", "Kiện hành lý này có thể ký gửi trực tiếp không?"],
      ["travel-01-yuding", "预订", "yùdìng", "đặt trước", "我已经在网上预订好酒店了。", "Tôi đã đặt xong khách sạn trên mạng."],
      ["travel-01-quxiao", "取消", "qǔxiāo", "hủy bỏ", "如果计划有变，我可以免费取消吗？", "Nếu kế hoạch thay đổi, tôi có thể hủy miễn phí không?"],
    ],
    phrases: [
      ["Cụm từ", "检查护照", "jiǎnchá hùzhào", "kiểm tra hộ chiếu"],
      ["Cụm từ", "办理签证", "bànlǐ qiānzhèng", "làm thủ tục xin visa"],
      ["Cụm từ", "预订机票", "yùdìng jīpiào", "đặt vé máy bay"],
      ["Cụm từ", "购买车票", "gòumǎi chēpiào", "mua vé tàu, vé xe"],
      ["Cụm từ", "安排行程", "ānpái xíngchéng", "sắp xếp hành trình"],
      ["Cụm từ", "准时出发", "zhǔnshí chūfā", "khởi hành đúng giờ"],
      ["Cụm từ", "按时到达", "ànshí dàodá", "đến nơi đúng giờ"],
      ["Cụm từ", "托运行李", "tuōyùn xíngli", "ký gửi hành lý"],
      ["Cụm từ", "在线预订", "zàixiàn yùdìng", "đặt trước trực tuyến"],
      ["Cụm từ", "免费取消", "miǎnfèi qǔxiāo", "hủy miễn phí"],
    ],
    sentences: [
      ["Du khách", "出发前，请检查一下护照的有效期。", "Chūfā qián, qǐng jiǎnchá yíxià hùzhào de yǒuxiàoqī.", "Trước khi khởi hành, vui lòng kiểm tra thời hạn của hộ chiếu."],
      ["Du khách", "我需要提前办理中国签证。", "Wǒ xūyào tíqián bànlǐ Zhōngguó qiānzhèng.", "Tôi cần làm visa Trung Quốc trước."],
      ["Du khách", "我想预订一张去北京的机票。", "Wǒ xiǎng yùdìng yì zhāng qù Běijīng de jīpiào.", "Tôi muốn đặt một vé máy bay đi Bắc Kinh."],
      ["Du khách", "请问，在哪里可以买去上海的车票？", "Qǐngwèn, zài nǎlǐ kěyǐ mǎi qù Shànghǎi de chēpiào?", "Xin hỏi, tôi có thể mua vé đi Thượng Hải ở đâu?"],
      ["Du khách", "这是我们这几天的行程。", "Zhè shì wǒmen zhè jǐ tiān de xíngchéng.", "Đây là lịch trình của chúng tôi trong mấy ngày tới."],
      ["Du khách", "我们明天早上八点从酒店出发。", "Wǒmen míngtiān zǎoshang bā diǎn cóng jiǔdiàn chūfā.", "Chúng tôi sẽ xuất phát từ khách sạn lúc 8 giờ sáng mai."],
      ["Nhân viên", "火车预计下午三点到达上海。", "Huǒchē yùjì xiàwǔ sān diǎn dàodá Shànghǎi.", "Tàu dự kiến đến Thượng Hải lúc 3 giờ chiều."],
      ["Du khách", "这件行李可以直接托运吗？", "Zhè jiàn xíngli kěyǐ zhíjiē tuōyùn ma?", "Kiện hành lý này có thể ký gửi trực tiếp không?"],
      ["Du khách", "我已经在网上预订好酒店了。", "Wǒ yǐjīng zài wǎngshàng yùdìng hǎo jiǔdiàn le.", "Tôi đã đặt xong khách sạn trên mạng."],
      ["Du khách", "如果计划有变，我可以免费取消吗？", "Rúguǒ jìhuà yǒu biàn, wǒ kěyǐ miǎnfèi qǔxiāo ma?", "Nếu kế hoạch thay đổi, tôi có thể hủy miễn phí không?"],
    ],
    notes: [
      ["Nói mong muốn", "我想 + động từ", "Dùng 我想 trước hành động muốn thực hiện, chẳng hạn đặt vé, đặt phòng hoặc đổi lịch."],
      ["Hỏi khả năng", "可以……吗？", "Mẫu câu lịch sự để hỏi một việc có được phép hoặc có thể thực hiện hay không."],
    ],
  },
  {
    slug: "di-chuyen-tai-san-bay-va-nha-ga",
    title: "Di chuyển tại sân bay và nhà ga",
    summary: "Làm thủ tục, tìm đúng khu vực chờ và xử lý thay đổi khi di chuyển bằng máy bay hoặc tàu.",
    situation: "Làm thủ tục và tìm đường tại điểm trung chuyển",
    words: [
      ["travel-02-hangban", "航班", "hángbān", "chuyến bay", "请问，这个航班几点起飞？", "Xin hỏi, chuyến bay này cất cánh lúc mấy giờ?"],
      ["travel-02-zhiji", "值机", "zhíjī", "làm thủ tục chuyến bay", "我可以在自助机器上办理值机吗？", "Tôi có thể tự làm thủ tục trên máy không?"],
      ["travel-02-dengjipai", "登机牌", "dēngjīpái", "thẻ lên máy bay", "这是您的登机牌，请收好。", "Đây là thẻ lên máy bay của anh/chị, vui lòng giữ cẩn thận."],
      ["travel-02-anjian", "安检", "ānjiǎn", "kiểm tra an ninh", "过安检时需要把电脑拿出来吗？", "Khi qua kiểm tra an ninh có cần lấy máy tính ra không?"],
      ["travel-02-dengjikou", "登机口", "dēngjīkǒu", "cửa lên máy bay", "去广州的航班在哪个登机口？", "Chuyến bay đi Quảng Châu ở cửa lên máy bay nào?"],
      ["travel-02-yanwu", "延误", "yánwù", "chậm, hoãn chuyến", "由于天气原因，航班延误了一个小时。", "Do thời tiết, chuyến bay bị chậm một giờ."],
      ["travel-02-houjishi", "候机室", "hòujīshì", "phòng chờ sân bay", "我们先去候机室等一会儿吧。", "Chúng ta vào phòng chờ đợi một lát trước nhé."],
      ["travel-02-zhantai", "站台", "zhàntái", "sân ga", "请问，去杭州的高铁在几号站台？", "Xin hỏi, tàu cao tốc đi Hàng Châu ở sân ga số mấy?"],
      ["travel-02-jianpiao", "检票", "jiǎnpiào", "kiểm tra vé", "开车前十五分钟开始检票。", "Việc kiểm tra vé bắt đầu 15 phút trước khi tàu chạy."],
      ["travel-02-huancheng", "换乘", "huànchéng", "chuyển tuyến, đổi phương tiện", "到人民广场需要在哪里换乘？", "Muốn đến Quảng trường Nhân Dân thì cần chuyển tuyến ở đâu?"],
    ],
    phrases: [
      ["Cụm từ", "查询航班", "cháxún hángbān", "tra cứu chuyến bay"],
      ["Cụm từ", "办理值机", "bànlǐ zhíjī", "làm thủ tục chuyến bay"],
      ["Cụm từ", "领取登机牌", "lǐngqǔ dēngjīpái", "nhận thẻ lên máy bay"],
      ["Cụm từ", "通过安检", "tōngguò ānjiǎn", "qua cửa kiểm tra an ninh"],
      ["Cụm từ", "寻找登机口", "xúnzhǎo dēngjīkǒu", "tìm cửa lên máy bay"],
      ["Cụm từ", "航班延误", "hángbān yánwù", "chuyến bay bị hoãn"],
      ["Cụm từ", "在候机室等候", "zài hòujīshì děnghòu", "chờ trong phòng chờ sân bay"],
      ["Cụm từ", "确认站台", "quèrèn zhàntái", "xác nhận sân ga"],
      ["Cụm từ", "排队检票", "páiduì jiǎnpiào", "xếp hàng kiểm tra vé"],
      ["Cụm từ", "换乘地铁", "huànchéng dìtiě", "chuyển sang tuyến tàu điện ngầm khác"],
    ],
    sentences: [
      ["Du khách", "请问，这个航班几点起飞？", "Qǐngwèn, zhège hángbān jǐ diǎn qǐfēi?", "Xin hỏi, chuyến bay này cất cánh lúc mấy giờ?"],
      ["Du khách", "我可以在自助机器上办理值机吗？", "Wǒ kěyǐ zài zìzhù jīqì shàng bànlǐ zhíjī ma?", "Tôi có thể tự làm thủ tục trên máy không?"],
      ["Nhân viên", "这是您的登机牌，请收好。", "Zhè shì nín de dēngjīpái, qǐng shōu hǎo.", "Đây là thẻ lên máy bay của anh/chị, vui lòng giữ cẩn thận."],
      ["Du khách", "过安检时需要把电脑拿出来吗？", "Guò ānjiǎn shí xūyào bǎ diànnǎo ná chūlai ma?", "Khi qua kiểm tra an ninh có cần lấy máy tính ra không?"],
      ["Du khách", "去广州的航班在哪个登机口？", "Qù Guǎngzhōu de hángbān zài nǎge dēngjīkǒu?", "Chuyến bay đi Quảng Châu ở cửa lên máy bay nào?"],
      ["Nhân viên", "由于天气原因，航班延误了一个小时。", "Yóuyú tiānqì yuányīn, hángbān yánwù le yí ge xiǎoshí.", "Do thời tiết, chuyến bay bị chậm một giờ."],
      ["Du khách", "我们先去候机室等一会儿吧。", "Wǒmen xiān qù hòujīshì děng yíhuìr ba.", "Chúng ta vào phòng chờ đợi một lát trước nhé."],
      ["Du khách", "请问，去杭州的高铁在几号站台？", "Qǐngwèn, qù Hángzhōu de gāotiě zài jǐ hào zhàntái?", "Xin hỏi, tàu cao tốc đi Hàng Châu ở sân ga số mấy?"],
      ["Nhân viên", "开车前十五分钟开始检票。", "Kāichē qián shíwǔ fēnzhōng kāishǐ jiǎnpiào.", "Việc kiểm tra vé bắt đầu 15 phút trước khi tàu chạy."],
      ["Du khách", "到人民广场需要在哪里换乘？", "Dào Rénmín Guǎngchǎng xūyào zài nǎlǐ huànchéng?", "Muốn đến Quảng trường Nhân Dân thì cần chuyển tuyến ở đâu?"],
    ],
    notes: [
      ["Hỏi vị trí", "……在哪里？", "Dùng để hỏi quầy làm thủ tục, cửa lên máy bay, sân ga hoặc điểm chuyển tuyến."],
      ["Hỏi thời gian", "几点 + động từ？", "Dùng để hỏi giờ cất cánh, giờ tàu chạy hoặc thời điểm bắt đầu kiểm tra vé."],
    ],
  },
  {
    slug: "nhan-phong-va-luu-tru-tai-khach-san",
    title: "Nhận phòng và lưu trú tại khách sạn",
    summary: "Làm thủ tục nhận, trả phòng và yêu cầu khách sạn hỗ trợ những nhu cầu phổ biến.",
    situation: "Nhận phòng và yêu cầu hỗ trợ tại khách sạn",
    words: [
      ["travel-03-qiantai", "前台", "qiántái", "quầy lễ tân", "您好，我想联系一下前台。", "Xin chào, tôi muốn liên hệ với quầy lễ tân."],
      ["travel-03-dingdan", "订单", "dìngdān", "đơn đặt chỗ", "可以帮我确认一下订单吗？", "Có thể giúp tôi xác nhận đơn đặt chỗ không?"],
      ["travel-03-ruzhu", "入住", "rùzhù", "nhận phòng, lưu trú", "我想现在办理入住。", "Tôi muốn làm thủ tục nhận phòng bây giờ."],
      ["travel-03-tuifang", "退房", "tuìfáng", "trả phòng", "请问，明天最晚几点退房？", "Xin hỏi, muộn nhất mấy giờ ngày mai phải trả phòng?"],
      ["travel-03-fangka", "房卡", "fángkǎ", "thẻ phòng", "我把房卡忘在房间里了。", "Tôi để quên thẻ phòng trong phòng rồi."],
      ["travel-03-yajin", "押金", "yājīn", "tiền đặt cọc", "这笔押金什么时候退还？", "Khoản tiền đặt cọc này khi nào được hoàn lại?"],
      ["travel-03-kongtiao", "空调", "kōngtiáo", "điều hòa", "房间里的空调好像坏了。", "Điều hòa trong phòng hình như bị hỏng."],
      ["travel-03-reshui", "热水", "rèshuǐ", "nước nóng", "浴室里没有热水，可以帮我看一下吗？", "Phòng tắm không có nước nóng, có thể giúp tôi kiểm tra không?"],
      ["travel-03-wuxianwangluo", "无线网络", "wúxiàn wǎngluò", "mạng không dây, Wi-Fi", "请问，无线网络的密码是什么？", "Xin hỏi, mật khẩu Wi-Fi là gì?"],
      ["travel-03-dasao", "打扫", "dǎsǎo", "dọn dẹp", "今天下午不用打扫房间，谢谢。", "Chiều nay không cần dọn phòng, cảm ơn."],
    ],
    phrases: [
      ["Cụm từ", "联系前台", "liánxì qiántái", "liên hệ lễ tân"],
      ["Cụm từ", "确认订单", "quèrèn dìngdān", "xác nhận đơn đặt chỗ"],
      ["Cụm từ", "办理入住", "bànlǐ rùzhù", "làm thủ tục nhận phòng"],
      ["Cụm từ", "办理退房", "bànlǐ tuìfáng", "làm thủ tục trả phòng"],
      ["Cụm từ", "领取房卡", "lǐngqǔ fángkǎ", "nhận thẻ phòng"],
      ["Cụm từ", "支付押金", "zhīfù yājīn", "thanh toán tiền đặt cọc"],
      ["Cụm từ", "检查空调", "jiǎnchá kōngtiáo", "kiểm tra điều hòa"],
      ["Cụm từ", "提供热水", "tígōng rèshuǐ", "cung cấp nước nóng"],
      ["Cụm từ", "连接无线网络", "liánjiē wúxiàn wǎngluò", "kết nối Wi-Fi"],
      ["Cụm từ", "打扫房间", "dǎsǎo fángjiān", "dọn phòng"],
    ],
    sentences: [
      ["Du khách", "您好，我想联系一下前台。", "Nín hǎo, wǒ xiǎng liánxì yíxià qiántái.", "Xin chào, tôi muốn liên hệ với quầy lễ tân."],
      ["Du khách", "我在网上订了房，可以帮我确认一下订单吗？", "Wǒ zài wǎngshàng dìng le fáng, kěyǐ bāng wǒ quèrèn yíxià dìngdān ma?", "Tôi đã đặt phòng trên mạng, có thể giúp tôi xác nhận đơn không?"],
      ["Du khách", "我想现在办理入住。", "Wǒ xiǎng xiànzài bànlǐ rùzhù.", "Tôi muốn làm thủ tục nhận phòng bây giờ."],
      ["Du khách", "请问，明天最晚几点退房？", "Qǐngwèn, míngtiān zuìwǎn jǐ diǎn tuìfáng?", "Xin hỏi, muộn nhất mấy giờ ngày mai phải trả phòng?"],
      ["Du khách", "我把房卡忘在房间里了。", "Wǒ bǎ fángkǎ wàng zài fángjiān lǐ le.", "Tôi để quên thẻ phòng trong phòng rồi."],
      ["Du khách", "这笔押金什么时候退还？", "Zhè bǐ yājīn shénme shíhou tuìhuán?", "Khoản tiền đặt cọc này khi nào được hoàn lại?"],
      ["Du khách", "房间里的空调好像坏了。", "Fángjiān lǐ de kōngtiáo hǎoxiàng huài le.", "Điều hòa trong phòng hình như bị hỏng."],
      ["Du khách", "浴室里没有热水，可以帮我看一下吗？", "Yùshì lǐ méiyǒu rèshuǐ, kěyǐ bāng wǒ kàn yíxià ma?", "Phòng tắm không có nước nóng, có thể giúp tôi kiểm tra không?"],
      ["Du khách", "请问，无线网络的密码是什么？", "Qǐngwèn, wúxiàn wǎngluò de mìmǎ shì shénme?", "Xin hỏi, mật khẩu Wi-Fi là gì?"],
      ["Du khách", "今天下午不用打扫房间，谢谢。", "Jīntiān xiàwǔ bú yòng dǎsǎo fángjiān, xièxie.", "Chiều nay không cần dọn phòng, cảm ơn."],
    ],
    notes: [
      ["Báo thiết bị hỏng", "……好像坏了", "Dùng khi chưa chắc nguyên nhân nhưng muốn báo một thiết bị trong phòng có vẻ bị hỏng."],
      ["Nhờ kiểm tra", "可以帮我看一下吗？", "Cách nhờ nhân viên kiểm tra một vấn đề nhẹ nhàng và lịch sự."],
    ],
  },
  {
    slug: "an-uong-mua-sam-va-thanh-toan",
    title: "Ăn uống, mua sắm và thanh toán",
    summary: "Gọi món, thông báo nhu cầu ăn uống, hỏi giá, thử sản phẩm và lựa chọn cách thanh toán.",
    situation: "Ăn tại nhà hàng và mua sắm trong chuyến đi",
    words: [
      ["travel-04-caidan", "菜单", "càidān", "thực đơn", "麻烦给我们看一下菜单。", "Phiền bạn cho chúng tôi xem thực đơn."],
      ["travel-04-diancai", "点菜", "diǎncài", "gọi món", "我们已经选好了，可以点菜了。", "Chúng tôi chọn xong rồi, có thể gọi món."],
      ["travel-04-la", "辣", "là", "cay", "我不能吃辣，这个菜可以不放辣椒吗？", "Tôi không ăn được cay, món này có thể không cho ớt không?"],
      ["travel-04-sushi", "素食", "sùshí", "đồ chay", "请问，这里有素食吗？", "Xin hỏi, ở đây có món chay không?"],
      ["travel-04-guomin", "过敏", "guòmǐn", "dị ứng", "我对花生过敏，这道菜里有花生吗？", "Tôi dị ứng với đậu phộng, món này có đậu phộng không?"],
      ["travel-04-jiezhang", "结账", "jiézhàng", "thanh toán hóa đơn", "服务员，麻烦帮我们结账。", "Nhân viên ơi, phiền bạn tính tiền giúp chúng tôi."],
      ["travel-04-jiage", "价格", "jiàgé", "giá cả", "请问，这件衣服的价格是多少？", "Xin hỏi, chiếc áo này có giá bao nhiêu?"],
      ["travel-04-shichuan", "试穿", "shìchuān", "mặc thử", "我可以试穿这件外套吗？", "Tôi có thể mặc thử chiếc áo khoác này không?"],
      ["travel-04-zhekou", "折扣", "zhékòu", "giảm giá, chiết khấu", "今天所有商品都有折扣吗？", "Hôm nay tất cả sản phẩm đều được giảm giá phải không?"],
      ["travel-04-saoma", "扫码", "sǎomǎ", "quét mã", "我可以用微信扫码支付吗？", "Tôi có thể quét mã WeChat để thanh toán không?"],
    ],
    phrases: [
      ["Cụm từ", "看一下菜单", "kàn yíxià càidān", "xem thực đơn"],
      ["Cụm từ", "开始点菜", "kāishǐ diǎncài", "bắt đầu gọi món"],
      ["Cụm từ", "不要太辣", "bú yào tài là", "không quá cay"],
      ["Cụm từ", "选择素食", "xuǎnzé sùshí", "chọn món chay"],
      ["Cụm từ", "对花生过敏", "duì huāshēng guòmǐn", "dị ứng với đậu phộng"],
      ["Cụm từ", "结账付款", "jiézhàng fùkuǎn", "thanh toán hóa đơn"],
      ["Cụm từ", "询问价格", "xúnwèn jiàgé", "hỏi giá"],
      ["Cụm từ", "试穿衣服", "shìchuān yīfu", "mặc thử quần áo"],
      ["Cụm từ", "享受折扣", "xiǎngshòu zhékòu", "được hưởng giảm giá"],
      ["Cụm từ", "扫码支付", "sǎomǎ zhīfù", "thanh toán bằng cách quét mã"],
    ],
    sentences: [
      ["Du khách", "麻烦给我们看一下菜单。", "Máfan gěi wǒmen kàn yíxià càidān.", "Phiền bạn cho chúng tôi xem thực đơn."],
      ["Du khách", "我们已经选好了，可以点菜了。", "Wǒmen yǐjīng xuǎn hǎo le, kěyǐ diǎncài le.", "Chúng tôi chọn xong rồi, có thể gọi món."],
      ["Du khách", "我不能吃辣，这个菜可以不放辣椒吗？", "Wǒ bù néng chī là, zhège cài kěyǐ bú fàng làjiāo ma?", "Tôi không ăn được cay, món này có thể không cho ớt không?"],
      ["Du khách", "请问，这里有素食吗？", "Qǐngwèn, zhèlǐ yǒu sùshí ma?", "Xin hỏi, ở đây có món chay không?"],
      ["Du khách", "我对花生过敏，这道菜里有花生吗？", "Wǒ duì huāshēng guòmǐn, zhè dào cài lǐ yǒu huāshēng ma?", "Tôi dị ứng với đậu phộng, món này có đậu phộng không?"],
      ["Du khách", "服务员，麻烦帮我们结账。", "Fúwùyuán, máfan bāng wǒmen jiézhàng.", "Nhân viên ơi, phiền bạn tính tiền giúp chúng tôi."],
      ["Du khách", "请问，这件衣服的价格是多少？", "Qǐngwèn, zhè jiàn yīfu de jiàgé shì duōshao?", "Xin hỏi, chiếc áo này có giá bao nhiêu?"],
      ["Du khách", "我可以试穿这件外套吗？", "Wǒ kěyǐ shìchuān zhè jiàn wàitào ma?", "Tôi có thể mặc thử chiếc áo khoác này không?"],
      ["Du khách", "今天所有商品都有折扣吗？", "Jīntiān suǒyǒu shāngpǐn dōu yǒu zhékòu ma?", "Hôm nay tất cả sản phẩm đều được giảm giá phải không?"],
      ["Du khách", "我可以用微信扫码支付吗？", "Wǒ kěyǐ yòng Wēixìn sǎomǎ zhīfù ma?", "Tôi có thể quét mã WeChat để thanh toán không?"],
    ],
    notes: [
      ["Nêu điều không thể ăn", "我不能吃……", "Dùng để nói rõ món, thành phần hoặc mức độ cay mà người nói không thể ăn."],
      ["Hỏi giá", "……的价格是多少？", "Mẫu hỏi giá tương đối đầy đủ; trong giao tiếp nhanh có thể dùng 这个多少钱？"],
    ],
  },
  {
    slug: "hoi-duong-va-xu-ly-tinh-huong-phat-sinh",
    title: "Hỏi đường và xử lý tình huống phát sinh",
    summary: "Hỏi đường, lựa chọn phương tiện và nhờ người khác hỗ trợ khi gặp sự cố trong chuyến đi.",
    situation: "Tìm đường và nhờ trợ giúp khi có sự cố",
    words: [
      ["travel-05-ditu", "地图", "dìtú", "bản đồ", "我们先看一下地图，确认景点的位置。", "Chúng ta xem bản đồ trước để xác nhận vị trí điểm tham quan."],
      ["travel-05-lukou", "路口", "lùkǒu", "giao lộ, ngã đường", "走到前面的路口以后向左转。", "Đi đến giao lộ phía trước rồi rẽ trái."],
      ["travel-05-ditie", "地铁", "dìtiě", "tàu điện ngầm", "请问，去故宫坐地铁方便吗？", "Xin hỏi, đi tàu điện ngầm đến Cố Cung có thuận tiện không?"],
      ["travel-05-chuzuche", "出租车", "chūzūchē", "taxi", "可以帮我叫一辆出租车吗？", "Có thể giúp tôi gọi một chiếc taxi không?"],
      ["travel-05-milu", "迷路", "mílù", "lạc đường", "不好意思，我好像迷路了。", "Xin lỗi, hình như tôi bị lạc đường rồi."],
      ["travel-05-diushi", "丢失", "diūshī", "đánh mất, thất lạc", "我的护照丢失了，应该怎么办？", "Hộ chiếu của tôi bị mất rồi, tôi nên làm thế nào?"],
      ["travel-05-jingcha", "警察", "jǐngchá", "cảnh sát", "附近有警察局吗？", "Gần đây có đồn cảnh sát không?"],
      ["travel-05-yiyuan", "医院", "yīyuàn", "bệnh viện", "请问，最近的医院在哪里？", "Xin hỏi, bệnh viện gần nhất ở đâu?"],
      ["travel-05-bangzhu", "帮助", "bāngzhù", "giúp đỡ", "您能帮助我联系酒店吗？", "Anh/chị có thể giúp tôi liên hệ với khách sạn không?"],
      ["travel-05-jinji", "紧急", "jǐnjí", "khẩn cấp", "如果遇到紧急情况，请马上报警。", "Nếu gặp tình huống khẩn cấp, hãy báo cảnh sát ngay."],
    ],
    phrases: [
      ["Cụm từ", "查看地图", "chákàn dìtú", "xem bản đồ"],
      ["Cụm từ", "走到路口", "zǒu dào lùkǒu", "đi đến giao lộ"],
      ["Cụm từ", "乘坐地铁", "chéngzuò dìtiě", "đi tàu điện ngầm"],
      ["Cụm từ", "叫一辆出租车", "jiào yí liàng chūzūchē", "gọi một chiếc taxi"],
      ["Cụm từ", "不小心迷路", "bù xiǎoxīn mílù", "vô tình bị lạc đường"],
      ["Cụm từ", "丢失护照", "diūshī hùzhào", "làm mất hộ chiếu"],
      ["Cụm từ", "向警察求助", "xiàng jǐngchá qiúzhù", "nhờ cảnh sát giúp đỡ"],
      ["Cụm từ", "寻找附近的医院", "xúnzhǎo fùjìn de yīyuàn", "tìm bệnh viện gần đó"],
      ["Cụm từ", "请求帮助", "qǐngqiú bāngzhù", "yêu cầu giúp đỡ"],
      ["Cụm từ", "紧急情况", "jǐnjí qíngkuàng", "tình huống khẩn cấp"],
    ],
    sentences: [
      ["Du khách", "我们先看一下地图，确认景点的位置。", "Wǒmen xiān kàn yíxià dìtú, quèrèn jǐngdiǎn de wèizhi.", "Chúng ta xem bản đồ trước để xác nhận vị trí điểm tham quan."],
      ["Người dân", "走到前面的路口以后向左转。", "Zǒu dào qiánmiàn de lùkǒu yǐhòu xiàng zuǒ zhuǎn.", "Đi đến giao lộ phía trước rồi rẽ trái."],
      ["Du khách", "请问，去故宫坐地铁方便吗？", "Qǐngwèn, qù Gùgōng zuò dìtiě fāngbiàn ma?", "Xin hỏi, đi tàu điện ngầm đến Cố Cung có thuận tiện không?"],
      ["Du khách", "可以帮我叫一辆出租车吗？", "Kěyǐ bāng wǒ jiào yí liàng chūzūchē ma?", "Có thể giúp tôi gọi một chiếc taxi không?"],
      ["Du khách", "不好意思，我好像迷路了。", "Bù hǎoyìsi, wǒ hǎoxiàng mílù le.", "Xin lỗi, hình như tôi bị lạc đường rồi."],
      ["Du khách", "我的护照丢失了，应该怎么办？", "Wǒ de hùzhào diūshī le, yīnggāi zěnme bàn?", "Hộ chiếu của tôi bị mất rồi, tôi nên làm thế nào?"],
      ["Du khách", "附近有警察局吗？", "Fùjìn yǒu jǐngchájú ma?", "Gần đây có đồn cảnh sát không?"],
      ["Du khách", "请问，最近的医院在哪里？", "Qǐngwèn, zuìjìn de yīyuàn zài nǎlǐ?", "Xin hỏi, bệnh viện gần nhất ở đâu?"],
      ["Du khách", "您能帮助我联系酒店吗？", "Nín néng bāngzhù wǒ liánxì jiǔdiàn ma?", "Anh/chị có thể giúp tôi liên hệ với khách sạn không?"],
      ["Người dân", "如果遇到紧急情况，请马上报警。", "Rúguǒ yùdào jǐnjí qíngkuàng, qǐng mǎshàng bàojǐng.", "Nếu gặp tình huống khẩn cấp, hãy báo cảnh sát ngay."],
    ],
    notes: [
      ["Hỏi đường lịch sự", "请问，……在哪里？", "Đặt 请问 ở đầu câu để hỏi vị trí một cách lịch sự."],
      ["Nhờ người khác", "您能帮助我……吗？", "Mẫu nhờ hỗ trợ phù hợp khi cần liên hệ khách sạn, bệnh viện hoặc cơ quan chức năng."],
    ],
  },
];

function toVocabulary(source: WordSource): Vocabulary {
  const [slug, hanzi, pinyin, meaning, example, translation] = source;
  return { slug, hanzi, pinyin, meaning, example, translation, audioUrl: null };
}

function toLine(source: LineSource): DialogueLine {
  const [speaker, hanzi, pinyin, translation] = source;
  return { speaker, hanzi, pinyin, translation };
}

function toNote(source: NoteSource): UsageNote {
  const [title, pattern, explanation] = source;
  return { title, pattern, explanation };
}

for (const lesson of lessonSources) {
  if (lesson.words.length !== 10 || lesson.phrases.length !== 10 || lesson.sentences.length !== 10) {
    throw new Error(`Travel lesson ${lesson.slug} must contain exactly 10 words, 10 phrases and 10 sentences.`);
  }
  for (const word of lesson.words) {
    if (!word[4].includes(word[1])) throw new Error(`Travel vocabulary example must contain ${word[1]} (${word[0]}).`);
  }
}

export const travelLessons: CourseLessonSeed[] = lessonSources.map((lesson, index) => ({
  moduleSlug,
  slug: lesson.slug,
  title: lesson.title,
  summary: lesson.summary,
  situation: lesson.situation,
  estimatedMinutes: 15,
  isFree: index === 0,
  vocabulary: lesson.words.map(toVocabulary),
  content: {
    phrases: lesson.phrases.map(toLine),
    dialogue: lesson.sentences.map(toLine),
    notes: lesson.notes.map(toNote),
  },
}));

export const travelCourseStats = industryCourseStats({
  courseSlug: "tu-tin-kham-pha-trung-quoc",
  modules: travelModules,
  lessons: travelLessons,
});
