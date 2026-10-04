// Generated from lo-trinh-giao-tiep-cong-so-cot-loi.md by scripts/sync-core-workplace-from-markdown.ts.
// Run `npm run content:core-workplace:sync` after editing the authored Markdown.

import type { CourseLessonSeed, CourseModuleSeed } from "./course-seed-types.ts";

export const coreWorkplaceModules: CourseModuleSeed[] = [
  {
    "slug": "giao-tiep-hang-ngay",
    "title": "Giao tiếp hằng ngày",
    "description": "Chào hỏi, giới thiệu, nghe lại, xác nhận ý hiểu và hỏi thông tin cơ bản tại nơi làm việc."
  },
  {
    "slug": "hieu-viec-va-phoi-hop",
    "title": "Hiểu việc và phối hợp",
    "description": "Nhận nhiệm vụ, làm rõ mục tiêu, ưu tiên, phân công, thời hạn và tiêu chuẩn đầu ra."
  },
  {
    "slug": "bao-cao-va-xu-ly-van-de",
    "title": "Báo cáo và xử lý vấn đề",
    "description": "Cập nhật tiến độ, báo trở ngại, xin hỗ trợ, nhận lỗi và đề xuất phương án."
  },
  {
    "slug": "giao-tiep-da-kenh",
    "title": "Giao tiếp đa kênh",
    "description": "Nhắn tin, gọi điện, phát biểu trong họp, phản hồi khác biệt và bàn giao chuyên nghiệp."
  }
];

export const coreWorkplaceLessons: CourseLessonSeed[] = [
  {
    "moduleSlug": "giao-tiep-hang-ngay",
    "slug": "chao-hoi-va-xung-ho-lich-su",
    "title": "Chào hỏi và xưng hô lịch sự",
    "summary": "Thực hành chào hỏi và xưng hô lịch sự bằng tiếng Trung trong môi trường công sở.",
    "situation": "Gặp một người mới tại nơi làm việc",
    "estimatedMinutes": 11,
    "isFree": true,
    "vocabulary": [
      {
        "slug": "core-l01-ninhao",
        "hanzi": "您好",
        "pinyin": "nín hǎo",
        "meaning": "xin chào",
        "example": "本课的重点词语是“您好”。",
        "translation": "Từ trọng tâm của bài này là “xin chào”.",
        "audioUrl": null
      },
      {
        "slug": "core-01-02",
        "hanzi": "早上好",
        "pinyin": "zǎo shàng hǎo",
        "meaning": "chào buổi sáng",
        "example": "请礼貌说早上好。",
        "translation": "Vui lòng chào buổi sáng lịch sự.",
        "audioUrl": null
      },
      {
        "slug": "core-l01-chenghu",
        "hanzi": "称呼",
        "pinyin": "chēng hū",
        "meaning": "cách xưng hô",
        "example": "我会使用合适称呼。",
        "translation": "Tôi sẽ dùng cách xưng hô phù hợp.",
        "audioUrl": null
      },
      {
        "slug": "core-l01-tongshi",
        "hanzi": "同事",
        "pinyin": "tóng shì",
        "meaning": "đồng nghiệp",
        "example": "我们先向同事问好。",
        "translation": "Trước tiên, chúng ta chào đồng nghiệp.",
        "audioUrl": null
      },
      {
        "slug": "core-01-05",
        "hanzi": "经理",
        "pinyin": "jīng lǐ",
        "meaning": "quản lý",
        "example": "我们正在称呼部门经理。",
        "translation": "Chúng tôi đang xưng hô với quản lý bộ phận.",
        "audioUrl": null
      },
      {
        "slug": "core-01-06",
        "hanzi": "老师",
        "pinyin": "lǎo shī",
        "meaning": "anh chị tiền bối",
        "example": "请确认是否已经请教公司老师。",
        "translation": "Vui lòng xác nhận đã hỏi anh chị có kinh nghiệm trong công ty chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-01-07",
        "hanzi": "先生",
        "pinyin": "xiān shēng",
        "meaning": "ông anh",
        "example": "今天要称呼王先生。",
        "translation": "Hôm nay cần gọi anh Vương.",
        "audioUrl": null
      },
      {
        "slug": "core-01-08",
        "hanzi": "女士",
        "pinyin": "nǚ shì",
        "meaning": "bà chị",
        "example": "可以马上称呼李女士吗？",
        "translation": "Có thể gọi chị Lý ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-01-09",
        "hanzi": "辛苦了",
        "pinyin": "xīn kǔ le",
        "meaning": "đã vất vả rồi",
        "example": "本课的重点词语是“辛苦了”。",
        "translation": "Từ trọng tâm của bài này là “đã vất vả rồi”.",
        "audioUrl": null
      },
      {
        "slug": "core-01-10",
        "hanzi": "再见",
        "pinyin": "zài jiàn",
        "meaning": "tạm biệt",
        "example": "请及时下班前说再见。",
        "translation": "Vui lòng chào tạm biệt trước khi tan làm kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先向同事问好。",
          "pinyin": "Wǒ men xiān xiàng tóng shì wèn hǎo.",
          "translation": "Trước tiên, chúng ta chào đồng nghiệp."
        },
        {
          "speaker": "B",
          "hanzi": "请礼貌说早上好。",
          "pinyin": "Qǐng lǐ mào shuō zǎo shàng hǎo.",
          "translation": "Vui lòng chào buổi sáng lịch sự."
        },
        {
          "speaker": "A",
          "hanzi": "我会使用合适称呼。",
          "pinyin": "Wǒ huì shǐ yòng hé shì chēng hū.",
          "translation": "Tôi sẽ dùng cách xưng hô phù hợp."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要问候新同事。",
          "pinyin": "Xiàn zài xū yào wèn hòu xīn tóng shì.",
          "translation": "Bây giờ cần chào đồng nghiệp mới."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在称呼部门经理。",
          "pinyin": "Wǒ men zhèng zài chēng hū bù mén jīng lǐ.",
          "translation": "Chúng tôi đang xưng hô với quản lý bộ phận."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经请教公司老师。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng qǐng jiào gōng sī lǎo shī.",
          "translation": "Vui lòng xác nhận đã hỏi anh chị có kinh nghiệm trong công ty chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要称呼王先生。",
          "pinyin": "Jīn tiān yào chēng hū wáng xiān shēng.",
          "translation": "Hôm nay cần gọi anh Vương."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上称呼李女士吗？",
          "pinyin": "Kě yǐ mǎ shàng chēng hū lǐ nǚ shì ma?",
          "translation": "Có thể gọi chị Lý ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成感谢大家辛苦工作后请通知我。",
          "pinyin": "Wán chéng gǎn xiè dà jiā xīn kǔ gōng zuò hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc cảm ơn mọi người đã làm việc vất vả, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时下班前说再见。",
          "pinyin": "Qǐng jí shí xià bān qián shuō zài jiàn.",
          "translation": "Vui lòng chào tạm biệt trước khi tan làm kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "向同事问好",
          "pinyin": "xiàng tóng shì wèn hǎo",
          "translation": "chào đồng nghiệp"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "礼貌说早上好",
          "pinyin": "lǐ mào shuō zǎo shàng hǎo",
          "translation": "chào buổi sáng lịch sự"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "使用合适称呼",
          "pinyin": "shǐ yòng hé shì chēng hū",
          "translation": "dùng cách xưng hô phù hợp"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "问候新同事",
          "pinyin": "wèn hòu xīn tóng shì",
          "translation": "chào đồng nghiệp mới"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "称呼部门经理",
          "pinyin": "chēng hū bù mén jīng lǐ",
          "translation": "xưng hô với quản lý bộ phận"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "请教公司老师",
          "pinyin": "qǐng jiào gōng sī lǎo shī",
          "translation": "hỏi anh chị có kinh nghiệm trong công ty"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "称呼王先生",
          "pinyin": "chēng hū wáng xiān shēng",
          "translation": "gọi anh Vương"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "称呼李女士",
          "pinyin": "chēng hū lǐ nǚ shì",
          "translation": "gọi chị Lý"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "感谢大家辛苦工作",
          "pinyin": "gǎn xiè dà jiā xīn kǔ gōng zuò",
          "translation": "cảm ơn mọi người đã làm việc vất vả"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "下班前说再见",
          "pinyin": "xià bān qián shuō zài jiàn",
          "translation": "chào tạm biệt trước khi tan làm"
        }
      ],
      "notes": [
        {
          "title": "您 và 你",
          "pattern": "您好 / 你好",
          "explanation": "您 lịch sự hơn; dùng với khách, người lớn tuổi hoặc người chưa thân."
        },
        {
          "title": "Lời xã giao khi mới gặp",
          "pattern": "初次见面，请多关照",
          "explanation": "Câu này thể hiện thiện chí học hỏi, không phải yêu cầu giúp đỡ cụ thể."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-hang-ngay",
    "slug": "gioi-thieu-ten-vai-tro-va-bo-phan",
    "title": "Giới thiệu tên, vai trò và bộ phận",
    "summary": "Thực hành giới thiệu tên, vai trò và bộ phận bằng tiếng Trung trong môi trường công sở.",
    "situation": "Tham gia một nhóm phối hợp mới",
    "estimatedMinutes": 12,
    "isFree": true,
    "vocabulary": [
      {
        "slug": "core-l02-xingming",
        "hanzi": "姓名",
        "pinyin": "xìng míng",
        "meaning": "họ tên",
        "example": "我们先介绍自己的姓名。",
        "translation": "Trước tiên, chúng ta giới thiệu họ tên của mình.",
        "audioUrl": null
      },
      {
        "slug": "core-02-02",
        "hanzi": "名字",
        "pinyin": "míng zì",
        "meaning": "tên",
        "example": "请询问对方名字。",
        "translation": "Vui lòng hỏi tên đối phương.",
        "audioUrl": null
      },
      {
        "slug": "core-l02-bumen",
        "hanzi": "部门",
        "pinyin": "bù mén",
        "meaning": "bộ phận",
        "example": "我会说明所属部门。",
        "translation": "Tôi sẽ nêu bộ phận trực thuộc.",
        "audioUrl": null
      },
      {
        "slug": "core-l02-zhiwei",
        "hanzi": "职位",
        "pinyin": "zhí wèi",
        "meaning": "chức vụ",
        "example": "现在需要介绍目前职位。",
        "translation": "Bây giờ cần giới thiệu chức vụ hiện tại.",
        "audioUrl": null
      },
      {
        "slug": "core-l02-fuze",
        "hanzi": "负责",
        "pinyin": "fù zé",
        "meaning": "phụ trách",
        "example": "我们正在说明负责事项。",
        "translation": "Chúng tôi đang nêu công việc phụ trách.",
        "audioUrl": null
      },
      {
        "slug": "core-02-06",
        "hanzi": "同组",
        "pinyin": "tóng zǔ",
        "meaning": "cùng nhóm",
        "example": "请确认是否已经认识同组成员。",
        "translation": "Vui lòng xác nhận đã làm quen thành viên cùng nhóm chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-02-07",
        "hanzi": "新人",
        "pinyin": "xīn rén",
        "meaning": "nhân viên mới",
        "example": "本课的重点词语是“新人”。",
        "translation": "Từ trọng tâm của bài này là “nhân viên mới”.",
        "audioUrl": null
      },
      {
        "slug": "core-02-08",
        "hanzi": "主管",
        "pinyin": "zhǔ guǎn",
        "meaning": "quản lý trực tiếp",
        "example": "可以马上确认直属主管吗？",
        "translation": "Có thể xác nhận quản lý trực tiếp ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-02-09",
        "hanzi": "合作",
        "pinyin": "hé zuò",
        "meaning": "phối hợp",
        "example": "完成介绍合作关系后请通知我。",
        "translation": "Sau khi hoàn thành việc giới thiệu quan hệ phối hợp, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-02-10",
        "hanzi": "名片",
        "pinyin": "míng piàn",
        "meaning": "danh thiếp",
        "example": "请及时交换工作名片。",
        "translation": "Vui lòng trao đổi danh thiếp công việc kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先介绍自己的姓名。",
          "pinyin": "Wǒ men xiān jiè shào zì jǐ de xìng míng.",
          "translation": "Trước tiên, chúng ta giới thiệu họ tên của mình."
        },
        {
          "speaker": "B",
          "hanzi": "请询问对方名字。",
          "pinyin": "Qǐng xún wèn duì fāng míng zì.",
          "translation": "Vui lòng hỏi tên đối phương."
        },
        {
          "speaker": "A",
          "hanzi": "我会说明所属部门。",
          "pinyin": "Wǒ huì shuō míng suǒ shǔ bù mén.",
          "translation": "Tôi sẽ nêu bộ phận trực thuộc."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要介绍目前职位。",
          "pinyin": "Xiàn zài xū yào jiè shào mù qián zhí wèi.",
          "translation": "Bây giờ cần giới thiệu chức vụ hiện tại."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在说明负责事项。",
          "pinyin": "Wǒ men zhèng zài shuō míng fù zé shì xiàng.",
          "translation": "Chúng tôi đang nêu công việc phụ trách."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经认识同组成员。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng rèn shí tóng zǔ chéng yuán.",
          "translation": "Vui lòng xác nhận đã làm quen thành viên cùng nhóm chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要介绍新入职员工。",
          "pinyin": "Jīn tiān yào jiè shào xīn rù zhí yuán gōng.",
          "translation": "Hôm nay cần giới thiệu nhân viên mới."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上确认直属主管吗？",
          "pinyin": "Kě yǐ mǎ shàng què rèn zhí shǔ zhǔ guǎn ma?",
          "translation": "Có thể xác nhận quản lý trực tiếp ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成介绍合作关系后请通知我。",
          "pinyin": "Wán chéng jiè shào hé zuò guān xì hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc giới thiệu quan hệ phối hợp, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时交换工作名片。",
          "pinyin": "Qǐng jí shí jiāo huàn gōng zuò míng piàn.",
          "translation": "Vui lòng trao đổi danh thiếp công việc kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "介绍自己的姓名",
          "pinyin": "jiè shào zì jǐ de xìng míng",
          "translation": "giới thiệu họ tên của mình"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "询问对方名字",
          "pinyin": "xún wèn duì fāng míng zì",
          "translation": "hỏi tên đối phương"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "说明所属部门",
          "pinyin": "shuō míng suǒ shǔ bù mén",
          "translation": "nêu bộ phận trực thuộc"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "介绍目前职位",
          "pinyin": "jiè shào mù qián zhí wèi",
          "translation": "giới thiệu chức vụ hiện tại"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "说明负责事项",
          "pinyin": "shuō míng fù zé shì xiàng",
          "translation": "nêu công việc phụ trách"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "认识同组成员",
          "pinyin": "rèn shí tóng zǔ chéng yuán",
          "translation": "làm quen thành viên cùng nhóm"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "介绍新入职员工",
          "pinyin": "jiè shào xīn rù zhí yuán gōng",
          "translation": "giới thiệu nhân viên mới"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "确认直属主管",
          "pinyin": "què rèn zhí shǔ zhǔ guǎn",
          "translation": "xác nhận quản lý trực tiếp"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "介绍合作关系",
          "pinyin": "jiè shào hé zuò guān xì",
          "translation": "giới thiệu quan hệ phối hợp"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "交换工作名片",
          "pinyin": "jiāo huàn gōng zuò míng piàn",
          "translation": "trao đổi danh thiếp công việc"
        }
      ],
      "notes": [
        {
          "title": "Giới thiệu ba phần",
          "pattern": "我是…… / 我在…… / 我负责……",
          "explanation": "Ba mẫu lần lượt nêu danh tính, nơi làm việc và trách nhiệm."
        },
        {
          "title": "Giữ phần giới thiệu ngắn",
          "pattern": "简单介绍一下",
          "explanation": "Chọn thông tin liên quan trực tiếp đến nhóm đang phối hợp."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-hang-ngay",
    "slug": "xin-nhac-lai-va-noi-cham-hon",
    "title": "Xin nhắc lại và nói chậm hơn",
    "summary": "Thực hành xin nhắc lại và nói chậm hơn bằng tiếng Trung trong môi trường công sở.",
    "situation": "Trao đổi trong môi trường nhiều tiếng ồn",
    "estimatedMinutes": 12,
    "isFree": true,
    "vocabulary": [
      {
        "slug": "core-03-01",
        "hanzi": "重复",
        "pinyin": "chóng fù",
        "meaning": "lặp lại",
        "example": "我们先请对方重复一遍。",
        "translation": "Trước tiên, chúng ta nhờ đối phương lặp lại một lần.",
        "audioUrl": null
      },
      {
        "slug": "core-03-02",
        "hanzi": "慢",
        "pinyin": "màn",
        "meaning": "nói chậm",
        "example": "请请说慢一点。",
        "translation": "Vui lòng đề nghị nói chậm hơn.",
        "audioUrl": null
      },
      {
        "slug": "core-l03-tingqing",
        "hanzi": "听清",
        "pinyin": "tīng qīng",
        "meaning": "nghe rõ",
        "example": "我会确认是否听清。",
        "translation": "Tôi sẽ xác nhận có nghe rõ không.",
        "audioUrl": null
      },
      {
        "slug": "core-l03-meitingdong",
        "hanzi": "没听懂",
        "pinyin": "méi tīng dǒng",
        "meaning": "chưa hiểu",
        "example": "现在需要说明自己没听懂。",
        "translation": "Bây giờ cần nói rằng mình chưa hiểu.",
        "audioUrl": null
      },
      {
        "slug": "core-03-05",
        "hanzi": "再说",
        "pinyin": "zài shuō",
        "meaning": "lại nói",
        "example": "我们正在请再说一次。",
        "translation": "Chúng tôi đang nhờ nói lại một lần.",
        "audioUrl": null
      },
      {
        "slug": "core-03-06",
        "hanzi": "语速",
        "pinyin": "yǔ sù",
        "meaning": "tốc độ nói",
        "example": "请确认是否已经放慢说话语速。",
        "translation": "Vui lòng xác nhận đã giảm tốc độ nói chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-l03-shengyin",
        "hanzi": "声音",
        "pinyin": "shēng yīn",
        "meaning": "âm thanh",
        "example": "今天要调大通话声音。",
        "translation": "Hôm nay cần tăng âm lượng cuộc gọi.",
        "audioUrl": null
      },
      {
        "slug": "core-l03-qingchu",
        "hanzi": "清楚",
        "pinyin": "qīng chǔ",
        "meaning": "rõ ràng",
        "example": "可以马上表达得更清楚吗？",
        "translation": "Có thể diễn đạt rõ ràng hơn ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-03-09",
        "hanzi": "关键词",
        "pinyin": "guān jiàn cí",
        "meaning": "từ khóa",
        "example": "完成重复重要关键词后请通知我。",
        "translation": "Sau khi hoàn thành việc lặp lại từ khóa quan trọng, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-03-10",
        "hanzi": "记录",
        "pinyin": "jì lù",
        "meaning": "ghi chép",
        "example": "请及时边听边做记录。",
        "translation": "Vui lòng vừa nghe vừa ghi chép kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先请对方重复一遍。",
          "pinyin": "Wǒ men xiān qǐng duì fāng chóng fù yī biàn.",
          "translation": "Trước tiên, chúng ta nhờ đối phương lặp lại một lần."
        },
        {
          "speaker": "B",
          "hanzi": "请请说慢一点。",
          "pinyin": "Qǐng qǐng shuō màn yì diǎn.",
          "translation": "Vui lòng đề nghị nói chậm hơn."
        },
        {
          "speaker": "A",
          "hanzi": "我会确认是否听清。",
          "pinyin": "Wǒ huì què rèn shì fǒu tīng qīng.",
          "translation": "Tôi sẽ xác nhận có nghe rõ không."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要说明自己没听懂。",
          "pinyin": "Xiàn zài xū yào shuō míng zì jǐ méi tīng dǒng.",
          "translation": "Bây giờ cần nói rằng mình chưa hiểu."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在请再说一次。",
          "pinyin": "Wǒ men zhèng zài qǐng zài shuō yī cì.",
          "translation": "Chúng tôi đang nhờ nói lại một lần."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经放慢说话语速。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng fàng màn shuō huà yǔ sù.",
          "translation": "Vui lòng xác nhận đã giảm tốc độ nói chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要调大通话声音。",
          "pinyin": "Jīn tiān yào diào dà tōng huà shēng yīn.",
          "translation": "Hôm nay cần tăng âm lượng cuộc gọi."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上表达得更清楚吗？",
          "pinyin": "Kě yǐ mǎ shàng biǎo dá dé gèng qīng chǔ ma?",
          "translation": "Có thể diễn đạt rõ ràng hơn ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成重复重要关键词后请通知我。",
          "pinyin": "Wán chéng chóng fù zhòng yào guān jiàn cí hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc lặp lại từ khóa quan trọng, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时边听边做记录。",
          "pinyin": "Qǐng jí shí biān tīng biān zuò jì lù.",
          "translation": "Vui lòng vừa nghe vừa ghi chép kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "请对方重复一遍",
          "pinyin": "qǐng duì fāng chóng fù yī biàn",
          "translation": "nhờ đối phương lặp lại một lần"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "请说慢一点",
          "pinyin": "qǐng shuō màn yì diǎn",
          "translation": "đề nghị nói chậm hơn"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "确认是否听清",
          "pinyin": "què rèn shì fǒu tīng qīng",
          "translation": "xác nhận có nghe rõ không"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "说明自己没听懂",
          "pinyin": "shuō míng zì jǐ méi tīng dǒng",
          "translation": "nói rằng mình chưa hiểu"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "请再说一次",
          "pinyin": "qǐng zài shuō yī cì",
          "translation": "nhờ nói lại một lần"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "放慢说话语速",
          "pinyin": "fàng màn shuō huà yǔ sù",
          "translation": "giảm tốc độ nói"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "调大通话声音",
          "pinyin": "diào dà tōng huà shēng yīn",
          "translation": "tăng âm lượng cuộc gọi"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "表达得更清楚",
          "pinyin": "biǎo dá dé gèng qīng chǔ",
          "translation": "diễn đạt rõ ràng hơn"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "重复重要关键词",
          "pinyin": "chóng fù zhòng yào guān jiàn cí",
          "translation": "lặp lại từ khóa quan trọng"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "边听边做记录",
          "pinyin": "biān tīng biān zuò jì lù",
          "translation": "vừa nghe vừa ghi chép"
        }
      ],
      "notes": [
        {
          "title": "Xin lặp lại lịch sự",
          "pattern": "不好意思，请再说一遍",
          "explanation": "不好意思 làm mềm yêu cầu và cho biết bạn đang cố theo kịp trao đổi."
        },
        {
          "title": "Nghe rõ khác hiểu rõ",
          "pattern": "没听清 / 没听懂",
          "explanation": "没听清 là không nghe rõ âm thanh; 没听懂 là nghe được nhưng chưa hiểu nghĩa."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-hang-ngay",
    "slug": "noi-lai-y-hieu-de-xac-nhan",
    "title": "Nói lại ý hiểu để xác nhận",
    "summary": "Thực hành nói lại ý hiểu để xác nhận bằng tiếng Trung trong môi trường công sở.",
    "situation": "Nhận một hướng dẫn bằng lời",
    "estimatedMinutes": 13,
    "isFree": true,
    "vocabulary": [
      {
        "slug": "core-l04-lijie",
        "hanzi": "理解",
        "pinyin": "lǐ jiě",
        "meaning": "hiểu",
        "example": "我们先说明自己的理解。",
        "translation": "Trước tiên, chúng ta nói lại cách hiểu của mình.",
        "audioUrl": null
      },
      {
        "slug": "core-l04-queren",
        "hanzi": "确认",
        "pinyin": "què rèn",
        "meaning": "xác nhận",
        "example": "请确认理解是否正确。",
        "translation": "Vui lòng xác nhận cách hiểu có đúng không.",
        "audioUrl": null
      },
      {
        "slug": "core-l04-yisi",
        "hanzi": "意思",
        "pinyin": "yì si",
        "meaning": "ý nghĩa",
        "example": "我会复述对方意思。",
        "translation": "Tôi sẽ nhắc lại ý của đối phương.",
        "audioUrl": null
      },
      {
        "slug": "core-l04-yibian",
        "hanzi": "也就是说",
        "pinyin": "yě jiù shì shuō",
        "meaning": "nói cách khác",
        "example": "现在需要用也就是说总结。",
        "translation": "Bây giờ cần tóm tắt bằng cách nói khác.",
        "audioUrl": null
      },
      {
        "slug": "core-04-05",
        "hanzi": "换句话说",
        "pinyin": "huàn jù huà shuō",
        "meaning": "nói theo cách khác",
        "example": "我们正在换句话说明任务。",
        "translation": "Chúng tôi đang nói lại nhiệm vụ theo cách khác.",
        "audioUrl": null
      },
      {
        "slug": "core-04-06",
        "hanzi": "重点",
        "pinyin": "zhòng diǎn",
        "meaning": "trọng điểm",
        "example": "请确认是否已经确认工作重点。",
        "translation": "Vui lòng xác nhận đã xác nhận trọng điểm công việc chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-04-07",
        "hanzi": "步骤",
        "pinyin": "bù zhòu",
        "meaning": "các bước",
        "example": "今天要复述执行步骤。",
        "translation": "Hôm nay cần nhắc lại các bước thực hiện.",
        "audioUrl": null
      },
      {
        "slug": "core-04-08",
        "hanzi": "结果",
        "pinyin": "jié guǒ",
        "meaning": "kết quả",
        "example": "可以马上确认预期结果吗？",
        "translation": "Có thể xác nhận kết quả mong đợi ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-04-09",
        "hanzi": "一致",
        "pinyin": "yí zhì",
        "meaning": "thống nhất",
        "example": "完成确保双方理解一致后请通知我。",
        "translation": "Sau khi hoàn thành việc bảo đảm hai bên hiểu thống nhất, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-04-10",
        "hanzi": "纠正",
        "pinyin": "jiū zhèng",
        "meaning": "sửa lại",
        "example": "请及时请对方及时纠正。",
        "translation": "Vui lòng đề nghị đối phương sửa ngay kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先说明自己的理解。",
          "pinyin": "Wǒ men xiān shuō míng zì jǐ de lǐ jiě.",
          "translation": "Trước tiên, chúng ta nói lại cách hiểu của mình."
        },
        {
          "speaker": "B",
          "hanzi": "请确认理解是否正确。",
          "pinyin": "Qǐng què rèn lǐ jiě shì fǒu zhèng què.",
          "translation": "Vui lòng xác nhận cách hiểu có đúng không."
        },
        {
          "speaker": "A",
          "hanzi": "我会复述对方意思。",
          "pinyin": "Wǒ huì fù shù duì fāng yì si.",
          "translation": "Tôi sẽ nhắc lại ý của đối phương."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要用也就是说总结。",
          "pinyin": "Xiàn zài xū yào yòng yě jiù shì shuō zǒng jié.",
          "translation": "Bây giờ cần tóm tắt bằng cách nói khác."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在换句话说明任务。",
          "pinyin": "Wǒ men zhèng zài huàn jù huà shuō míng rèn wù.",
          "translation": "Chúng tôi đang nói lại nhiệm vụ theo cách khác."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经确认工作重点。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng què rèn gōng zuò zhòng diǎn.",
          "translation": "Vui lòng xác nhận đã xác nhận trọng điểm công việc chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要复述执行步骤。",
          "pinyin": "Jīn tiān yào fù shù zhí xíng bù zhòu.",
          "translation": "Hôm nay cần nhắc lại các bước thực hiện."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上确认预期结果吗？",
          "pinyin": "Kě yǐ mǎ shàng què rèn yù qī jié guǒ ma?",
          "translation": "Có thể xác nhận kết quả mong đợi ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成确保双方理解一致后请通知我。",
          "pinyin": "Wán chéng què bǎo shuāng fāng lǐ jiě yí zhì hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc bảo đảm hai bên hiểu thống nhất, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时请对方及时纠正。",
          "pinyin": "Qǐng jí shí qǐng duì fāng jí shí jiū zhèng.",
          "translation": "Vui lòng đề nghị đối phương sửa ngay kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "说明自己的理解",
          "pinyin": "shuō míng zì jǐ de lǐ jiě",
          "translation": "nói lại cách hiểu của mình"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "确认理解是否正确",
          "pinyin": "què rèn lǐ jiě shì fǒu zhèng què",
          "translation": "xác nhận cách hiểu có đúng không"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "复述对方意思",
          "pinyin": "fù shù duì fāng yì si",
          "translation": "nhắc lại ý của đối phương"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "用也就是说总结",
          "pinyin": "yòng yě jiù shì shuō zǒng jié",
          "translation": "tóm tắt bằng cách nói khác"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "换句话说明任务",
          "pinyin": "huàn jù huà shuō míng rèn wù",
          "translation": "nói lại nhiệm vụ theo cách khác"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "确认工作重点",
          "pinyin": "què rèn gōng zuò zhòng diǎn",
          "translation": "xác nhận trọng điểm công việc"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "复述执行步骤",
          "pinyin": "fù shù zhí xíng bù zhòu",
          "translation": "nhắc lại các bước thực hiện"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "确认预期结果",
          "pinyin": "què rèn yù qī jié guǒ",
          "translation": "xác nhận kết quả mong đợi"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "确保双方理解一致",
          "pinyin": "què bǎo shuāng fāng lǐ jiě yí zhì",
          "translation": "bảo đảm hai bên hiểu thống nhất"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "请对方及时纠正",
          "pinyin": "qǐng duì fāng jí shí jiū zhèng",
          "translation": "đề nghị đối phương sửa ngay"
        }
      ],
      "notes": [
        {
          "title": "Nói lại ý hiểu",
          "pattern": "我的理解是……，对吗？",
          "explanation": "Mẫu này giúp phát hiện sai lệch trước khi bắt đầu làm."
        },
        {
          "title": "Tóm tắt bằng cách khác",
          "pattern": "也就是说……",
          "explanation": "Dùng khi muốn diễn đạt kết luận bằng lời ngắn và rõ hơn."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-hang-ngay",
    "slug": "hoi-thoi-gian-dia-diem-va-cach-lien-he",
    "title": "Hỏi thời gian, địa điểm và cách liên hệ",
    "summary": "Thực hành hỏi thời gian, địa điểm và cách liên hệ bằng tiếng Trung trong môi trường công sở.",
    "situation": "Chuẩn bị đến một điểm làm việc mới",
    "estimatedMinutes": 12,
    "isFree": true,
    "vocabulary": [
      {
        "slug": "core-l05-shijian",
        "hanzi": "时间",
        "pinyin": "shí jiān",
        "meaning": "thời gian",
        "example": "我们先确认具体时间。",
        "translation": "Trước tiên, chúng ta xác nhận thời gian cụ thể.",
        "audioUrl": null
      },
      {
        "slug": "core-05-02",
        "hanzi": "日期",
        "pinyin": "rì qī",
        "meaning": "ngày tháng",
        "example": "请询问会议日期。",
        "translation": "Vui lòng hỏi ngày họp.",
        "audioUrl": null
      },
      {
        "slug": "core-l05-didian",
        "hanzi": "地点",
        "pinyin": "dì diǎn",
        "meaning": "địa điểm",
        "example": "我会确认办公地点。",
        "translation": "Tôi sẽ xác nhận địa điểm làm việc.",
        "audioUrl": null
      },
      {
        "slug": "core-05-04",
        "hanzi": "会议室",
        "pinyin": "huì yì shì",
        "meaning": "phòng họp",
        "example": "现在需要预订会议室。",
        "translation": "Bây giờ cần đặt phòng họp.",
        "audioUrl": null
      },
      {
        "slug": "core-05-05",
        "hanzi": "楼层",
        "pinyin": "lóu céng",
        "meaning": "tầng",
        "example": "我们正在询问所在楼层。",
        "translation": "Chúng tôi đang hỏi tầng làm việc.",
        "audioUrl": null
      },
      {
        "slug": "core-05-06",
        "hanzi": "地址",
        "pinyin": "dì zhǐ",
        "meaning": "địa chỉ",
        "example": "请确认是否已经发送公司地址。",
        "translation": "Vui lòng xác nhận đã gửi địa chỉ công ty chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-05-07",
        "hanzi": "电话",
        "pinyin": "diàn huà",
        "meaning": "điện thoại",
        "example": "今天要留下联系电话。",
        "translation": "Hôm nay cần để lại số điện thoại liên hệ.",
        "audioUrl": null
      },
      {
        "slug": "core-05-08",
        "hanzi": "邮箱",
        "pinyin": "yóu xiāng",
        "meaning": "email",
        "example": "可以马上确认工作邮箱吗？",
        "translation": "Có thể xác nhận email công việc ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-05-09",
        "hanzi": "微信",
        "pinyin": "wēi xìn",
        "meaning": "WeChat",
        "example": "完成添加工作微信后请通知我。",
        "translation": "Sau khi hoàn thành việc thêm WeChat công việc, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-05-10",
        "hanzi": "联系",
        "pinyin": "lián xì",
        "meaning": "liên hệ",
        "example": "今天要留下联系电话。",
        "translation": "Hôm nay cần để lại số điện thoại liên hệ.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先确认具体时间。",
          "pinyin": "Wǒ men xiān què rèn jù tǐ shí jiān.",
          "translation": "Trước tiên, chúng ta xác nhận thời gian cụ thể."
        },
        {
          "speaker": "B",
          "hanzi": "请询问会议日期。",
          "pinyin": "Qǐng xún wèn huì yì rì qī.",
          "translation": "Vui lòng hỏi ngày họp."
        },
        {
          "speaker": "A",
          "hanzi": "我会确认办公地点。",
          "pinyin": "Wǒ huì què rèn bàn gōng dì diǎn.",
          "translation": "Tôi sẽ xác nhận địa điểm làm việc."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要预订会议室。",
          "pinyin": "Xiàn zài xū yào yù dìng huì yì shì.",
          "translation": "Bây giờ cần đặt phòng họp."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在询问所在楼层。",
          "pinyin": "Wǒ men zhèng zài xún wèn suǒ zài lóu céng.",
          "translation": "Chúng tôi đang hỏi tầng làm việc."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经发送公司地址。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng fā sòng gōng sī dì zhǐ.",
          "translation": "Vui lòng xác nhận đã gửi địa chỉ công ty chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要留下联系电话。",
          "pinyin": "Jīn tiān yào liú xià lián xì diàn huà.",
          "translation": "Hôm nay cần để lại số điện thoại liên hệ."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上确认工作邮箱吗？",
          "pinyin": "Kě yǐ mǎ shàng què rèn gōng zuò yóu xiāng ma?",
          "translation": "Có thể xác nhận email công việc ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成添加工作微信后请通知我。",
          "pinyin": "Wán chéng tiān jiā gōng zuò wēi xìn hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc thêm WeChat công việc, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时选择方便的联系方式。",
          "pinyin": "Qǐng jí shí xuǎn zé fāng biàn de lián xì fāng shì.",
          "translation": "Vui lòng chọn cách liên hệ thuận tiện kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "确认具体时间",
          "pinyin": "què rèn jù tǐ shí jiān",
          "translation": "xác nhận thời gian cụ thể"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "询问会议日期",
          "pinyin": "xún wèn huì yì rì qī",
          "translation": "hỏi ngày họp"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "确认办公地点",
          "pinyin": "què rèn bàn gōng dì diǎn",
          "translation": "xác nhận địa điểm làm việc"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "预订会议室",
          "pinyin": "yù dìng huì yì shì",
          "translation": "đặt phòng họp"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "询问所在楼层",
          "pinyin": "xún wèn suǒ zài lóu céng",
          "translation": "hỏi tầng làm việc"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "发送公司地址",
          "pinyin": "fā sòng gōng sī dì zhǐ",
          "translation": "gửi địa chỉ công ty"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "留下联系电话",
          "pinyin": "liú xià lián xì diàn huà",
          "translation": "để lại số điện thoại liên hệ"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "确认工作邮箱",
          "pinyin": "què rèn gōng zuò yóu xiāng",
          "translation": "xác nhận email công việc"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "添加工作微信",
          "pinyin": "tiān jiā gōng zuò wēi xìn",
          "translation": "thêm WeChat công việc"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "选择方便的联系方式",
          "pinyin": "xuǎn zé fāng biàn de lián xì fāng shì",
          "translation": "chọn cách liên hệ thuận tiện"
        }
      ],
      "notes": [
        {
          "title": "Hỏi theo cụm",
          "pattern": "几点、在哪里、联系谁？",
          "explanation": "Ba câu hỏi ngắn giúp tránh sót thông tin thực hiện."
        },
        {
          "title": "Báo giờ đến dự kiến",
          "pattern": "预计……到达",
          "explanation": "预计 cho biết đây là dự kiến, không phải xác nhận đã đến."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-hang-ngay",
    "slug": "kiem-tra-giao-tiep-hang-ngay",
    "title": "Kiểm tra Giao tiếp hằng ngày",
    "summary": "Thực hành kiểm tra giao tiếp hằng ngày bằng tiếng Trung trong môi trường công sở.",
    "situation": "Đánh giá cuối module 1",
    "estimatedMinutes": 14,
    "isFree": true,
    "vocabulary": [
      {
        "slug": "core-06-01",
        "hanzi": "问候",
        "pinyin": "wèn hòu",
        "meaning": "chào hỏi",
        "example": "我们先完成日常问候。",
        "translation": "Trước tiên, chúng ta hoàn thành chào hỏi hằng ngày.",
        "audioUrl": null
      },
      {
        "slug": "core-06-02",
        "hanzi": "介绍",
        "pinyin": "jiè shào",
        "meaning": "giới thiệu",
        "example": "请进行自我介绍。",
        "translation": "Vui lòng thực hiện tự giới thiệu.",
        "audioUrl": null
      },
      {
        "slug": "core-06-03",
        "hanzi": "称谓",
        "pinyin": "chēng wèi",
        "meaning": "danh xưng",
        "example": "我会选择礼貌称谓。",
        "translation": "Tôi sẽ chọn danh xưng lịch sự.",
        "audioUrl": null
      },
      {
        "slug": "core-06-04",
        "hanzi": "复述",
        "pinyin": "fù shù",
        "meaning": "nhắc lại",
        "example": "现在需要准确复述信息。",
        "translation": "Bây giờ cần nhắc lại thông tin chính xác.",
        "audioUrl": null
      },
      {
        "slug": "core-06-05",
        "hanzi": "澄清",
        "pinyin": "chéng qīng",
        "meaning": "làm rõ",
        "example": "我们正在主动澄清疑问。",
        "translation": "Chúng tôi đang chủ động làm rõ thắc mắc.",
        "audioUrl": null
      },
      {
        "slug": "core-06-06",
        "hanzi": "确认",
        "pinyin": "què rèn",
        "meaning": "xác nhận",
        "example": "请确认是否已经再次确认安排。",
        "translation": "Vui lòng xác nhận đã xác nhận lại sắp xếp chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-06-07",
        "hanzi": "时间",
        "pinyin": "shí jiān",
        "meaning": "thời gian",
        "example": "今天要约定见面时间。",
        "translation": "Hôm nay cần hẹn thời gian gặp.",
        "audioUrl": null
      },
      {
        "slug": "core-06-08",
        "hanzi": "地点",
        "pinyin": "dì diǎn",
        "meaning": "địa điểm",
        "example": "可以马上说明见面地点吗？",
        "translation": "Có thể nêu địa điểm gặp ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-06-09",
        "hanzi": "联系方式",
        "pinyin": "lián xì fāng shì",
        "meaning": "thông tin liên hệ",
        "example": "完成交换联系方式后请通知我。",
        "translation": "Sau khi hoàn thành việc trao đổi thông tin liên hệ, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-06-10",
        "hanzi": "对话",
        "pinyin": "duì huà",
        "meaning": "hội thoại",
        "example": "请及时完成情景对话。",
        "translation": "Vui lòng hoàn thành hội thoại tình huống kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先完成日常问候。",
          "pinyin": "Wǒ men xiān wán chéng rì cháng wèn hòu.",
          "translation": "Trước tiên, chúng ta hoàn thành chào hỏi hằng ngày."
        },
        {
          "speaker": "B",
          "hanzi": "请进行自我介绍。",
          "pinyin": "Qǐng jìn xíng zì wǒ jiè shào.",
          "translation": "Vui lòng thực hiện tự giới thiệu."
        },
        {
          "speaker": "A",
          "hanzi": "我会选择礼貌称谓。",
          "pinyin": "Wǒ huì xuǎn zé lǐ mào chēng wèi.",
          "translation": "Tôi sẽ chọn danh xưng lịch sự."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要准确复述信息。",
          "pinyin": "Xiàn zài xū yào zhǔn què fù shù xìn xī.",
          "translation": "Bây giờ cần nhắc lại thông tin chính xác."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在主动澄清疑问。",
          "pinyin": "Wǒ men zhèng zài zhǔ dòng chéng qīng yí wèn.",
          "translation": "Chúng tôi đang chủ động làm rõ thắc mắc."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经再次确认安排。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng zài cì què rèn ān pái.",
          "translation": "Vui lòng xác nhận đã xác nhận lại sắp xếp chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要约定见面时间。",
          "pinyin": "Jīn tiān yāo yuē dìng jiàn miàn shí jiān.",
          "translation": "Hôm nay cần hẹn thời gian gặp."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上说明见面地点吗？",
          "pinyin": "Kě yǐ mǎ shàng shuō míng jiàn miàn dì diǎn ma?",
          "translation": "Có thể nêu địa điểm gặp ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成交换联系方式后请通知我。",
          "pinyin": "Wán chéng jiāo huàn lián xì fāng shì hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc trao đổi thông tin liên hệ, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时完成情景对话。",
          "pinyin": "Qǐng jí shí wán chéng qíng jǐng duì huà.",
          "translation": "Vui lòng hoàn thành hội thoại tình huống kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "完成日常问候",
          "pinyin": "wán chéng rì cháng wèn hòu",
          "translation": "hoàn thành chào hỏi hằng ngày"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "进行自我介绍",
          "pinyin": "jìn xíng zì wǒ jiè shào",
          "translation": "thực hiện tự giới thiệu"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "选择礼貌称谓",
          "pinyin": "xuǎn zé lǐ mào chēng wèi",
          "translation": "chọn danh xưng lịch sự"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "准确复述信息",
          "pinyin": "zhǔn què fù shù xìn xī",
          "translation": "nhắc lại thông tin chính xác"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "主动澄清疑问",
          "pinyin": "zhǔ dòng chéng qīng yí wèn",
          "translation": "chủ động làm rõ thắc mắc"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "再次确认安排",
          "pinyin": "zài cì què rèn ān pái",
          "translation": "xác nhận lại sắp xếp"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "约定见面时间",
          "pinyin": "yuē dìng jiàn miàn shí jiān",
          "translation": "hẹn thời gian gặp"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "说明见面地点",
          "pinyin": "shuō míng jiàn miàn dì diǎn",
          "translation": "nêu địa điểm gặp"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "交换联系方式",
          "pinyin": "jiāo huàn lián xì fāng shì",
          "translation": "trao đổi thông tin liên hệ"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "完成情景对话",
          "pinyin": "wán chéng qíng jǐng duì huà",
          "translation": "hoàn thành hội thoại tình huống"
        }
      ],
      "notes": [
        {
          "title": "Tập trung điểm chính",
          "pattern": "时间 + 地点 + 人物 + 动作",
          "explanation": "Bốn nhóm thông tin thường quyết định một việc có được thực hiện đúng hay không."
        },
        {
          "title": "Lịch sự nhưng rõ",
          "pattern": "不好意思 + 具体请求",
          "explanation": "Lời mở mềm nên đi cùng yêu cầu cụ thể, không nói vòng quá dài."
        }
      ],
      "challenge": {
        "title": "Kiểm tra giao tiếp hằng ngày",
        "description": "Đạt 4/5 câu để chuyển sang hiểu việc và phối hợp.",
        "passScore": 4,
        "questions": [
          {
            "prompt": "初次见面，cách mở đầu phù hợp là gì?",
            "options": [
              "您好，很高兴认识您。",
              "你是谁？",
              "快点说。"
            ],
            "correctOption": 0,
            "explanation": "您好 và 很高兴认识您 tạo lời chào lịch sự khi gặp lần đầu."
          },
          {
            "prompt": "Khi chưa nghe rõ, nên nói gì?",
            "options": [
              "不好意思，请再说一遍。",
              "算了，不用说。",
              "我肯定听懂了。"
            ],
            "correctOption": 0,
            "explanation": "Xin người nói lặp lại tốt hơn giả vờ đã hiểu một thông tin công việc."
          },
          {
            "prompt": "我的理解是…… dùng để làm gì?",
            "options": [
              "Nói lại cách mình hiểu để xác nhận",
              "Từ chối nhiệm vụ",
              "Kết thúc cuộc gọi"
            ],
            "correctOption": 0,
            "explanation": "Cấu trúc này cho người nghe cơ hội sửa điểm hiểu chưa đúng."
          },
          {
            "prompt": "Câu nào hỏi địa điểm và thời gian rõ ràng?",
            "options": [
              "请问几点、在哪里集合？",
              "什么时候都可以。",
              "我以后再看。"
            ],
            "correctOption": 0,
            "explanation": "几点 và 在哪里 xác định hai thông tin cần cho việc có mặt đúng lúc."
          },
          {
            "prompt": "Khi gọi người lớn tuổi hoặc khách hàng, 您 thể hiện điều gì?",
            "options": [
              "Sự lịch sự và tôn trọng",
              "Số nhiều",
              "Quan hệ thân mật"
            ],
            "correctOption": 0,
            "explanation": "您 là đại từ xưng hô lịch sự, phù hợp với người chưa thân hoặc cần thể hiện sự tôn trọng."
          }
        ]
      }
    }
  },
  {
    "moduleSlug": "hieu-viec-va-phoi-hop",
    "slug": "tiep-nhan-va-nhac-lai-nhiem-vu",
    "title": "Tiếp nhận và nhắc lại nhiệm vụ",
    "summary": "Thực hành tiếp nhận và nhắc lại nhiệm vụ bằng tiếng Trung trong môi trường công sở.",
    "situation": "Quản lý giao một việc mới",
    "estimatedMinutes": 12,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l07-renwu",
        "hanzi": "任务",
        "pinyin": "rèn wù",
        "meaning": "nhiệm vụ",
        "example": "我们先接收新的任务。",
        "translation": "Trước tiên, chúng ta tiếp nhận nhiệm vụ mới.",
        "audioUrl": null
      },
      {
        "slug": "core-l07-anpai",
        "hanzi": "安排",
        "pinyin": "ān pái",
        "meaning": "sắp xếp",
        "example": "请听取工作安排。",
        "translation": "Vui lòng lắng nghe sắp xếp công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-07-03",
        "hanzi": "要求",
        "pinyin": "yāo qiú",
        "meaning": "yêu cầu",
        "example": "我会记录具体要求。",
        "translation": "Tôi sẽ ghi lại yêu cầu cụ thể.",
        "audioUrl": null
      },
      {
        "slug": "core-07-04",
        "hanzi": "截止日期",
        "pinyin": "jié zhǐ rì qī",
        "meaning": "hạn chót",
        "example": "现在需要确认任务截止日期。",
        "translation": "Bây giờ cần xác nhận hạn chót nhiệm vụ.",
        "audioUrl": null
      },
      {
        "slug": "core-07-05",
        "hanzi": "负责人",
        "pinyin": "fù zé rén",
        "meaning": "người phụ trách",
        "example": "我们正在确认任务负责人。",
        "translation": "Chúng tôi đang xác nhận người phụ trách nhiệm vụ.",
        "audioUrl": null
      },
      {
        "slug": "core-07-06",
        "hanzi": "资料",
        "pinyin": "zī liào",
        "meaning": "tài liệu",
        "example": "请确认是否已经接收相关资料。",
        "translation": "Vui lòng xác nhận đã tiếp nhận tài liệu liên quan chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-l07-buzhou",
        "hanzi": "步骤",
        "pinyin": "bù zhòu",
        "meaning": "bước",
        "example": "今天要复述执行步骤。",
        "translation": "Hôm nay cần nhắc lại các bước thực hiện.",
        "audioUrl": null
      },
      {
        "slug": "core-07-08",
        "hanzi": "标准",
        "pinyin": "biāo zhǔn",
        "meaning": "tiêu chuẩn",
        "example": "可以马上确认完成标准吗？",
        "translation": "Có thể xác nhận tiêu chuẩn hoàn thành ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-07-09",
        "hanzi": "交付物",
        "pinyin": "jiāo fù wù",
        "meaning": "sản phẩm bàn giao",
        "example": "完成明确任务交付物后请通知我。",
        "translation": "Sau khi hoàn thành việc làm rõ sản phẩm bàn giao, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-07-10",
        "hanzi": "收到",
        "pinyin": "shōu dào",
        "meaning": "đã nhận",
        "example": "请及时回复已经收到任务。",
        "translation": "Vui lòng phản hồi đã nhận nhiệm vụ kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先接收新的任务。",
          "pinyin": "Wǒ men xiān jiē shōu xīn de rèn wù.",
          "translation": "Trước tiên, chúng ta tiếp nhận nhiệm vụ mới."
        },
        {
          "speaker": "B",
          "hanzi": "请听取工作安排。",
          "pinyin": "Qǐng tīng qǔ gōng zuò ān pái.",
          "translation": "Vui lòng lắng nghe sắp xếp công việc."
        },
        {
          "speaker": "A",
          "hanzi": "我会记录具体要求。",
          "pinyin": "Wǒ huì jì lù jù tǐ yāo qiú.",
          "translation": "Tôi sẽ ghi lại yêu cầu cụ thể."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要确认任务截止日期。",
          "pinyin": "Xiàn zài xū yào què rèn rèn wù jié zhǐ rì qī.",
          "translation": "Bây giờ cần xác nhận hạn chót nhiệm vụ."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在确认任务负责人。",
          "pinyin": "Wǒ men zhèng zài què rèn rèn wù fù zé rén.",
          "translation": "Chúng tôi đang xác nhận người phụ trách nhiệm vụ."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经接收相关资料。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng jiē shōu xiāng guān zī liào.",
          "translation": "Vui lòng xác nhận đã tiếp nhận tài liệu liên quan chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要复述执行步骤。",
          "pinyin": "Jīn tiān yào fù shù zhí xíng bù zhòu.",
          "translation": "Hôm nay cần nhắc lại các bước thực hiện."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上确认完成标准吗？",
          "pinyin": "Kě yǐ mǎ shàng què rèn wán chéng biāo zhǔn ma?",
          "translation": "Có thể xác nhận tiêu chuẩn hoàn thành ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成明确任务交付物后请通知我。",
          "pinyin": "Wán chéng míng què rèn wù jiāo fù wù hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc làm rõ sản phẩm bàn giao, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时回复已经收到任务。",
          "pinyin": "Qǐng jí shí huí fù yǐ jīng shōu dào rèn wù.",
          "translation": "Vui lòng phản hồi đã nhận nhiệm vụ kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "接收新的任务",
          "pinyin": "jiē shōu xīn de rèn wù",
          "translation": "tiếp nhận nhiệm vụ mới"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "听取工作安排",
          "pinyin": "tīng qǔ gōng zuò ān pái",
          "translation": "lắng nghe sắp xếp công việc"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "记录具体要求",
          "pinyin": "jì lù jù tǐ yāo qiú",
          "translation": "ghi lại yêu cầu cụ thể"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "确认任务截止日期",
          "pinyin": "què rèn rèn wù jié zhǐ rì qī",
          "translation": "xác nhận hạn chót nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "确认任务负责人",
          "pinyin": "què rèn rèn wù fù zé rén",
          "translation": "xác nhận người phụ trách nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "接收相关资料",
          "pinyin": "jiē shōu xiāng guān zī liào",
          "translation": "tiếp nhận tài liệu liên quan"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "复述执行步骤",
          "pinyin": "fù shù zhí xíng bù zhòu",
          "translation": "nhắc lại các bước thực hiện"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "确认完成标准",
          "pinyin": "què rèn wán chéng biāo zhǔn",
          "translation": "xác nhận tiêu chuẩn hoàn thành"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "明确任务交付物",
          "pinyin": "míng què rèn wù jiāo fù wù",
          "translation": "làm rõ sản phẩm bàn giao"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "回复已经收到任务",
          "pinyin": "huí fù yǐ jīng shōu dào rèn wù",
          "translation": "phản hồi đã nhận nhiệm vụ"
        }
      ],
      "notes": [
        {
          "title": "Ghi nhận đã nhận việc",
          "pattern": "收到，我先……",
          "explanation": "收到 xác nhận đã tiếp nhận; vế sau cho thấy hành động bắt đầu."
        },
        {
          "title": "Không chỉ nói đã hiểu",
          "pattern": "复述任务内容",
          "explanation": "Nhắc lại đầu ra cụ thể đáng tin hơn câu 我明白了 đơn lẻ."
        }
      ]
    }
  },
  {
    "moduleSlug": "hieu-viec-va-phoi-hop",
    "slug": "hoi-muc-tieu-va-ket-qua-mong-doi",
    "title": "Hỏi mục tiêu và kết quả mong đợi",
    "summary": "Thực hành hỏi mục tiêu và kết quả mong đợi bằng tiếng Trung trong môi trường công sở.",
    "situation": "Nhiệm vụ được mô tả còn chung chung",
    "estimatedMinutes": 13,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l08-mubiao",
        "hanzi": "目标",
        "pinyin": "mù biāo",
        "meaning": "mục tiêu",
        "example": "我们先询问项目目标。",
        "translation": "Trước tiên, chúng ta hỏi mục tiêu dự án.",
        "audioUrl": null
      },
      {
        "slug": "core-08-02",
        "hanzi": "目的",
        "pinyin": "mù dì",
        "meaning": "mục đích",
        "example": "请了解任务目的。",
        "translation": "Vui lòng tìm hiểu mục đích nhiệm vụ.",
        "audioUrl": null
      },
      {
        "slug": "core-08-03",
        "hanzi": "成果",
        "pinyin": "chéng guǒ",
        "meaning": "thành quả",
        "example": "我会确认最终成果。",
        "translation": "Tôi sẽ xác nhận thành quả cuối cùng.",
        "audioUrl": null
      },
      {
        "slug": "core-08-04",
        "hanzi": "预期",
        "pinyin": "yù qī",
        "meaning": "mong đợi",
        "example": "现在需要了解预期效果。",
        "translation": "Bây giờ cần tìm hiểu hiệu quả mong đợi.",
        "audioUrl": null
      },
      {
        "slug": "core-08-05",
        "hanzi": "指标",
        "pinyin": "zhǐ biāo",
        "meaning": "chỉ số",
        "example": "我们正在确认衡量指标。",
        "translation": "Chúng tôi đang xác nhận chỉ số đo lường.",
        "audioUrl": null
      },
      {
        "slug": "core-08-06",
        "hanzi": "质量",
        "pinyin": "zhì liàng",
        "meaning": "chất lượng",
        "example": "请确认是否已经询问质量要求。",
        "translation": "Vui lòng xác nhận đã hỏi yêu cầu chất lượng chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-08-07",
        "hanzi": "格式",
        "pinyin": "gé shì",
        "meaning": "định dạng",
        "example": "今天要确认提交格式。",
        "translation": "Hôm nay cần xác nhận định dạng nộp.",
        "audioUrl": null
      },
      {
        "slug": "core-08-08",
        "hanzi": "受众",
        "pinyin": "shòu zhòng",
        "meaning": "đối tượng",
        "example": "可以马上了解目标受众吗？",
        "translation": "Có thể tìm hiểu đối tượng mục tiêu ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-l08-yongtu",
        "hanzi": "用途",
        "pinyin": "yòng tú",
        "meaning": "mục đích sử dụng",
        "example": "完成确认成果用途后请通知我。",
        "translation": "Sau khi hoàn thành việc xác nhận mục đích sử dụng thành quả, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-08-10",
        "hanzi": "验收",
        "pinyin": "yàn shōu",
        "meaning": "nghiệm thu",
        "example": "请及时明确验收条件。",
        "translation": "Vui lòng làm rõ điều kiện nghiệm thu kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先询问项目目标。",
          "pinyin": "Wǒ men xiān xún wèn xiàng mù mù biāo.",
          "translation": "Trước tiên, chúng ta hỏi mục tiêu dự án."
        },
        {
          "speaker": "B",
          "hanzi": "请了解任务目的。",
          "pinyin": "Qǐng liǎo jiě rèn wù mù dì.",
          "translation": "Vui lòng tìm hiểu mục đích nhiệm vụ."
        },
        {
          "speaker": "A",
          "hanzi": "我会确认最终成果。",
          "pinyin": "Wǒ huì què rèn zuì zhōng chéng guǒ.",
          "translation": "Tôi sẽ xác nhận thành quả cuối cùng."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要了解预期效果。",
          "pinyin": "Xiàn zài xū yào liǎo jiě yù qī xiào guǒ.",
          "translation": "Bây giờ cần tìm hiểu hiệu quả mong đợi."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在确认衡量指标。",
          "pinyin": "Wǒ men zhèng zài què rèn héng liáng zhǐ biāo.",
          "translation": "Chúng tôi đang xác nhận chỉ số đo lường."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经询问质量要求。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng xún wèn zhì liàng yāo qiú.",
          "translation": "Vui lòng xác nhận đã hỏi yêu cầu chất lượng chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要确认提交格式。",
          "pinyin": "Jīn tiān yào què rèn tí jiāo gé shì.",
          "translation": "Hôm nay cần xác nhận định dạng nộp."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上了解目标受众吗？",
          "pinyin": "Kě yǐ mǎ shàng liǎo jiě mù biāo shòu zhòng ma?",
          "translation": "Có thể tìm hiểu đối tượng mục tiêu ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成确认成果用途后请通知我。",
          "pinyin": "Wán chéng què rèn chéng guǒ yòng tú hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc xác nhận mục đích sử dụng thành quả, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时明确验收条件。",
          "pinyin": "Qǐng jí shí míng què yàn shōu tiáo jiàn.",
          "translation": "Vui lòng làm rõ điều kiện nghiệm thu kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "询问项目目标",
          "pinyin": "xún wèn xiàng mù mù biāo",
          "translation": "hỏi mục tiêu dự án"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "了解任务目的",
          "pinyin": "liǎo jiě rèn wù mù dì",
          "translation": "tìm hiểu mục đích nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "确认最终成果",
          "pinyin": "què rèn zuì zhōng chéng guǒ",
          "translation": "xác nhận thành quả cuối cùng"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "了解预期效果",
          "pinyin": "liǎo jiě yù qī xiào guǒ",
          "translation": "tìm hiểu hiệu quả mong đợi"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "确认衡量指标",
          "pinyin": "què rèn héng liáng zhǐ biāo",
          "translation": "xác nhận chỉ số đo lường"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "询问质量要求",
          "pinyin": "xún wèn zhì liàng yāo qiú",
          "translation": "hỏi yêu cầu chất lượng"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "确认提交格式",
          "pinyin": "què rèn tí jiāo gé shì",
          "translation": "xác nhận định dạng nộp"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "了解目标受众",
          "pinyin": "liǎo jiě mù biāo shòu zhòng",
          "translation": "tìm hiểu đối tượng mục tiêu"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "确认成果用途",
          "pinyin": "què rèn chéng guǒ yòng tú",
          "translation": "xác nhận mục đích sử dụng thành quả"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "明确验收条件",
          "pinyin": "míng què yàn shōu tiáo jiàn",
          "translation": "làm rõ điều kiện nghiệm thu"
        }
      ],
      "notes": [
        {
          "title": "Hỏi mục tiêu",
          "pattern": "这个任务是为了……吗？",
          "explanation": "为了 dẫn vào mục đích, giúp xác nhận bối cảnh sử dụng kết quả."
        },
        {
          "title": "Đầu ra có hình thức",
          "pattern": "以……形式提交",
          "explanation": "Dùng để xác định nộp dạng bảng, văn bản, ảnh hay cập nhật hệ thống."
        }
      ]
    }
  },
  {
    "moduleSlug": "hieu-viec-va-phoi-hop",
    "slug": "lam-ro-pham-vi-va-ngoai-le",
    "title": "Làm rõ phạm vi và ngoại lệ",
    "summary": "Thực hành làm rõ phạm vi và ngoại lệ bằng tiếng Trung trong môi trường công sở.",
    "situation": "Công việc có nhiều nhóm dữ liệu",
    "estimatedMinutes": 13,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l09-fanwei",
        "hanzi": "范围",
        "pinyin": "fàn wéi",
        "meaning": "phạm vi",
        "example": "我们先明确工作范围。",
        "translation": "Trước tiên, chúng ta làm rõ phạm vi công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-l09-baokuo",
        "hanzi": "包括",
        "pinyin": "bāo kuò",
        "meaning": "bao gồm",
        "example": "请确认包括哪些内容。",
        "translation": "Vui lòng xác nhận gồm những nội dung nào.",
        "audioUrl": null
      },
      {
        "slug": "core-l09-bubaokuo",
        "hanzi": "不包括",
        "pinyin": "bù bāo kuò",
        "meaning": "không bao gồm",
        "example": "我会说明不包括的事项。",
        "translation": "Tôi sẽ nêu các việc không bao gồm.",
        "audioUrl": null
      },
      {
        "slug": "core-l09-bianjie",
        "hanzi": "边界",
        "pinyin": "biān jiè",
        "meaning": "ranh giới",
        "example": "现在需要确定职责边界。",
        "translation": "Bây giờ cần xác định ranh giới trách nhiệm.",
        "audioUrl": null
      },
      {
        "slug": "core-l09-waili",
        "hanzi": "例外",
        "pinyin": "lì wài",
        "meaning": "ngoại lệ",
        "example": "我们正在询问特殊例外。",
        "translation": "Chúng tôi đang hỏi ngoại lệ đặc biệt.",
        "audioUrl": null
      },
      {
        "slug": "core-09-06",
        "hanzi": "限制",
        "pinyin": "xiàn zhì",
        "meaning": "hạn chế",
        "example": "请确认是否已经确认现有限制。",
        "translation": "Vui lòng xác nhận đã xác nhận hạn chế hiện có chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-09-07",
        "hanzi": "条件",
        "pinyin": "tiáo jiàn",
        "meaning": "điều kiện",
        "example": "今天要说明适用条件。",
        "translation": "Hôm nay cần nêu điều kiện áp dụng.",
        "audioUrl": null
      },
      {
        "slug": "core-09-08",
        "hanzi": "变更",
        "pinyin": "biàn gēng",
        "meaning": "thay đổi",
        "example": "可以马上约定范围变更流程吗？",
        "translation": "Có thể thống nhất quy trình thay đổi phạm vi ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-09-09",
        "hanzi": "假设",
        "pinyin": "jiǎ shè",
        "meaning": "giả định",
        "example": "完成记录项目假设后请通知我。",
        "translation": "Sau khi hoàn thành việc ghi lại giả định dự án, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-09-10",
        "hanzi": "依赖",
        "pinyin": "yī lài",
        "meaning": "phụ thuộc",
        "example": "请及时识别外部依赖。",
        "translation": "Vui lòng xác định phụ thuộc bên ngoài kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先明确工作范围。",
          "pinyin": "Wǒ men xiān míng què gōng zuò fàn wéi.",
          "translation": "Trước tiên, chúng ta làm rõ phạm vi công việc."
        },
        {
          "speaker": "B",
          "hanzi": "请确认包括哪些内容。",
          "pinyin": "Qǐng què rèn bāo kuò nǎ xiē nèi róng.",
          "translation": "Vui lòng xác nhận gồm những nội dung nào."
        },
        {
          "speaker": "A",
          "hanzi": "我会说明不包括的事项。",
          "pinyin": "Wǒ huì shuō míng bù bāo kuò de shì xiàng.",
          "translation": "Tôi sẽ nêu các việc không bao gồm."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要确定职责边界。",
          "pinyin": "Xiàn zài xū yào què dìng zhí zé biān jiè.",
          "translation": "Bây giờ cần xác định ranh giới trách nhiệm."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在询问特殊例外。",
          "pinyin": "Wǒ men zhèng zài xún wèn tè shū lì wài.",
          "translation": "Chúng tôi đang hỏi ngoại lệ đặc biệt."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经确认现有限制。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng què rèn xiàn yǒu xiàn zhì.",
          "translation": "Vui lòng xác nhận đã xác nhận hạn chế hiện có chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要说明适用条件。",
          "pinyin": "Jīn tiān yào shuō míng shì yòng tiáo jiàn.",
          "translation": "Hôm nay cần nêu điều kiện áp dụng."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上约定范围变更流程吗？",
          "pinyin": "Kě yǐ mǎ shàng yuē dìng fàn wéi biàn gēng liú chéng ma?",
          "translation": "Có thể thống nhất quy trình thay đổi phạm vi ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成记录项目假设后请通知我。",
          "pinyin": "Wán chéng jì lù xiàng mù jiǎ shè hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc ghi lại giả định dự án, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时识别外部依赖。",
          "pinyin": "Qǐng jí shí shí bié wài bù yī lài.",
          "translation": "Vui lòng xác định phụ thuộc bên ngoài kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "明确工作范围",
          "pinyin": "míng què gōng zuò fàn wéi",
          "translation": "làm rõ phạm vi công việc"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "确认包括哪些内容",
          "pinyin": "què rèn bāo kuò nǎ xiē nèi róng",
          "translation": "xác nhận gồm những nội dung nào"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "说明不包括的事项",
          "pinyin": "shuō míng bù bāo kuò de shì xiàng",
          "translation": "nêu các việc không bao gồm"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "确定职责边界",
          "pinyin": "què dìng zhí zé biān jiè",
          "translation": "xác định ranh giới trách nhiệm"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "询问特殊例外",
          "pinyin": "xún wèn tè shū lì wài",
          "translation": "hỏi ngoại lệ đặc biệt"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "确认现有限制",
          "pinyin": "què rèn xiàn yǒu xiàn zhì",
          "translation": "xác nhận hạn chế hiện có"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "说明适用条件",
          "pinyin": "shuō míng shì yòng tiáo jiàn",
          "translation": "nêu điều kiện áp dụng"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "约定范围变更流程",
          "pinyin": "yuē dìng fàn wéi biàn gēng liú chéng",
          "translation": "thống nhất quy trình thay đổi phạm vi"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "记录项目假设",
          "pinyin": "jì lù xiàng mù jiǎ shè",
          "translation": "ghi lại giả định dự án"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "识别外部依赖",
          "pinyin": "shí bié wài bù yī lài",
          "translation": "xác định phụ thuộc bên ngoài"
        }
      ],
      "notes": [
        {
          "title": "Bao gồm và không bao gồm",
          "pattern": "包括……，不包括……",
          "explanation": "Nêu hai phía giúp ranh giới nhiệm vụ rõ hơn."
        },
        {
          "title": "Ngoại lệ cần người xác nhận",
          "pattern": "如果遇到……，请先确认",
          "explanation": "Không tự mở rộng quy tắc từ một tình huống chưa được duyệt."
        }
      ]
    }
  },
  {
    "moduleSlug": "hieu-viec-va-phoi-hop",
    "slug": "xac-nhan-muc-do-uu-tien",
    "title": "Xác nhận mức độ ưu tiên",
    "summary": "Thực hành xác nhận mức độ ưu tiên bằng tiếng Trung trong môi trường công sở.",
    "situation": "Hai yêu cầu đến cùng thời điểm",
    "estimatedMinutes": 13,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-10-01",
        "hanzi": "优先级",
        "pinyin": "yōu xiān jí",
        "meaning": "mức độ ưu tiên",
        "example": "我们先确认任务优先级。",
        "translation": "Trước tiên, chúng ta xác nhận mức độ ưu tiên nhiệm vụ.",
        "audioUrl": null
      },
      {
        "slug": "core-l10-jinji",
        "hanzi": "紧急",
        "pinyin": "jǐn jí",
        "meaning": "khẩn cấp",
        "example": "请判断是否紧急。",
        "translation": "Vui lòng xác định có khẩn cấp không.",
        "audioUrl": null
      },
      {
        "slug": "core-l10-zhongyao",
        "hanzi": "重要",
        "pinyin": "zhòng yào",
        "meaning": "quan trọng",
        "example": "我会区分重要任务。",
        "translation": "Tôi sẽ phân biệt nhiệm vụ quan trọng.",
        "audioUrl": null
      },
      {
        "slug": "core-10-04",
        "hanzi": "首先",
        "pinyin": "shǒu xiān",
        "meaning": "trước tiên",
        "example": "现在需要确认首先处理什么。",
        "translation": "Bây giờ cần xác nhận việc cần xử lý trước.",
        "audioUrl": null
      },
      {
        "slug": "core-l10-shunxu",
        "hanzi": "顺序",
        "pinyin": "shùn xù",
        "meaning": "thứ tự",
        "example": "我们正在调整工作顺序。",
        "translation": "Chúng tôi đang điều chỉnh thứ tự công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-10-06",
        "hanzi": "期限",
        "pinyin": "qī xiàn",
        "meaning": "thời hạn",
        "example": "请确认是否已经比较任务期限。",
        "translation": "Vui lòng xác nhận đã so sánh thời hạn nhiệm vụ chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-l10-yingxiang",
        "hanzi": "影响",
        "pinyin": "yǐng xiǎng",
        "meaning": "ảnh hưởng",
        "example": "今天要评估延迟影响。",
        "translation": "Hôm nay cần đánh giá ảnh hưởng chậm trễ.",
        "audioUrl": null
      },
      {
        "slug": "core-10-08",
        "hanzi": "资源",
        "pinyin": "zī yuán",
        "meaning": "nguồn lực",
        "example": "可以马上根据资源排序吗？",
        "translation": "Có thể sắp xếp theo nguồn lực ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-l10-chongtu",
        "hanzi": "冲突",
        "pinyin": "chōng tū",
        "meaning": "xung đột",
        "example": "完成报告优先级冲突后请通知我。",
        "translation": "Sau khi hoàn thành việc báo xung đột ưu tiên, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-10-10",
        "hanzi": "决定",
        "pinyin": "jué dìng",
        "meaning": "quyết định",
        "example": "请及时请主管做决定。",
        "translation": "Vui lòng đề nghị quản lý quyết định kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先确认任务优先级。",
          "pinyin": "Wǒ men xiān què rèn rèn wù yōu xiān jí.",
          "translation": "Trước tiên, chúng ta xác nhận mức độ ưu tiên nhiệm vụ."
        },
        {
          "speaker": "B",
          "hanzi": "请判断是否紧急。",
          "pinyin": "Qǐng pàn duàn shì fǒu jǐn jí.",
          "translation": "Vui lòng xác định có khẩn cấp không."
        },
        {
          "speaker": "A",
          "hanzi": "我会区分重要任务。",
          "pinyin": "Wǒ huì qū fēn zhòng yào rèn wù.",
          "translation": "Tôi sẽ phân biệt nhiệm vụ quan trọng."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要确认首先处理什么。",
          "pinyin": "Xiàn zài xū yào què rèn shǒu xiān chǔ lǐ shén me.",
          "translation": "Bây giờ cần xác nhận việc cần xử lý trước."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在调整工作顺序。",
          "pinyin": "Wǒ men zhèng zài tiáo zhěng gōng zuò shùn xù.",
          "translation": "Chúng tôi đang điều chỉnh thứ tự công việc."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经比较任务期限。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng bǐ jiào rèn wù qī xiàn.",
          "translation": "Vui lòng xác nhận đã so sánh thời hạn nhiệm vụ chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要评估延迟影响。",
          "pinyin": "Jīn tiān yào píng gū yán chí yǐng xiǎng.",
          "translation": "Hôm nay cần đánh giá ảnh hưởng chậm trễ."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上根据资源排序吗？",
          "pinyin": "Kě yǐ mǎ shàng gēn jù zī yuán pái xù ma?",
          "translation": "Có thể sắp xếp theo nguồn lực ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成报告优先级冲突后请通知我。",
          "pinyin": "Wán chéng bào gào yōu xiān jí chōng tū hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc báo xung đột ưu tiên, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时请主管做决定。",
          "pinyin": "Qǐng jí shí qǐng zhǔ guǎn zuò jué dìng.",
          "translation": "Vui lòng đề nghị quản lý quyết định kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "确认任务优先级",
          "pinyin": "què rèn rèn wù yōu xiān jí",
          "translation": "xác nhận mức độ ưu tiên nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "判断是否紧急",
          "pinyin": "pàn duàn shì fǒu jǐn jí",
          "translation": "xác định có khẩn cấp không"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "区分重要任务",
          "pinyin": "qū fēn zhòng yào rèn wù",
          "translation": "phân biệt nhiệm vụ quan trọng"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "确认首先处理什么",
          "pinyin": "què rèn shǒu xiān chǔ lǐ shén me",
          "translation": "xác nhận việc cần xử lý trước"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "调整工作顺序",
          "pinyin": "tiáo zhěng gōng zuò shùn xù",
          "translation": "điều chỉnh thứ tự công việc"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "比较任务期限",
          "pinyin": "bǐ jiào rèn wù qī xiàn",
          "translation": "so sánh thời hạn nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "评估延迟影响",
          "pinyin": "píng gū yán chí yǐng xiǎng",
          "translation": "đánh giá ảnh hưởng chậm trễ"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "根据资源排序",
          "pinyin": "gēn jù zī yuán pái xù",
          "translation": "sắp xếp theo nguồn lực"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "报告优先级冲突",
          "pinyin": "bào gào yōu xiān jí chōng tū",
          "translation": "báo xung đột ưu tiên"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "请主管做决定",
          "pinyin": "qǐng zhǔ guǎn zuò jué dìng",
          "translation": "đề nghị quản lý quyết định"
        }
      ],
      "notes": [
        {
          "title": "Khẩn khác quan trọng",
          "pattern": "紧急 / 重要",
          "explanation": "紧急 nói về thời gian; 重要 nói về mức ảnh hưởng hoặc giá trị."
        },
        {
          "title": "Báo hệ quả khi đổi ưu tiên",
          "pattern": "这会影响……",
          "explanation": "Giúp người quyết định hiểu phần việc nào sẽ bị lùi."
        }
      ]
    }
  },
  {
    "moduleSlug": "hieu-viec-va-phoi-hop",
    "slug": "phan-cong-va-xac-nhan-nguoi-phu-trach",
    "title": "Phân công và xác nhận người phụ trách",
    "summary": "Thực hành phân công và xác nhận người phụ trách bằng tiếng Trung trong môi trường công sở.",
    "situation": "Một nhiệm vụ cần nhiều nhóm cùng làm",
    "estimatedMinutes": 14,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l11-fengong",
        "hanzi": "分工",
        "pinyin": "fēn gōng",
        "meaning": "phân công",
        "example": "我们先明确团队分工。",
        "translation": "Trước tiên, chúng ta làm rõ phân công nhóm.",
        "audioUrl": null
      },
      {
        "slug": "core-11-02",
        "hanzi": "指派",
        "pinyin": "zhǐ pài",
        "meaning": "giao việc",
        "example": "请指派具体任务。",
        "translation": "Vui lòng giao nhiệm vụ cụ thể.",
        "audioUrl": null
      },
      {
        "slug": "core-l11-fuzeren",
        "hanzi": "负责人",
        "pinyin": "fù zé rén",
        "meaning": "người phụ trách",
        "example": "我会确定主要负责人。",
        "translation": "Tôi sẽ xác định người phụ trách chính.",
        "audioUrl": null
      },
      {
        "slug": "core-11-04",
        "hanzi": "协助者",
        "pinyin": "xié zhù zhě",
        "meaning": "người hỗ trợ",
        "example": "现在需要安排任务协助者。",
        "translation": "Bây giờ cần sắp xếp người hỗ trợ nhiệm vụ.",
        "audioUrl": null
      },
      {
        "slug": "core-11-05",
        "hanzi": "职责",
        "pinyin": "zhí zé",
        "meaning": "trách nhiệm",
        "example": "我们正在说明各自职责。",
        "translation": "Chúng tôi đang nêu trách nhiệm từng người.",
        "audioUrl": null
      },
      {
        "slug": "core-11-06",
        "hanzi": "资源",
        "pinyin": "zī yuán",
        "meaning": "nguồn lực",
        "example": "请确认是否已经分配所需资源。",
        "translation": "Vui lòng xác nhận đã phân bổ nguồn lực cần thiết chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-11-07",
        "hanzi": "确认",
        "pinyin": "què rèn",
        "meaning": "xác nhận",
        "example": "请确认是否已经分配所需资源。",
        "translation": "Vui lòng xác nhận đã phân bổ nguồn lực cần thiết chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-11-08",
        "hanzi": "交接",
        "pinyin": "jiāo jiē",
        "meaning": "bàn giao",
        "example": "可以马上完成任务交接吗？",
        "translation": "Có thể hoàn tất bàn giao nhiệm vụ ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-11-09",
        "hanzi": "联系窗口",
        "pinyin": "lián xì chuāng kǒu",
        "meaning": "đầu mối liên hệ",
        "example": "完成指定联系窗口后请通知我。",
        "translation": "Sau khi hoàn thành việc chỉ định đầu mối liên hệ, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-11-10",
        "hanzi": "名单",
        "pinyin": "míng dān",
        "meaning": "danh sách",
        "example": "请及时更新负责人名单。",
        "translation": "Vui lòng cập nhật danh sách người phụ trách kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先明确团队分工。",
          "pinyin": "Wǒ men xiān míng què tuán duì fēn gōng.",
          "translation": "Trước tiên, chúng ta làm rõ phân công nhóm."
        },
        {
          "speaker": "B",
          "hanzi": "请指派具体任务。",
          "pinyin": "Qǐng zhǐ pài jù tǐ rèn wù.",
          "translation": "Vui lòng giao nhiệm vụ cụ thể."
        },
        {
          "speaker": "A",
          "hanzi": "我会确定主要负责人。",
          "pinyin": "Wǒ huì què dìng zhǔ yào fù zé rén.",
          "translation": "Tôi sẽ xác định người phụ trách chính."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要安排任务协助者。",
          "pinyin": "Xiàn zài xū yào ān pái rèn wù xié zhù zhě.",
          "translation": "Bây giờ cần sắp xếp người hỗ trợ nhiệm vụ."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在说明各自职责。",
          "pinyin": "Wǒ men zhèng zài shuō míng gè zì zhí zé.",
          "translation": "Chúng tôi đang nêu trách nhiệm từng người."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经分配所需资源。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng fēn pèi suǒ xū zī yuán.",
          "translation": "Vui lòng xác nhận đã phân bổ nguồn lực cần thiết chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要确认接受分工。",
          "pinyin": "Jīn tiān yào què rèn jiē shòu fēn gōng.",
          "translation": "Hôm nay cần xác nhận nhận phân công."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上完成任务交接吗？",
          "pinyin": "Kě yǐ mǎ shàng wán chéng rèn wù jiāo jiē ma?",
          "translation": "Có thể hoàn tất bàn giao nhiệm vụ ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成指定联系窗口后请通知我。",
          "pinyin": "Wán chéng zhǐ dìng lián xì chuāng kǒu hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc chỉ định đầu mối liên hệ, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时更新负责人名单。",
          "pinyin": "Qǐng jí shí gēng xīn fù zé rén míng dān.",
          "translation": "Vui lòng cập nhật danh sách người phụ trách kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "明确团队分工",
          "pinyin": "míng què tuán duì fēn gōng",
          "translation": "làm rõ phân công nhóm"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "指派具体任务",
          "pinyin": "zhǐ pài jù tǐ rèn wù",
          "translation": "giao nhiệm vụ cụ thể"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "确定主要负责人",
          "pinyin": "què dìng zhǔ yào fù zé rén",
          "translation": "xác định người phụ trách chính"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "安排任务协助者",
          "pinyin": "ān pái rèn wù xié zhù zhě",
          "translation": "sắp xếp người hỗ trợ nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "说明各自职责",
          "pinyin": "shuō míng gè zì zhí zé",
          "translation": "nêu trách nhiệm từng người"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "分配所需资源",
          "pinyin": "fēn pèi suǒ xū zī yuán",
          "translation": "phân bổ nguồn lực cần thiết"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "确认接受分工",
          "pinyin": "què rèn jiē shòu fēn gōng",
          "translation": "xác nhận nhận phân công"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "完成任务交接",
          "pinyin": "wán chéng rèn wù jiāo jiē",
          "translation": "hoàn tất bàn giao nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "指定联系窗口",
          "pinyin": "zhǐ dìng lián xì chuāng kǒu",
          "translation": "chỉ định đầu mối liên hệ"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "更新负责人名单",
          "pinyin": "gēng xīn fù zé rén míng dān",
          "translation": "cập nhật danh sách người phụ trách"
        }
      ],
      "notes": [
        {
          "title": "Chịu trách nhiệm và hỗ trợ",
          "pattern": "A 负责……，B 配合……",
          "explanation": "Mẫu này phân biệt vai trò chính và vai trò hỗ trợ."
        },
        {
          "title": "Một đầu mối rõ",
          "pattern": "指定对接人",
          "explanation": "Đầu mối không thay thế trách nhiệm của nhóm nhưng giúp luồng thông tin nhất quán."
        }
      ]
    }
  },
  {
    "moduleSlug": "hieu-viec-va-phoi-hop",
    "slug": "kiem-tra-hieu-viec-va-phoi-hop",
    "title": "Kiểm tra Hiểu việc và phối hợp",
    "summary": "Thực hành kiểm tra hiểu việc và phối hợp bằng tiếng Trung trong môi trường công sở.",
    "situation": "Đánh giá cuối module 2",
    "estimatedMinutes": 15,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-12-01",
        "hanzi": "指令",
        "pinyin": "zhǐ lìng",
        "meaning": "chỉ thị",
        "example": "我们先准确理解指令。",
        "translation": "Trước tiên, chúng ta hiểu chính xác chỉ thị.",
        "audioUrl": null
      },
      {
        "slug": "core-12-02",
        "hanzi": "目标",
        "pinyin": "mù biāo",
        "meaning": "mục tiêu",
        "example": "请复述工作目标。",
        "translation": "Vui lòng nhắc lại mục tiêu công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-12-03",
        "hanzi": "范围",
        "pinyin": "fàn wéi",
        "meaning": "phạm vi",
        "example": "我会确认任务范围。",
        "translation": "Tôi sẽ xác nhận phạm vi nhiệm vụ.",
        "audioUrl": null
      },
      {
        "slug": "core-12-04",
        "hanzi": "例外",
        "pinyin": "lì wài",
        "meaning": "ngoại lệ",
        "example": "现在需要识别特殊例外。",
        "translation": "Bây giờ cần nhận diện ngoại lệ đặc biệt.",
        "audioUrl": null
      },
      {
        "slug": "core-12-05",
        "hanzi": "优先级",
        "pinyin": "yōu xiān jí",
        "meaning": "ưu tiên",
        "example": "我们正在排列任务优先级。",
        "translation": "Chúng tôi đang sắp xếp ưu tiên nhiệm vụ.",
        "audioUrl": null
      },
      {
        "slug": "core-12-06",
        "hanzi": "分工",
        "pinyin": "fēn gōng",
        "meaning": "phân công",
        "example": "请确认是否已经完成小组分工。",
        "translation": "Vui lòng xác nhận đã hoàn thành phân công nhóm chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-12-07",
        "hanzi": "责任",
        "pinyin": "zé rèn",
        "meaning": "trách nhiệm",
        "example": "今天要确认个人责任。",
        "translation": "Hôm nay cần xác nhận trách nhiệm cá nhân.",
        "audioUrl": null
      },
      {
        "slug": "core-12-08",
        "hanzi": "资源",
        "pinyin": "zī yuán",
        "meaning": "nguồn lực",
        "example": "可以马上检查可用资源吗？",
        "translation": "Có thể kiểm tra nguồn lực sẵn có ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-12-09",
        "hanzi": "协作",
        "pinyin": "xié zuò",
        "meaning": "phối hợp",
        "example": "完成制定协作方式后请通知我。",
        "translation": "Sau khi hoàn thành việc xây dựng cách phối hợp, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-12-10",
        "hanzi": "总结",
        "pinyin": "zǒng jié",
        "meaning": "tổng kết",
        "example": "请及时总结任务安排。",
        "translation": "Vui lòng tổng kết sắp xếp nhiệm vụ kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先准确理解指令。",
          "pinyin": "Wǒ men xiān zhǔn què lǐ jiě zhǐ lìng.",
          "translation": "Trước tiên, chúng ta hiểu chính xác chỉ thị."
        },
        {
          "speaker": "B",
          "hanzi": "请复述工作目标。",
          "pinyin": "Qǐng fù shù gōng zuò mù biāo.",
          "translation": "Vui lòng nhắc lại mục tiêu công việc."
        },
        {
          "speaker": "A",
          "hanzi": "我会确认任务范围。",
          "pinyin": "Wǒ huì què rèn rèn wù fàn wéi.",
          "translation": "Tôi sẽ xác nhận phạm vi nhiệm vụ."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要识别特殊例外。",
          "pinyin": "Xiàn zài xū yào shí bié tè shū lì wài.",
          "translation": "Bây giờ cần nhận diện ngoại lệ đặc biệt."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在排列任务优先级。",
          "pinyin": "Wǒ men zhèng zài pái liè rèn wù yōu xiān jí.",
          "translation": "Chúng tôi đang sắp xếp ưu tiên nhiệm vụ."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经完成小组分工。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng wán chéng xiǎo zǔ fèn gōng.",
          "translation": "Vui lòng xác nhận đã hoàn thành phân công nhóm chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要确认个人责任。",
          "pinyin": "Jīn tiān yào què rèn gè rén zé rèn.",
          "translation": "Hôm nay cần xác nhận trách nhiệm cá nhân."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上检查可用资源吗？",
          "pinyin": "Kě yǐ mǎ shàng jiǎn chá kě yòng zī yuán ma?",
          "translation": "Có thể kiểm tra nguồn lực sẵn có ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成制定协作方式后请通知我。",
          "pinyin": "Wán chéng zhì dìng xié zuò fāng shì hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc xây dựng cách phối hợp, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时总结任务安排。",
          "pinyin": "Qǐng jí shí zǒng jié rèn wù ān pái.",
          "translation": "Vui lòng tổng kết sắp xếp nhiệm vụ kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "准确理解指令",
          "pinyin": "zhǔn què lǐ jiě zhǐ lìng",
          "translation": "hiểu chính xác chỉ thị"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "复述工作目标",
          "pinyin": "fù shù gōng zuò mù biāo",
          "translation": "nhắc lại mục tiêu công việc"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "确认任务范围",
          "pinyin": "què rèn rèn wù fàn wéi",
          "translation": "xác nhận phạm vi nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "识别特殊例外",
          "pinyin": "shí bié tè shū lì wài",
          "translation": "nhận diện ngoại lệ đặc biệt"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "排列任务优先级",
          "pinyin": "pái liè rèn wù yōu xiān jí",
          "translation": "sắp xếp ưu tiên nhiệm vụ"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "完成小组分工",
          "pinyin": "wán chéng xiǎo zǔ fèn gōng",
          "translation": "hoàn thành phân công nhóm"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "确认个人责任",
          "pinyin": "què rèn gè rén zé rèn",
          "translation": "xác nhận trách nhiệm cá nhân"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "检查可用资源",
          "pinyin": "jiǎn chá kě yòng zī yuán",
          "translation": "kiểm tra nguồn lực sẵn có"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "制定协作方式",
          "pinyin": "zhì dìng xié zuò fāng shì",
          "translation": "xây dựng cách phối hợp"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "总结任务安排",
          "pinyin": "zǒng jié rèn wù ān pái",
          "translation": "tổng kết sắp xếp nhiệm vụ"
        }
      ],
      "notes": [
        {
          "title": "Hạn cuối cụ thể",
          "pattern": "最晚 + 时间 + 完成",
          "explanation": "最晚 nêu mốc cuối cùng có thể chấp nhận."
        },
        {
          "title": "Thay đổi cần xác nhận",
          "pattern": "请书面确认变更",
          "explanation": "Các thay đổi quan trọng nên được lưu theo kênh và quy trình của tổ chức."
        }
      ],
      "challenge": {
        "title": "Kiểm tra hiểu việc & phối hợp",
        "description": "Đạt 4/5 câu để chuyển sang báo cáo và xử lý vấn đề.",
        "passScore": 4,
        "questions": [
          {
            "prompt": "任务目标 nghĩa là gì?",
            "options": [
              "Mục tiêu nhiệm vụ",
              "Người phụ trách",
              "Ngày nghỉ"
            ],
            "correctOption": 0,
            "explanation": "任务 là nhiệm vụ; 目标 là mục tiêu cần đạt."
          },
          {
            "prompt": "Khi có hai việc cùng gấp, nên hỏi thế nào?",
            "options": [
              "请问哪个任务优先？",
              "两个都不做。",
              "我随便选一个。"
            ],
            "correctOption": 0,
            "explanation": "Hỏi mức ưu tiên giúp quản lý xác nhận thứ tự thay vì nhân viên tự đoán."
          },
          {
            "prompt": "负责 và 配合 khác nhau thế nào?",
            "options": [
              "Chịu trách nhiệm chính và phối hợp hỗ trợ",
              "Bắt đầu và kết thúc",
              "Gửi và nhận"
            ],
            "correctOption": 0,
            "explanation": "负责 là chịu trách nhiệm; 配合 là phối hợp theo phân công."
          },
          {
            "prompt": "Câu nào xác nhận hạn chót?",
            "options": [
              "最晚周五下午完成，对吗？",
              "以后再完成。",
              "时间不重要。"
            ],
            "correctOption": 0,
            "explanation": "最晚 + thời điểm + 对吗 xác nhận mốc cuối cụ thể."
          },
          {
            "prompt": "Khi phạm vi chưa rõ, nên làm gì?",
            "options": [
              "Hỏi đầu ra, phạm vi và tiêu chuẩn",
              "Làm toàn bộ mọi thứ",
              "Chờ mà không thông báo"
            ],
            "correctOption": 0,
            "explanation": "Ba nhóm câu hỏi giúp giảm làm sai hoặc làm vượt phạm vi."
          }
        ]
      }
    }
  },
  {
    "moduleSlug": "bao-cao-va-xu-ly-van-de",
    "slug": "cap-nhat-tien-do-va-phan-tram-hoan-thanh",
    "title": "Cập nhật tiến độ và phần trăm hoàn thành",
    "summary": "Thực hành cập nhật tiến độ và phần trăm hoàn thành bằng tiếng Trung trong môi trường công sở.",
    "situation": "Quản lý hỏi trạng thái giữa ca",
    "estimatedMinutes": 13,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l13-jindu",
        "hanzi": "进度",
        "pinyin": "jìn dù",
        "meaning": "tiến độ",
        "example": "我们先汇报当前进度。",
        "translation": "Trước tiên, chúng ta báo cáo tiến độ hiện tại.",
        "audioUrl": null
      },
      {
        "slug": "core-13-02",
        "hanzi": "完成",
        "pinyin": "wán chéng",
        "meaning": "hoàn thành",
        "example": "请说明已经完成的工作。",
        "translation": "Vui lòng nêu công việc đã hoàn thành.",
        "audioUrl": null
      },
      {
        "slug": "core-13-03",
        "hanzi": "百分比",
        "pinyin": "bǎi fēn bǐ",
        "meaning": "phần trăm",
        "example": "我会报告完成百分比。",
        "translation": "Tôi sẽ báo phần trăm hoàn thành.",
        "audioUrl": null
      },
      {
        "slug": "core-13-04",
        "hanzi": "阶段",
        "pinyin": "jiē duàn",
        "meaning": "giai đoạn",
        "example": "现在需要确认当前阶段。",
        "translation": "Bây giờ cần xác nhận giai đoạn hiện tại.",
        "audioUrl": null
      },
      {
        "slug": "core-13-05",
        "hanzi": "里程碑",
        "pinyin": "lǐ chéng bēi",
        "meaning": "cột mốc",
        "example": "我们正在更新项目里程碑。",
        "translation": "Chúng tôi đang cập nhật cột mốc dự án.",
        "audioUrl": null
      },
      {
        "slug": "core-13-06",
        "hanzi": "剩余",
        "pinyin": "shèng yú",
        "meaning": "còn lại",
        "example": "请确认是否已经列出剩余任务。",
        "translation": "Vui lòng xác nhận đã liệt kê nhiệm vụ còn lại chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-13-07",
        "hanzi": "按时",
        "pinyin": "àn shí",
        "meaning": "đúng hạn",
        "example": "今天要确认能否按时完成。",
        "translation": "Hôm nay cần xác nhận có thể hoàn thành đúng hạn không.",
        "audioUrl": null
      },
      {
        "slug": "core-13-08",
        "hanzi": "提前",
        "pinyin": "tí qián",
        "meaning": "sớm",
        "example": "可以马上说明可能提前完成吗？",
        "translation": "Có thể nêu khả năng hoàn thành sớm ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-13-09",
        "hanzi": "延迟",
        "pinyin": "yán chí",
        "meaning": "chậm",
        "example": "完成预警进度延迟后请通知我。",
        "translation": "Sau khi hoàn thành việc cảnh báo tiến độ chậm, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-13-10",
        "hanzi": "更新",
        "pinyin": "gēng xīn",
        "meaning": "cập nhật",
        "example": "我们正在更新项目里程碑。",
        "translation": "Chúng tôi đang cập nhật cột mốc dự án.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先汇报当前进度。",
          "pinyin": "Wǒ men xiān huì bào dāng qián jìn dù.",
          "translation": "Trước tiên, chúng ta báo cáo tiến độ hiện tại."
        },
        {
          "speaker": "B",
          "hanzi": "请说明已经完成的工作。",
          "pinyin": "Qǐng shuō míng yǐ jīng wán chéng de gōng zuò.",
          "translation": "Vui lòng nêu công việc đã hoàn thành."
        },
        {
          "speaker": "A",
          "hanzi": "我会报告完成百分比。",
          "pinyin": "Wǒ huì bào gào wán chéng bǎi fēn bǐ.",
          "translation": "Tôi sẽ báo phần trăm hoàn thành."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要确认当前阶段。",
          "pinyin": "Xiàn zài xū yào què rèn dāng qián jiē duàn.",
          "translation": "Bây giờ cần xác nhận giai đoạn hiện tại."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在更新项目里程碑。",
          "pinyin": "Wǒ men zhèng zài gēng xīn xiàng mù lǐ chéng bēi.",
          "translation": "Chúng tôi đang cập nhật cột mốc dự án."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经列出剩余任务。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng liè chū shèng yú rèn wù.",
          "translation": "Vui lòng xác nhận đã liệt kê nhiệm vụ còn lại chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要确认能否按时完成。",
          "pinyin": "Jīn tiān yào què rèn néng fǒu àn shí wán chéng.",
          "translation": "Hôm nay cần xác nhận có thể hoàn thành đúng hạn không."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上说明可能提前完成吗？",
          "pinyin": "Kě yǐ mǎ shàng shuō míng kě néng tí qián wán chéng ma?",
          "translation": "Có thể nêu khả năng hoàn thành sớm ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成预警进度延迟后请通知我。",
          "pinyin": "Wán chéng yù jǐng jìn dù yán chí hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc cảnh báo tiến độ chậm, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时定期更新进度。",
          "pinyin": "Qǐng jí shí dìng qī gēng xīn jìn dù.",
          "translation": "Vui lòng cập nhật tiến độ định kỳ kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "汇报当前进度",
          "pinyin": "huì bào dāng qián jìn dù",
          "translation": "báo cáo tiến độ hiện tại"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "说明已经完成的工作",
          "pinyin": "shuō míng yǐ jīng wán chéng de gōng zuò",
          "translation": "nêu công việc đã hoàn thành"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "报告完成百分比",
          "pinyin": "bào gào wán chéng bǎi fēn bǐ",
          "translation": "báo phần trăm hoàn thành"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "确认当前阶段",
          "pinyin": "què rèn dāng qián jiē duàn",
          "translation": "xác nhận giai đoạn hiện tại"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "更新项目里程碑",
          "pinyin": "gēng xīn xiàng mù lǐ chéng bēi",
          "translation": "cập nhật cột mốc dự án"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "列出剩余任务",
          "pinyin": "liè chū shèng yú rèn wù",
          "translation": "liệt kê nhiệm vụ còn lại"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "确认能否按时完成",
          "pinyin": "què rèn néng fǒu àn shí wán chéng",
          "translation": "xác nhận có thể hoàn thành đúng hạn không"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "说明可能提前完成",
          "pinyin": "shuō míng kě néng tí qián wán chéng",
          "translation": "nêu khả năng hoàn thành sớm"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "预警进度延迟",
          "pinyin": "yù jǐng jìn dù yán chí",
          "translation": "cảnh báo tiến độ chậm"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "定期更新进度",
          "pinyin": "dìng qī gēng xīn jìn dù",
          "translation": "cập nhật tiến độ định kỳ"
        }
      ],
      "notes": [
        {
          "title": "Ba trạng thái",
          "pattern": "已经…… / 正在…… / 接下来……",
          "explanation": "Ba mẫu tạo một cập nhật có quá khứ, hiện tại và bước tiếp theo."
        },
        {
          "title": "Phần trăm cần căn cứ",
          "pattern": "完成率大约是……",
          "explanation": "Dùng 大约 khi tỷ lệ là ước tính; dùng số chính xác khi có hệ thống ghi nhận."
        }
      ]
    }
  },
  {
    "moduleSlug": "bao-cao-va-xu-ly-van-de",
    "slug": "bao-tro-ngai-va-anh-huong",
    "title": "Báo trở ngại và ảnh hưởng",
    "summary": "Thực hành báo trở ngại và ảnh hưởng bằng tiếng Trung trong môi trường công sở.",
    "situation": "Thiếu dữ liệu đầu vào",
    "estimatedMinutes": 14,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-14-01",
        "hanzi": "障碍",
        "pinyin": "zhàng ài",
        "meaning": "trở ngại",
        "example": "我们先报告当前障碍。",
        "translation": "Trước tiên, chúng ta báo trở ngại hiện tại.",
        "audioUrl": null
      },
      {
        "slug": "core-14-02",
        "hanzi": "问题",
        "pinyin": "wèn tí",
        "meaning": "vấn đề",
        "example": "请描述具体问题。",
        "translation": "Vui lòng mô tả vấn đề cụ thể.",
        "audioUrl": null
      },
      {
        "slug": "core-14-03",
        "hanzi": "原因",
        "pinyin": "yuán yīn",
        "meaning": "nguyên nhân",
        "example": "我会分析问题原因。",
        "translation": "Tôi sẽ phân tích nguyên nhân vấn đề.",
        "audioUrl": null
      },
      {
        "slug": "core-14-04",
        "hanzi": "影响",
        "pinyin": "yǐng xiǎng",
        "meaning": "ảnh hưởng",
        "example": "现在需要说明业务影响。",
        "translation": "Bây giờ cần nêu ảnh hưởng tới công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-14-05",
        "hanzi": "范围",
        "pinyin": "fàn wéi",
        "meaning": "phạm vi",
        "example": "我们正在评估影响范围。",
        "translation": "Chúng tôi đang đánh giá phạm vi ảnh hưởng.",
        "audioUrl": null
      },
      {
        "slug": "core-14-06",
        "hanzi": "时间",
        "pinyin": "shí jiān",
        "meaning": "thời gian",
        "example": "请确认是否已经估算延误时间。",
        "translation": "Vui lòng xác nhận đã ước tính thời gian chậm chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-l14-fengxian",
        "hanzi": "风险",
        "pinyin": "fēng xiǎn",
        "meaning": "rủi ro",
        "example": "今天要提示潜在风险。",
        "translation": "Hôm nay cần cảnh báo rủi ro tiềm ẩn.",
        "audioUrl": null
      },
      {
        "slug": "core-14-08",
        "hanzi": "依赖",
        "pinyin": "yī lài",
        "meaning": "phụ thuộc",
        "example": "可以马上说明外部依赖吗？",
        "translation": "Có thể nêu phụ thuộc bên ngoài ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-14-09",
        "hanzi": "阻塞",
        "pinyin": "zǔ sè",
        "meaning": "bị chặn",
        "example": "完成标记阻塞任务后请通知我。",
        "translation": "Sau khi hoàn thành việc đánh dấu nhiệm vụ bị chặn, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-14-10",
        "hanzi": "通知",
        "pinyin": "tōng zhī",
        "meaning": "thông báo",
        "example": "完成标记阻塞任务后请通知我。",
        "translation": "Sau khi hoàn thành việc đánh dấu nhiệm vụ bị chặn, vui lòng báo cho tôi.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先报告当前障碍。",
          "pinyin": "Wǒ men xiān bào gào dāng qián zhàng ài.",
          "translation": "Trước tiên, chúng ta báo trở ngại hiện tại."
        },
        {
          "speaker": "B",
          "hanzi": "请描述具体问题。",
          "pinyin": "Qǐng miáo shù jù tǐ wèn tí.",
          "translation": "Vui lòng mô tả vấn đề cụ thể."
        },
        {
          "speaker": "A",
          "hanzi": "我会分析问题原因。",
          "pinyin": "Wǒ huì fēn xī wèn tí yuán yīn.",
          "translation": "Tôi sẽ phân tích nguyên nhân vấn đề."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要说明业务影响。",
          "pinyin": "Xiàn zài xū yào shuō míng yè wù yǐng xiǎng.",
          "translation": "Bây giờ cần nêu ảnh hưởng tới công việc."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在评估影响范围。",
          "pinyin": "Wǒ men zhèng zài píng gū yǐng xiǎng fàn wéi.",
          "translation": "Chúng tôi đang đánh giá phạm vi ảnh hưởng."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经估算延误时间。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng gū suàn yán wù shí jiān.",
          "translation": "Vui lòng xác nhận đã ước tính thời gian chậm chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要提示潜在风险。",
          "pinyin": "Jīn tiān yào tí shì qián zài fēng xiǎn.",
          "translation": "Hôm nay cần cảnh báo rủi ro tiềm ẩn."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上说明外部依赖吗？",
          "pinyin": "Kě yǐ mǎ shàng shuō míng wài bù yī lài ma?",
          "translation": "Có thể nêu phụ thuộc bên ngoài ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成标记阻塞任务后请通知我。",
          "pinyin": "Wán chéng biāo jì zǔ sè rèn wù hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc đánh dấu nhiệm vụ bị chặn, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时及时通知相关人员。",
          "pinyin": "Qǐng jí shí jí shí tōng zhī xiāng guān rén yuán.",
          "translation": "Vui lòng thông báo kịp thời cho người liên quan kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "报告当前障碍",
          "pinyin": "bào gào dāng qián zhàng ài",
          "translation": "báo trở ngại hiện tại"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "描述具体问题",
          "pinyin": "miáo shù jù tǐ wèn tí",
          "translation": "mô tả vấn đề cụ thể"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "分析问题原因",
          "pinyin": "fēn xī wèn tí yuán yīn",
          "translation": "phân tích nguyên nhân vấn đề"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "说明业务影响",
          "pinyin": "shuō míng yè wù yǐng xiǎng",
          "translation": "nêu ảnh hưởng tới công việc"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "评估影响范围",
          "pinyin": "píng gū yǐng xiǎng fàn wéi",
          "translation": "đánh giá phạm vi ảnh hưởng"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "估算延误时间",
          "pinyin": "gū suàn yán wù shí jiān",
          "translation": "ước tính thời gian chậm"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "提示潜在风险",
          "pinyin": "tí shì qián zài fēng xiǎn",
          "translation": "cảnh báo rủi ro tiềm ẩn"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "说明外部依赖",
          "pinyin": "shuō míng wài bù yī lài",
          "translation": "nêu phụ thuộc bên ngoài"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "标记阻塞任务",
          "pinyin": "biāo jì zǔ sè rèn wù",
          "translation": "đánh dấu nhiệm vụ bị chặn"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "及时通知相关人员",
          "pinyin": "jí shí tōng zhī xiāng guān rén yuán",
          "translation": "thông báo kịp thời cho người liên quan"
        }
      ],
      "notes": [
        {
          "title": "Nêu quan hệ nguyên nhân",
          "pattern": "因为……，导致……",
          "explanation": "Cấu trúc nối nguyên nhân đã biết với ảnh hưởng quan sát được."
        },
        {
          "title": "Không suy đoán thành sự thật",
          "pattern": "可能影响……",
          "explanation": "Dùng 可能 khi ảnh hưởng chưa chắc chắn hoặc chưa được xác minh."
        }
      ]
    }
  },
  {
    "moduleSlug": "bao-cao-va-xu-ly-van-de",
    "slug": "xin-ho-tro-va-chuyen-cap",
    "title": "Xin hỗ trợ và chuyển cấp",
    "summary": "Thực hành xin hỗ trợ và chuyển cấp bằng tiếng Trung trong môi trường công sở.",
    "situation": "Vấn đề vượt phạm vi xử lý",
    "estimatedMinutes": 13,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-15-01",
        "hanzi": "支持",
        "pinyin": "zhī chí",
        "meaning": "hỗ trợ",
        "example": "我们先请求团队支持。",
        "translation": "Trước tiên, chúng ta yêu cầu nhóm hỗ trợ.",
        "audioUrl": null
      },
      {
        "slug": "core-l15-bangzhu",
        "hanzi": "帮助",
        "pinyin": "bāng zhù",
        "meaning": "giúp đỡ",
        "example": "请说明需要什么帮助。",
        "translation": "Vui lòng nêu cần giúp đỡ gì.",
        "audioUrl": null
      },
      {
        "slug": "core-15-03",
        "hanzi": "资源",
        "pinyin": "zī yuán",
        "meaning": "nguồn lực",
        "example": "我会申请额外资源。",
        "translation": "Tôi sẽ đề nghị thêm nguồn lực.",
        "audioUrl": null
      },
      {
        "slug": "core-l15-quanxian",
        "hanzi": "权限",
        "pinyin": "quán xiàn",
        "meaning": "quyền hạn",
        "example": "现在需要申请系统权限。",
        "translation": "Bây giờ cần đề nghị quyền truy cập hệ thống.",
        "audioUrl": null
      },
      {
        "slug": "core-15-05",
        "hanzi": "专家",
        "pinyin": "zhuān jiā",
        "meaning": "chuyên gia",
        "example": "我们正在邀请专家协助。",
        "translation": "Chúng tôi đang mời chuyên gia hỗ trợ.",
        "audioUrl": null
      },
      {
        "slug": "core-15-06",
        "hanzi": "升级",
        "pinyin": "shēng jí",
        "meaning": "chuyển cấp",
        "example": "请确认是否已经将问题升级处理。",
        "translation": "Vui lòng xác nhận đã chuyển cấp xử lý vấn đề chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-15-07",
        "hanzi": "主管",
        "pinyin": "zhǔ guǎn",
        "meaning": "quản lý",
        "example": "今天要向主管报告。",
        "translation": "Hôm nay cần báo cáo với quản lý.",
        "audioUrl": null
      },
      {
        "slug": "core-15-08",
        "hanzi": "紧急程度",
        "pinyin": "jǐn jí chéng dù",
        "meaning": "mức khẩn cấp",
        "example": "可以马上说明问题紧急程度吗？",
        "translation": "Có thể nêu mức độ khẩn cấp của vấn đề ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-15-09",
        "hanzi": "背景",
        "pinyin": "bèi jǐng",
        "meaning": "bối cảnh",
        "example": "完成提供完整背景后请通知我。",
        "translation": "Sau khi hoàn thành việc cung cấp đầy đủ bối cảnh, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-15-10",
        "hanzi": "期限",
        "pinyin": "qī xiàn",
        "meaning": "thời hạn",
        "example": "请及时明确需要支持的期限。",
        "translation": "Vui lòng làm rõ thời hạn cần hỗ trợ kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先请求团队支持。",
          "pinyin": "Wǒ men xiān qǐng qiú tuán duì zhī chí.",
          "translation": "Trước tiên, chúng ta yêu cầu nhóm hỗ trợ."
        },
        {
          "speaker": "B",
          "hanzi": "请说明需要什么帮助。",
          "pinyin": "Qǐng shuō míng xū yào shén me bāng zhù.",
          "translation": "Vui lòng nêu cần giúp đỡ gì."
        },
        {
          "speaker": "A",
          "hanzi": "我会申请额外资源。",
          "pinyin": "Wǒ huì shēn qǐng é wài zī yuán.",
          "translation": "Tôi sẽ đề nghị thêm nguồn lực."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要申请系统权限。",
          "pinyin": "Xiàn zài xū yào shēn qǐng xì tǒng quán xiàn.",
          "translation": "Bây giờ cần đề nghị quyền truy cập hệ thống."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在邀请专家协助。",
          "pinyin": "Wǒ men zhèng zài yāo qǐng zhuān jiā xié zhù.",
          "translation": "Chúng tôi đang mời chuyên gia hỗ trợ."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经将问题升级处理。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng jiāng wèn tí shēng jí chǔ lǐ.",
          "translation": "Vui lòng xác nhận đã chuyển cấp xử lý vấn đề chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要向主管报告。",
          "pinyin": "Jīn tiān yào xiàng zhǔ guǎn bào gào.",
          "translation": "Hôm nay cần báo cáo với quản lý."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上说明问题紧急程度吗？",
          "pinyin": "Kě yǐ mǎ shàng shuō míng wèn tí jǐn jí chéng dù ma?",
          "translation": "Có thể nêu mức độ khẩn cấp của vấn đề ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成提供完整背景后请通知我。",
          "pinyin": "Wán chéng tí gōng wán zhěng bèi jǐng hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc cung cấp đầy đủ bối cảnh, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时明确需要支持的期限。",
          "pinyin": "Qǐng jí shí míng què xū yào zhī chí de qī xiàn.",
          "translation": "Vui lòng làm rõ thời hạn cần hỗ trợ kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "请求团队支持",
          "pinyin": "qǐng qiú tuán duì zhī chí",
          "translation": "yêu cầu nhóm hỗ trợ"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "说明需要什么帮助",
          "pinyin": "shuō míng xū yào shén me bāng zhù",
          "translation": "nêu cần giúp đỡ gì"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "申请额外资源",
          "pinyin": "shēn qǐng é wài zī yuán",
          "translation": "đề nghị thêm nguồn lực"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "申请系统权限",
          "pinyin": "shēn qǐng xì tǒng quán xiàn",
          "translation": "đề nghị quyền truy cập hệ thống"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "邀请专家协助",
          "pinyin": "yāo qǐng zhuān jiā xié zhù",
          "translation": "mời chuyên gia hỗ trợ"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "将问题升级处理",
          "pinyin": "jiāng wèn tí shēng jí chǔ lǐ",
          "translation": "chuyển cấp xử lý vấn đề"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "向主管报告",
          "pinyin": "xiàng zhǔ guǎn bào gào",
          "translation": "báo cáo với quản lý"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "说明问题紧急程度",
          "pinyin": "shuō míng wèn tí jǐn jí chéng dù",
          "translation": "nêu mức độ khẩn cấp của vấn đề"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "提供完整背景",
          "pinyin": "tí gōng wán zhěng bèi jǐng",
          "translation": "cung cấp đầy đủ bối cảnh"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "明确需要支持的期限",
          "pinyin": "míng què xū yào zhī chí de qī xiàn",
          "translation": "làm rõ thời hạn cần hỗ trợ"
        }
      ],
      "notes": [
        {
          "title": "Xin hỗ trợ có bối cảnh",
          "pattern": "我已经……，现在需要……",
          "explanation": "Nêu phần đã thử giúp người hỗ trợ không phải lặp lại từ đầu."
        },
        {
          "title": "Chuyển đúng thẩm quyền",
          "pattern": "需要……批准 / 确认",
          "explanation": "Không tự xử lý các quyết định an toàn, tài chính, pháp lý hoặc hệ thống vượt quyền."
        }
      ]
    }
  },
  {
    "moduleSlug": "bao-cao-va-xu-ly-van-de",
    "slug": "nhan-loi-va-sua-sai",
    "title": "Nhận lỗi và sửa sai",
    "summary": "Thực hành nhận lỗi và sửa sai bằng tiếng Trung trong môi trường công sở.",
    "situation": "Gửi nhầm phiên bản tài liệu",
    "estimatedMinutes": 14,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l16-cuowu",
        "hanzi": "错误",
        "pinyin": "cuò wù",
        "meaning": "lỗi",
        "example": "我们先承认工作错误。",
        "translation": "Trước tiên, chúng ta thừa nhận lỗi công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-16-02",
        "hanzi": "责任",
        "pinyin": "zé rèn",
        "meaning": "trách nhiệm",
        "example": "请主动承担责任。",
        "translation": "Vui lòng chủ động chịu trách nhiệm.",
        "audioUrl": null
      },
      {
        "slug": "core-l16-daoqian",
        "hanzi": "道歉",
        "pinyin": "dào qiàn",
        "meaning": "xin lỗi",
        "example": "本课的重点词语是“道歉”。",
        "translation": "Từ trọng tâm của bài này là “xin lỗi”.",
        "audioUrl": null
      },
      {
        "slug": "core-16-04",
        "hanzi": "原因",
        "pinyin": "yuán yīn",
        "meaning": "nguyên nhân",
        "example": "现在需要说明错误原因。",
        "translation": "Bây giờ cần nêu nguyên nhân sai sót.",
        "audioUrl": null
      },
      {
        "slug": "core-16-05",
        "hanzi": "纠正",
        "pinyin": "jiū zhèng",
        "meaning": "sửa chữa",
        "example": "我们正在立即纠正错误。",
        "translation": "Chúng tôi đang sửa lỗi ngay.",
        "audioUrl": null
      },
      {
        "slug": "core-16-06",
        "hanzi": "补救",
        "pinyin": "bǔ jiù",
        "meaning": "khắc phục",
        "example": "请确认是否已经提出补救措施。",
        "translation": "Vui lòng xác nhận đã đưa ra biện pháp khắc phục chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-16-07",
        "hanzi": "影响",
        "pinyin": "yǐng xiǎng",
        "meaning": "ảnh hưởng",
        "example": "今天要检查错误影响。",
        "translation": "Hôm nay cần kiểm tra ảnh hưởng của lỗi.",
        "audioUrl": null
      },
      {
        "slug": "core-16-08",
        "hanzi": "通知",
        "pinyin": "tōng zhī",
        "meaning": "thông báo",
        "example": "可以马上通知受影响人员吗？",
        "translation": "Có thể thông báo người bị ảnh hưởng ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-16-09",
        "hanzi": "预防",
        "pinyin": "yù fáng",
        "meaning": "phòng ngừa",
        "example": "完成制定预防措施后请通知我。",
        "translation": "Sau khi hoàn thành việc xây dựng biện pháp phòng ngừa, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-16-10",
        "hanzi": "复盘",
        "pinyin": "fù pán",
        "meaning": "rà soát",
        "example": "请及时完成错误复盘。",
        "translation": "Vui lòng hoàn thành rà soát lỗi kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先承认工作错误。",
          "pinyin": "Wǒ men xiān chéng rèn gōng zuò cuò wù.",
          "translation": "Trước tiên, chúng ta thừa nhận lỗi công việc."
        },
        {
          "speaker": "B",
          "hanzi": "请主动承担责任。",
          "pinyin": "Qǐng zhǔ dòng chéng dān zé rèn.",
          "translation": "Vui lòng chủ động chịu trách nhiệm."
        },
        {
          "speaker": "A",
          "hanzi": "我会真诚表达歉意。",
          "pinyin": "Wǒ huì zhēn chéng biǎo dá qiàn yì.",
          "translation": "Tôi sẽ chân thành xin lỗi."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要说明错误原因。",
          "pinyin": "Xiàn zài xū yào shuō míng cuò wù yuán yīn.",
          "translation": "Bây giờ cần nêu nguyên nhân sai sót."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在立即纠正错误。",
          "pinyin": "Wǒ men zhèng zài lì jí jiū zhèng cuò wù.",
          "translation": "Chúng tôi đang sửa lỗi ngay."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经提出补救措施。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng tí chū bǔ jiù cuò shī.",
          "translation": "Vui lòng xác nhận đã đưa ra biện pháp khắc phục chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要检查错误影响。",
          "pinyin": "Jīn tiān yào jiǎn chá cuò wù yǐng xiǎng.",
          "translation": "Hôm nay cần kiểm tra ảnh hưởng của lỗi."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上通知受影响人员吗？",
          "pinyin": "Kě yǐ mǎ shàng tōng zhī shòu yǐng xiǎng rén yuán ma?",
          "translation": "Có thể thông báo người bị ảnh hưởng ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成制定预防措施后请通知我。",
          "pinyin": "Wán chéng zhì dìng yù fáng cuò shī hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc xây dựng biện pháp phòng ngừa, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时完成错误复盘。",
          "pinyin": "Qǐng jí shí wán chéng cuò wù fù pán.",
          "translation": "Vui lòng hoàn thành rà soát lỗi kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "承认工作错误",
          "pinyin": "chéng rèn gōng zuò cuò wù",
          "translation": "thừa nhận lỗi công việc"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "主动承担责任",
          "pinyin": "zhǔ dòng chéng dān zé rèn",
          "translation": "chủ động chịu trách nhiệm"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "真诚表达歉意",
          "pinyin": "zhēn chéng biǎo dá qiàn yì",
          "translation": "chân thành xin lỗi"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "说明错误原因",
          "pinyin": "shuō míng cuò wù yuán yīn",
          "translation": "nêu nguyên nhân sai sót"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "立即纠正错误",
          "pinyin": "lì jí jiū zhèng cuò wù",
          "translation": "sửa lỗi ngay"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "提出补救措施",
          "pinyin": "tí chū bǔ jiù cuò shī",
          "translation": "đưa ra biện pháp khắc phục"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "检查错误影响",
          "pinyin": "jiǎn chá cuò wù yǐng xiǎng",
          "translation": "kiểm tra ảnh hưởng của lỗi"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "通知受影响人员",
          "pinyin": "tōng zhī shòu yǐng xiǎng rén yuán",
          "translation": "thông báo người bị ảnh hưởng"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "制定预防措施",
          "pinyin": "zhì dìng yù fáng cuò shī",
          "translation": "xây dựng biện pháp phòng ngừa"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "完成错误复盘",
          "pinyin": "wán chéng cuò wù fù pán",
          "translation": "hoàn thành rà soát lỗi"
        }
      ],
      "notes": [
        {
          "title": "Xin lỗi có hành động",
          "pattern": "很抱歉 + 具体错误 + 立即更正",
          "explanation": "Một lời xin lỗi công việc cần nói lỗi gì và sẽ sửa thế nào."
        },
        {
          "title": "Không che giấu ảnh hưởng",
          "pattern": "已经影响……",
          "explanation": "Báo trung thực dữ kiện đã xác minh và chuyển cấp khi lỗi có hậu quả nghiêm trọng."
        }
      ]
    }
  },
  {
    "moduleSlug": "bao-cao-va-xu-ly-van-de",
    "slug": "de-xuat-phuong-an-va-lua-chon-thay-the",
    "title": "Đề xuất phương án và lựa chọn thay thế",
    "summary": "Thực hành đề xuất phương án và lựa chọn thay thế bằng tiếng Trung trong môi trường công sở.",
    "situation": "Kế hoạch ban đầu không còn khả thi",
    "estimatedMinutes": 14,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l17-fangan",
        "hanzi": "方案",
        "pinyin": "fāng àn",
        "meaning": "phương án",
        "example": "我们先提出解决方案。",
        "translation": "Trước tiên, chúng ta đề xuất phương án giải quyết.",
        "audioUrl": null
      },
      {
        "slug": "core-17-02",
        "hanzi": "选择",
        "pinyin": "xuǎn zé",
        "meaning": "lựa chọn",
        "example": "请提供多个选择。",
        "translation": "Vui lòng cung cấp nhiều lựa chọn.",
        "audioUrl": null
      },
      {
        "slug": "core-17-03",
        "hanzi": "替代",
        "pinyin": "tì dài",
        "meaning": "thay thế",
        "example": "我会寻找替代办法。",
        "translation": "Tôi sẽ tìm phương án thay thế.",
        "audioUrl": null
      },
      {
        "slug": "core-17-04",
        "hanzi": "优点",
        "pinyin": "yōu diǎn",
        "meaning": "ưu điểm",
        "example": "现在需要说明方案优点。",
        "translation": "Bây giờ cần nêu ưu điểm phương án.",
        "audioUrl": null
      },
      {
        "slug": "core-17-05",
        "hanzi": "缺点",
        "pinyin": "quē diǎn",
        "meaning": "nhược điểm",
        "example": "我们正在说明方案缺点。",
        "translation": "Chúng tôi đang nêu nhược điểm phương án.",
        "audioUrl": null
      },
      {
        "slug": "core-17-06",
        "hanzi": "成本",
        "pinyin": "chéng běn",
        "meaning": "chi phí",
        "example": "请确认是否已经比较实施成本。",
        "translation": "Vui lòng xác nhận đã so sánh chi phí thực hiện chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-17-07",
        "hanzi": "时间",
        "pinyin": "shí jiān",
        "meaning": "thời gian",
        "example": "今天要估算所需时间。",
        "translation": "Hôm nay cần ước tính thời gian cần thiết.",
        "audioUrl": null
      },
      {
        "slug": "core-17-08",
        "hanzi": "风险",
        "pinyin": "fēng xiǎn",
        "meaning": "rủi ro",
        "example": "可以马上评估方案风险吗？",
        "translation": "Có thể đánh giá rủi ro phương án ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-l17-jianyi",
        "hanzi": "建议",
        "pinyin": "jiàn yì",
        "meaning": "đề nghị",
        "example": "完成给出推荐建议后请通知我。",
        "translation": "Sau khi hoàn thành việc đưa ra đề nghị khuyến nghị, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-17-10",
        "hanzi": "决定",
        "pinyin": "jué dìng",
        "meaning": "quyết định",
        "example": "请及时请求确认最终决定。",
        "translation": "Vui lòng yêu cầu xác nhận quyết định cuối cùng kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先提出解决方案。",
          "pinyin": "Wǒ men xiān tí chū jiě jué fāng àn.",
          "translation": "Trước tiên, chúng ta đề xuất phương án giải quyết."
        },
        {
          "speaker": "B",
          "hanzi": "请提供多个选择。",
          "pinyin": "Qǐng tí gōng duō gè xuǎn zé.",
          "translation": "Vui lòng cung cấp nhiều lựa chọn."
        },
        {
          "speaker": "A",
          "hanzi": "我会寻找替代办法。",
          "pinyin": "Wǒ huì xún zhǎo tì dài bàn fǎ.",
          "translation": "Tôi sẽ tìm phương án thay thế."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要说明方案优点。",
          "pinyin": "Xiàn zài xū yào shuō míng fāng àn yōu diǎn.",
          "translation": "Bây giờ cần nêu ưu điểm phương án."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在说明方案缺点。",
          "pinyin": "Wǒ men zhèng zài shuō míng fāng àn quē diǎn.",
          "translation": "Chúng tôi đang nêu nhược điểm phương án."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经比较实施成本。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng bǐ jiào shí shī chéng běn.",
          "translation": "Vui lòng xác nhận đã so sánh chi phí thực hiện chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要估算所需时间。",
          "pinyin": "Jīn tiān yào gū suàn suǒ xū shí jiān.",
          "translation": "Hôm nay cần ước tính thời gian cần thiết."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上评估方案风险吗？",
          "pinyin": "Kě yǐ mǎ shàng píng gū fāng àn fēng xiǎn ma?",
          "translation": "Có thể đánh giá rủi ro phương án ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成给出推荐建议后请通知我。",
          "pinyin": "Wán chéng gěi chū tuī jiàn jiàn yì hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc đưa ra đề nghị khuyến nghị, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时请求确认最终决定。",
          "pinyin": "Qǐng jí shí qǐng qiú què rèn zuì zhōng jué dìng.",
          "translation": "Vui lòng yêu cầu xác nhận quyết định cuối cùng kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "提出解决方案",
          "pinyin": "tí chū jiě jué fāng àn",
          "translation": "đề xuất phương án giải quyết"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "提供多个选择",
          "pinyin": "tí gōng duō gè xuǎn zé",
          "translation": "cung cấp nhiều lựa chọn"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "寻找替代办法",
          "pinyin": "xún zhǎo tì dài bàn fǎ",
          "translation": "tìm phương án thay thế"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "说明方案优点",
          "pinyin": "shuō míng fāng àn yōu diǎn",
          "translation": "nêu ưu điểm phương án"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "说明方案缺点",
          "pinyin": "shuō míng fāng àn quē diǎn",
          "translation": "nêu nhược điểm phương án"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "比较实施成本",
          "pinyin": "bǐ jiào shí shī chéng běn",
          "translation": "so sánh chi phí thực hiện"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "估算所需时间",
          "pinyin": "gū suàn suǒ xū shí jiān",
          "translation": "ước tính thời gian cần thiết"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "评估方案风险",
          "pinyin": "píng gū fāng àn fēng xiǎn",
          "translation": "đánh giá rủi ro phương án"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "给出推荐建议",
          "pinyin": "gěi chū tuī jiàn jiàn yì",
          "translation": "đưa ra đề nghị khuyến nghị"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "请求确认最终决定",
          "pinyin": "qǐng qiú què rèn zuì zhōng jué dìng",
          "translation": "yêu cầu xác nhận quyết định cuối cùng"
        }
      ],
      "notes": [
        {
          "title": "Đề xuất có lý do",
          "pattern": "我建议……，因为……",
          "explanation": "Vế 因为 giúp người nghe đánh giá căn cứ của đề xuất."
        },
        {
          "title": "Không giấu đánh đổi",
          "pattern": "优点是……，缺点是……",
          "explanation": "Nêu cả hai phía giúp quyết định minh bạch hơn."
        }
      ]
    }
  },
  {
    "moduleSlug": "bao-cao-va-xu-ly-van-de",
    "slug": "kiem-tra-bao-cao-va-xu-ly-van-de",
    "title": "Kiểm tra Báo cáo và xử lý vấn đề",
    "summary": "Thực hành kiểm tra báo cáo và xử lý vấn đề bằng tiếng Trung trong môi trường công sở.",
    "situation": "Đánh giá cuối module 3",
    "estimatedMinutes": 15,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l18-huibao",
        "hanzi": "汇报",
        "pinyin": "huì bào",
        "meaning": "báo cáo",
        "example": "我们先进行简短汇报。",
        "translation": "Trước tiên, chúng ta thực hiện báo cáo ngắn.",
        "audioUrl": null
      },
      {
        "slug": "core-18-02",
        "hanzi": "数据",
        "pinyin": "shù jù",
        "meaning": "số liệu",
        "example": "请提供准确数据。",
        "translation": "Vui lòng cung cấp số liệu chính xác.",
        "audioUrl": null
      },
      {
        "slug": "core-18-03",
        "hanzi": "进度",
        "pinyin": "jìn dù",
        "meaning": "tiến độ",
        "example": "我会说明完成进度。",
        "translation": "Tôi sẽ nêu tiến độ hoàn thành.",
        "audioUrl": null
      },
      {
        "slug": "core-18-04",
        "hanzi": "障碍",
        "pinyin": "zhàng ài",
        "meaning": "trở ngại",
        "example": "现在需要指出主要障碍。",
        "translation": "Bây giờ cần chỉ ra trở ngại chính.",
        "audioUrl": null
      },
      {
        "slug": "core-18-05",
        "hanzi": "影响",
        "pinyin": "yǐng xiǎng",
        "meaning": "ảnh hưởng",
        "example": "我们正在分析实际影响。",
        "translation": "Chúng tôi đang phân tích ảnh hưởng thực tế.",
        "audioUrl": null
      },
      {
        "slug": "core-18-06",
        "hanzi": "求助",
        "pinyin": "qiú zhù",
        "meaning": "yêu cầu giúp đỡ",
        "example": "请确认是否已经清楚提出求助。",
        "translation": "Vui lòng xác nhận đã nêu yêu cầu giúp đỡ rõ ràng chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-18-07",
        "hanzi": "责任",
        "pinyin": "zé rèn",
        "meaning": "trách nhiệm",
        "example": "今天要正确承担责任。",
        "translation": "Hôm nay cần nhận trách nhiệm đúng.",
        "audioUrl": null
      },
      {
        "slug": "core-18-08",
        "hanzi": "方案",
        "pinyin": "fāng àn",
        "meaning": "phương án",
        "example": "可以马上比较解决方案吗？",
        "translation": "Có thể so sánh các phương án ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-18-09",
        "hanzi": "行动",
        "pinyin": "xíng dòng",
        "meaning": "hành động",
        "example": "完成确认下一步行动后请通知我。",
        "translation": "Sau khi hoàn thành việc xác nhận hành động tiếp theo, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-18-10",
        "hanzi": "时间点",
        "pinyin": "shí jiān diǎn",
        "meaning": "mốc thời gian",
        "example": "本课的重点词语是“时间点”。",
        "translation": "Từ trọng tâm của bài này là “mốc thời gian”.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先进行简短汇报。",
          "pinyin": "Wǒ men xiān jìn xíng jiǎn duǎn huì bào.",
          "translation": "Trước tiên, chúng ta thực hiện báo cáo ngắn."
        },
        {
          "speaker": "B",
          "hanzi": "请提供准确数据。",
          "pinyin": "Qǐng tí gōng zhǔn què shù jù.",
          "translation": "Vui lòng cung cấp số liệu chính xác."
        },
        {
          "speaker": "A",
          "hanzi": "我会说明完成进度。",
          "pinyin": "Wǒ huì shuō míng wán chéng jìn dù.",
          "translation": "Tôi sẽ nêu tiến độ hoàn thành."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要指出主要障碍。",
          "pinyin": "Xiàn zài xū yào zhǐ chū zhǔ yào zhàng ài.",
          "translation": "Bây giờ cần chỉ ra trở ngại chính."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在分析实际影响。",
          "pinyin": "Wǒ men zhèng zài fēn xī shí jì yǐng xiǎng.",
          "translation": "Chúng tôi đang phân tích ảnh hưởng thực tế."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经清楚提出求助。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng qīng chǔ tí chū qiú zhù.",
          "translation": "Vui lòng xác nhận đã nêu yêu cầu giúp đỡ rõ ràng chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要正确承担责任。",
          "pinyin": "Jīn tiān yào zhèng què chéng dān zé rèn.",
          "translation": "Hôm nay cần nhận trách nhiệm đúng."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上比较解决方案吗？",
          "pinyin": "Kě yǐ mǎ shàng bǐ jiào jiě jué fāng àn ma?",
          "translation": "Có thể so sánh các phương án ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成确认下一步行动后请通知我。",
          "pinyin": "Wán chéng què rèn xià yī bù xíng dòng hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc xác nhận hành động tiếp theo, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时约定下次更新时间。",
          "pinyin": "Qǐng jí shí yuē dìng xià cì gēng xīn shí jiān.",
          "translation": "Vui lòng hẹn mốc cập nhật tiếp theo kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "进行简短汇报",
          "pinyin": "jìn xíng jiǎn duǎn huì bào",
          "translation": "thực hiện báo cáo ngắn"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "提供准确数据",
          "pinyin": "tí gōng zhǔn què shù jù",
          "translation": "cung cấp số liệu chính xác"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "说明完成进度",
          "pinyin": "shuō míng wán chéng jìn dù",
          "translation": "nêu tiến độ hoàn thành"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "指出主要障碍",
          "pinyin": "zhǐ chū zhǔ yào zhàng ài",
          "translation": "chỉ ra trở ngại chính"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "分析实际影响",
          "pinyin": "fēn xī shí jì yǐng xiǎng",
          "translation": "phân tích ảnh hưởng thực tế"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "清楚提出求助",
          "pinyin": "qīng chǔ tí chū qiú zhù",
          "translation": "nêu yêu cầu giúp đỡ rõ ràng"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "正确承担责任",
          "pinyin": "zhèng què chéng dān zé rèn",
          "translation": "nhận trách nhiệm đúng"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "比较解决方案",
          "pinyin": "bǐ jiào jiě jué fāng àn",
          "translation": "so sánh các phương án"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "确认下一步行动",
          "pinyin": "què rèn xià yī bù xíng dòng",
          "translation": "xác nhận hành động tiếp theo"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "约定下次更新时间",
          "pinyin": "yuē dìng xià cì gēng xīn shí jiān",
          "translation": "hẹn mốc cập nhật tiếp theo"
        }
      ],
      "notes": [
        {
          "title": "Cấu trúc báo vấn đề",
          "pattern": "现状 + 影响 + 行动 + 下一步",
          "explanation": "Bốn phần giữ báo cáo ngắn nhưng đủ để quyết định."
        },
        {
          "title": "Khép kín không chỉ là sửa xong",
          "pattern": "处理结果 + 预防措施",
          "explanation": "Cần ghi kết quả và cách giảm khả năng lặp lại."
        }
      ],
      "challenge": {
        "title": "Kiểm tra báo cáo & xử lý vấn đề",
        "description": "Đạt 4/5 câu để chuyển sang giao tiếp đa kênh.",
        "passScore": 4,
        "questions": [
          {
            "prompt": "目前完成了百分之七十 nghĩa là gì?",
            "options": [
              "Hiện đã hoàn thành 70%",
              "Còn 70% chưa làm",
              "Kế hoạch tăng 70%"
            ],
            "correctOption": 0,
            "explanation": "目前 chỉ hiện tại; 完成了 cho biết phần việc đã hoàn thành."
          },
          {
            "prompt": "遇到阻碍时 nên báo điều gì?",
            "options": [
              "Vấn đề, ảnh hưởng và hỗ trợ cần thiết",
              "Chỉ nói có vấn đề",
              "Đợi đến khi trễ hạn"
            ],
            "correctOption": 0,
            "explanation": "Báo đủ ba phần giúp người nhận quyết định nhanh hơn."
          },
          {
            "prompt": "Khi chưa đủ thẩm quyền, câu nào phù hợp?",
            "options": [
              "这个情况需要请负责人确认。",
              "我自己决定就行。",
              "不用告诉任何人。"
            ],
            "correctOption": 0,
            "explanation": "Chuyển người phụ trách xác nhận giúp giữ đúng phạm vi trách nhiệm."
          },
          {
            "prompt": "Phát hiện mình gửi sai tệp. Nên phản hồi thế nào?",
            "options": [
              "很抱歉，我发错文件了，现在马上更正。",
              "不是我的问题。",
              "以后再说。"
            ],
            "correctOption": 0,
            "explanation": "Câu này nhận lỗi cụ thể và nêu hành động sửa ngay."
          },
          {
            "prompt": "备选方案 dùng để chỉ gì?",
            "options": [
              "Phương án thay thế",
              "Bản ghi cuộc gọi",
              "Tiêu chuẩn kiểm tra"
            ],
            "correctOption": 0,
            "explanation": "备选 là dự phòng; 方案 là phương án."
          }
        ]
      }
    }
  },
  {
    "moduleSlug": "giao-tiep-da-kenh",
    "slug": "nhan-tin-cong-viec-ro-rang",
    "title": "Nhắn tin công việc rõ ràng",
    "summary": "Thực hành nhắn tin công việc rõ ràng bằng tiếng Trung trong môi trường công sở.",
    "situation": "Gửi yêu cầu trong nhóm chat",
    "estimatedMinutes": 12,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l19-xiaoxi",
        "hanzi": "消息",
        "pinyin": "xiāo xī",
        "meaning": "tin nhắn",
        "example": "我们先发送工作消息。",
        "translation": "Trước tiên, chúng ta gửi tin nhắn công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-19-02",
        "hanzi": "主题",
        "pinyin": "zhǔ tí",
        "meaning": "chủ đề",
        "example": "请写清消息主题。",
        "translation": "Vui lòng viết rõ chủ đề tin nhắn.",
        "audioUrl": null
      },
      {
        "slug": "core-19-03",
        "hanzi": "目的",
        "pinyin": "mù dì",
        "meaning": "mục đích",
        "example": "我会开头说明目的。",
        "translation": "Tôi sẽ nêu mục đích ở đầu.",
        "audioUrl": null
      },
      {
        "slug": "core-l19-beijing",
        "hanzi": "背景",
        "pinyin": "bèi jǐng",
        "meaning": "bối cảnh",
        "example": "现在需要补充必要背景。",
        "translation": "Bây giờ cần bổ sung bối cảnh cần thiết.",
        "audioUrl": null
      },
      {
        "slug": "core-19-05",
        "hanzi": "要点",
        "pinyin": "yào diǎn",
        "meaning": "ý chính",
        "example": "本课的重点词语是“要点”。",
        "translation": "Từ trọng tâm của bài này là “ý chính”.",
        "audioUrl": null
      },
      {
        "slug": "core-19-06",
        "hanzi": "行动项",
        "pinyin": "xíng dòng xiàng",
        "meaning": "đầu việc",
        "example": "本课的重点词语是“行动项”。",
        "translation": "Từ trọng tâm của bài này là “đầu việc”.",
        "audioUrl": null
      },
      {
        "slug": "core-19-07",
        "hanzi": "截止时间",
        "pinyin": "jié zhǐ shí jiān",
        "meaning": "hạn chót",
        "example": "本课的重点词语是“截止时间”。",
        "translation": "Từ trọng tâm của bài này là “hạn chót”.",
        "audioUrl": null
      },
      {
        "slug": "core-19-08",
        "hanzi": "附件",
        "pinyin": "fù jiàn",
        "meaning": "tệp đính kèm",
        "example": "可以马上确认添加附件吗？",
        "translation": "Có thể xác nhận đã thêm tệp đính kèm ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-19-09",
        "hanzi": "语气",
        "pinyin": "yǔ qì",
        "meaning": "giọng điệu",
        "example": "完成保持礼貌语气后请通知我。",
        "translation": "Sau khi hoàn thành việc giữ giọng điệu lịch sự, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-l19-huifu",
        "hanzi": "回复",
        "pinyin": "huí fù",
        "meaning": "phản hồi",
        "example": "今天要注明回复期限。",
        "translation": "Hôm nay cần ghi rõ hạn phản hồi.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先发送工作消息。",
          "pinyin": "Wǒ men xiān fā sòng gōng zuò xiāo xī.",
          "translation": "Trước tiên, chúng ta gửi tin nhắn công việc."
        },
        {
          "speaker": "B",
          "hanzi": "请写清消息主题。",
          "pinyin": "Qǐng xiě qīng xiāo xī zhǔ tí.",
          "translation": "Vui lòng viết rõ chủ đề tin nhắn."
        },
        {
          "speaker": "A",
          "hanzi": "我会开头说明目的。",
          "pinyin": "Wǒ huì kāi tóu shuō míng mù dì.",
          "translation": "Tôi sẽ nêu mục đích ở đầu."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要补充必要背景。",
          "pinyin": "Xiàn zài xū yào bǔ chōng bì yào bèi jǐng.",
          "translation": "Bây giờ cần bổ sung bối cảnh cần thiết."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在列出关键信息。",
          "pinyin": "Wǒ men zhèng zài liè chū guān jiàn xìn xī.",
          "translation": "Chúng tôi đang liệt kê thông tin chính."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经明确需要的行动。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng míng què xū yào de xíng dòng.",
          "translation": "Vui lòng xác nhận đã làm rõ hành động cần thiết chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要注明回复期限。",
          "pinyin": "Jīn tiān yào zhù míng huí fù qī xiàn.",
          "translation": "Hôm nay cần ghi rõ hạn phản hồi."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上确认添加附件吗？",
          "pinyin": "Kě yǐ mǎ shàng què rèn tiān jiā fù jiàn ma?",
          "translation": "Có thể xác nhận đã thêm tệp đính kèm ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成保持礼貌语气后请通知我。",
          "pinyin": "Wán chéng bǎo chí lǐ mào yǔ qì hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc giữ giọng điệu lịch sự, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时请求确认收到。",
          "pinyin": "Qǐng jí shí qǐng qiú què rèn shōu dào.",
          "translation": "Vui lòng yêu cầu xác nhận đã nhận kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "发送工作消息",
          "pinyin": "fā sòng gōng zuò xiāo xī",
          "translation": "gửi tin nhắn công việc"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "写清消息主题",
          "pinyin": "xiě qīng xiāo xī zhǔ tí",
          "translation": "viết rõ chủ đề tin nhắn"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "开头说明目的",
          "pinyin": "kāi tóu shuō míng mù dì",
          "translation": "nêu mục đích ở đầu"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "补充必要背景",
          "pinyin": "bǔ chōng bì yào bèi jǐng",
          "translation": "bổ sung bối cảnh cần thiết"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "列出关键信息",
          "pinyin": "liè chū guān jiàn xìn xī",
          "translation": "liệt kê thông tin chính"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "明确需要的行动",
          "pinyin": "míng què xū yào de xíng dòng",
          "translation": "làm rõ hành động cần thiết"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "注明回复期限",
          "pinyin": "zhù míng huí fù qī xiàn",
          "translation": "ghi rõ hạn phản hồi"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "确认添加附件",
          "pinyin": "què rèn tiān jiā fù jiàn",
          "translation": "xác nhận đã thêm tệp đính kèm"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "保持礼貌语气",
          "pinyin": "bǎo chí lǐ mào yǔ qì",
          "translation": "giữ giọng điệu lịch sự"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "请求确认收到",
          "pinyin": "qǐng qiú què rèn shōu dào",
          "translation": "yêu cầu xác nhận đã nhận"
        }
      ],
      "notes": [
        {
          "title": "Tin nhắn ba phần",
          "pattern": "背景 + 请求 + 截止时间",
          "explanation": "Một tin ngắn vẫn cần đủ bối cảnh, hành động và mốc."
        },
        {
          "title": "Không làm ồn cả nhóm",
          "pattern": "提醒相关人",
          "explanation": "Chỉ nhắc người cần tham gia và dùng kênh riêng cho dữ liệu nhạy cảm."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-da-kenh",
    "slug": "goi-dien-va-hop-truc-tuyen",
    "title": "Gọi điện và họp trực tuyến",
    "summary": "Thực hành gọi điện và họp trực tuyến bằng tiếng Trung trong môi trường công sở.",
    "situation": "Gọi nhanh cho một nhóm ở xa",
    "estimatedMinutes": 13,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l20-dianhua",
        "hanzi": "电话",
        "pinyin": "diàn huà",
        "meaning": "cuộc gọi",
        "example": "我们先拨打工作电话。",
        "translation": "Trước tiên, chúng ta gọi điện công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-20-02",
        "hanzi": "接听",
        "pinyin": "jiē tīng",
        "meaning": "nghe máy",
        "example": "请及时接听电话。",
        "translation": "Vui lòng nghe điện thoại kịp thời.",
        "audioUrl": null
      },
      {
        "slug": "core-20-03",
        "hanzi": "在线会议",
        "pinyin": "zài xiàn huì yì",
        "meaning": "họp trực tuyến",
        "example": "我会加入在线会议。",
        "translation": "Tôi sẽ tham gia họp trực tuyến.",
        "audioUrl": null
      },
      {
        "slug": "core-l20-maikefeng",
        "hanzi": "麦克风",
        "pinyin": "mài kè fēng",
        "meaning": "micro",
        "example": "现在需要检查麦克风状态。",
        "translation": "Bây giờ cần kiểm tra trạng thái micro.",
        "audioUrl": null
      },
      {
        "slug": "core-20-05",
        "hanzi": "摄像头",
        "pinyin": "shè xiàng tóu",
        "meaning": "camera",
        "example": "我们正在打开会议摄像头。",
        "translation": "Chúng tôi đang bật camera cuộc họp.",
        "audioUrl": null
      },
      {
        "slug": "core-20-06",
        "hanzi": "网络",
        "pinyin": "wǎng luò",
        "meaning": "mạng",
        "example": "请确认是否已经确认网络稳定。",
        "translation": "Vui lòng xác nhận đã xác nhận mạng ổn định chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-20-07",
        "hanzi": "静音",
        "pinyin": "jìng yīn",
        "meaning": "tắt tiếng",
        "example": "本课的重点词语是“静音”。",
        "translation": "Từ trọng tâm của bài này là “tắt tiếng”.",
        "audioUrl": null
      },
      {
        "slug": "core-20-08",
        "hanzi": "共享",
        "pinyin": "gòng xiǎng",
        "meaning": "chia sẻ",
        "example": "可以马上共享电脑屏幕吗？",
        "translation": "Có thể chia sẻ màn hình máy tính ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-20-09",
        "hanzi": "掉线",
        "pinyin": "diào xiàn",
        "meaning": "mất kết nối",
        "example": "完成说明刚才掉线后请通知我。",
        "translation": "Sau khi hoàn thành việc nói rằng vừa mất kết nối, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-20-10",
        "hanzi": "录制",
        "pinyin": "lù zhì",
        "meaning": "ghi hình",
        "example": "请及时征得同意后录制。",
        "translation": "Vui lòng ghi hình sau khi được đồng ý kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先拨打工作电话。",
          "pinyin": "Wǒ men xiān bō dǎ gōng zuò diàn huà.",
          "translation": "Trước tiên, chúng ta gọi điện công việc."
        },
        {
          "speaker": "B",
          "hanzi": "请及时接听电话。",
          "pinyin": "Qǐng jí shí jiē tīng diàn huà.",
          "translation": "Vui lòng nghe điện thoại kịp thời."
        },
        {
          "speaker": "A",
          "hanzi": "我会加入在线会议。",
          "pinyin": "Wǒ huì jiā rù zài xiàn huì yì.",
          "translation": "Tôi sẽ tham gia họp trực tuyến."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要检查麦克风状态。",
          "pinyin": "Xiàn zài xū yào jiǎn chá mài kè fēng zhuàng tài.",
          "translation": "Bây giờ cần kiểm tra trạng thái micro."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在打开会议摄像头。",
          "pinyin": "Wǒ men zhèng zài dǎ kāi huì yì shè xiàng tóu.",
          "translation": "Chúng tôi đang bật camera cuộc họp."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经确认网络稳定。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng què rèn wǎng luò wěn dìng.",
          "translation": "Vui lòng xác nhận đã xác nhận mạng ổn định chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要暂时关闭麦克风。",
          "pinyin": "Jīn tiān yào zàn shí guān bì mài kè fēng.",
          "translation": "Hôm nay cần tạm thời tắt micro."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上共享电脑屏幕吗？",
          "pinyin": "Kě yǐ mǎ shàng gòng xiǎng diàn nǎo píng mù ma?",
          "translation": "Có thể chia sẻ màn hình máy tính ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成说明刚才掉线后请通知我。",
          "pinyin": "Wán chéng shuō míng gāng cái diào xiàn hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc nói rằng vừa mất kết nối, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时征得同意后录制。",
          "pinyin": "Qǐng jí shí zhēng dé tóng yì hòu lù zhì.",
          "translation": "Vui lòng ghi hình sau khi được đồng ý kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "拨打工作电话",
          "pinyin": "bō dǎ gōng zuò diàn huà",
          "translation": "gọi điện công việc"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "及时接听电话",
          "pinyin": "jí shí jiē tīng diàn huà",
          "translation": "nghe điện thoại kịp thời"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "加入在线会议",
          "pinyin": "jiā rù zài xiàn huì yì",
          "translation": "tham gia họp trực tuyến"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "检查麦克风状态",
          "pinyin": "jiǎn chá mài kè fēng zhuàng tài",
          "translation": "kiểm tra trạng thái micro"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "打开会议摄像头",
          "pinyin": "dǎ kāi huì yì shè xiàng tóu",
          "translation": "bật camera cuộc họp"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "确认网络稳定",
          "pinyin": "què rèn wǎng luò wěn dìng",
          "translation": "xác nhận mạng ổn định"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "暂时关闭麦克风",
          "pinyin": "zàn shí guān bì mài kè fēng",
          "translation": "tạm thời tắt micro"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "共享电脑屏幕",
          "pinyin": "gòng xiǎng diàn nǎo píng mù",
          "translation": "chia sẻ màn hình máy tính"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "说明刚才掉线",
          "pinyin": "shuō míng gāng cái diào xiàn",
          "translation": "nói rằng vừa mất kết nối"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "征得同意后录制",
          "pinyin": "zhēng dé tóng yì hòu lù zhì",
          "translation": "ghi hình sau khi được đồng ý"
        }
      ],
      "notes": [
        {
          "title": "Xin phép trước cuộc gọi",
          "pattern": "现在方便说……分钟吗？",
          "explanation": "Nêu thời lượng giúp người nghe quyết định có thể trao đổi ngay không."
        },
        {
          "title": "Kết thúc có xác nhận",
          "pattern": "挂断前确认……",
          "explanation": "Chốt hành động và mốc phản hồi trước khi kết thúc."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-da-kenh",
    "slug": "phat-bieu-va-bo-sung-trong-cuoc-hop",
    "title": "Phát biểu và bổ sung trong cuộc họp",
    "summary": "Thực hành phát biểu và bổ sung trong cuộc họp bằng tiếng Trung trong môi trường công sở.",
    "situation": "Tham gia cuộc họp có nhiều bộ phận",
    "estimatedMinutes": 14,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-l21-fayan",
        "hanzi": "发言",
        "pinyin": "fā yán",
        "meaning": "phát biểu",
        "example": "我们先申请会议发言。",
        "translation": "Trước tiên, chúng ta đề nghị phát biểu trong cuộc họp.",
        "audioUrl": null
      },
      {
        "slug": "core-l21-guandian",
        "hanzi": "观点",
        "pinyin": "guān diǎn",
        "meaning": "quan điểm",
        "example": "请清楚表达观点。",
        "translation": "Vui lòng trình bày quan điểm rõ ràng.",
        "audioUrl": null
      },
      {
        "slug": "core-l21-buchong",
        "hanzi": "补充",
        "pinyin": "bǔ chōng",
        "meaning": "bổ sung",
        "example": "我会补充一个信息。",
        "translation": "Tôi sẽ bổ sung một thông tin.",
        "audioUrl": null
      },
      {
        "slug": "core-21-04",
        "hanzi": "同意",
        "pinyin": "tóng yì",
        "meaning": "đồng ý",
        "example": "现在需要表示同意意见。",
        "translation": "Bây giờ cần bày tỏ đồng ý với ý kiến.",
        "audioUrl": null
      },
      {
        "slug": "core-21-05",
        "hanzi": "问题",
        "pinyin": "wèn tí",
        "meaning": "câu hỏi",
        "example": "我们正在提出相关问题。",
        "translation": "Chúng tôi đang đặt câu hỏi liên quan.",
        "audioUrl": null
      },
      {
        "slug": "core-l21-daduan",
        "hanzi": "打断",
        "pinyin": "dǎ duàn",
        "meaning": "ngắt lời",
        "example": "请确认是否已经礼貌打断发言。",
        "translation": "Vui lòng xác nhận đã ngắt lời lịch sự chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-l21-zhongdian",
        "hanzi": "重点",
        "pinyin": "zhòng diǎn",
        "meaning": "trọng điểm",
        "example": "今天要强调讨论重点。",
        "translation": "Hôm nay cần nhấn mạnh trọng điểm thảo luận.",
        "audioUrl": null
      },
      {
        "slug": "core-21-08",
        "hanzi": "例子",
        "pinyin": "lì zi",
        "meaning": "ví dụ",
        "example": "可以马上提供具体例子吗？",
        "translation": "Có thể cung cấp ví dụ cụ thể ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-21-09",
        "hanzi": "建议",
        "pinyin": "jiàn yì",
        "meaning": "đề nghị",
        "example": "完成提出改进建议后请通知我。",
        "translation": "Sau khi hoàn thành việc đưa ra đề nghị cải tiến, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-l21-zongjie",
        "hanzi": "总结",
        "pinyin": "zǒng jié",
        "meaning": "tóm tắt",
        "example": "请及时简要总结发言。",
        "translation": "Vui lòng tóm tắt ngắn phần phát biểu kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先申请会议发言。",
          "pinyin": "Wǒ men xiān shēn qǐng huì yì fā yán.",
          "translation": "Trước tiên, chúng ta đề nghị phát biểu trong cuộc họp."
        },
        {
          "speaker": "B",
          "hanzi": "请清楚表达观点。",
          "pinyin": "Qǐng qīng chǔ biǎo dá guān diǎn.",
          "translation": "Vui lòng trình bày quan điểm rõ ràng."
        },
        {
          "speaker": "A",
          "hanzi": "我会补充一个信息。",
          "pinyin": "Wǒ huì bǔ chōng yí gè xìn xī.",
          "translation": "Tôi sẽ bổ sung một thông tin."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要表示同意意见。",
          "pinyin": "Xiàn zài xū yào biǎo shì tóng yì yì jiàn.",
          "translation": "Bây giờ cần bày tỏ đồng ý với ý kiến."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在提出相关问题。",
          "pinyin": "Wǒ men zhèng zài tí chū xiāng guān wèn tí.",
          "translation": "Chúng tôi đang đặt câu hỏi liên quan."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经礼貌打断发言。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng lǐ mào dǎ duàn fā yán.",
          "translation": "Vui lòng xác nhận đã ngắt lời lịch sự chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要强调讨论重点。",
          "pinyin": "Jīn tiān yào qiáng diào tǎo lùn zhòng diǎn.",
          "translation": "Hôm nay cần nhấn mạnh trọng điểm thảo luận."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上提供具体例子吗？",
          "pinyin": "Kě yǐ mǎ shàng tí gōng jù tǐ lì zi ma?",
          "translation": "Có thể cung cấp ví dụ cụ thể ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成提出改进建议后请通知我。",
          "pinyin": "Wán chéng tí chū gǎi jìn jiàn yì hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc đưa ra đề nghị cải tiến, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时简要总结发言。",
          "pinyin": "Qǐng jí shí jiǎn yào zǒng jié fā yán.",
          "translation": "Vui lòng tóm tắt ngắn phần phát biểu kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "申请会议发言",
          "pinyin": "shēn qǐng huì yì fā yán",
          "translation": "đề nghị phát biểu trong cuộc họp"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "清楚表达观点",
          "pinyin": "qīng chǔ biǎo dá guān diǎn",
          "translation": "trình bày quan điểm rõ ràng"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "补充一个信息",
          "pinyin": "bǔ chōng yí gè xìn xī",
          "translation": "bổ sung một thông tin"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "表示同意意见",
          "pinyin": "biǎo shì tóng yì yì jiàn",
          "translation": "bày tỏ đồng ý với ý kiến"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "提出相关问题",
          "pinyin": "tí chū xiāng guān wèn tí",
          "translation": "đặt câu hỏi liên quan"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "礼貌打断发言",
          "pinyin": "lǐ mào dǎ duàn fā yán",
          "translation": "ngắt lời lịch sự"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "强调讨论重点",
          "pinyin": "qiáng diào tǎo lùn zhòng diǎn",
          "translation": "nhấn mạnh trọng điểm thảo luận"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "提供具体例子",
          "pinyin": "tí gōng jù tǐ lì zi",
          "translation": "cung cấp ví dụ cụ thể"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "提出改进建议",
          "pinyin": "tí chū gǎi jìn jiàn yì",
          "translation": "đưa ra đề nghị cải tiến"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "简要总结发言",
          "pinyin": "jiǎn yào zǒng jié fā yán",
          "translation": "tóm tắt ngắn phần phát biểu"
        }
      ],
      "notes": [
        {
          "title": "Xin bổ sung",
          "pattern": "我补充一点……",
          "explanation": "Mẫu ngắn báo cho người nghe biết bạn thêm dữ kiện, không chuyển chủ đề."
        },
        {
          "title": "Ngắt lời chỉ khi cần",
          "pattern": "不好意思打断一下",
          "explanation": "Nêu ngay lý do khẩn hoặc điểm cần sửa sau lời mở này."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-da-kenh",
    "slug": "phan-hoi-va-bay-to-khac-biet",
    "title": "Phản hồi và bày tỏ khác biệt",
    "summary": "Thực hành phản hồi và bày tỏ khác biệt bằng tiếng Trung trong môi trường công sở.",
    "situation": "Không đồng ý với phương án của đồng nghiệp",
    "estimatedMinutes": 14,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-22-01",
        "hanzi": "反馈",
        "pinyin": "fǎn kuì",
        "meaning": "phản hồi",
        "example": "我们先提供具体反馈。",
        "translation": "Trước tiên, chúng ta cung cấp phản hồi cụ thể.",
        "audioUrl": null
      },
      {
        "slug": "core-22-02",
        "hanzi": "认可",
        "pinyin": "rèn kě",
        "meaning": "công nhận",
        "example": "请先认可对方观点。",
        "translation": "Vui lòng trước tiên công nhận quan điểm đối phương.",
        "audioUrl": null
      },
      {
        "slug": "core-22-03",
        "hanzi": "不同",
        "pinyin": "bù tóng",
        "meaning": "khác biệt",
        "example": "我会表达不同看法。",
        "translation": "Tôi sẽ bày tỏ cách nhìn khác.",
        "audioUrl": null
      },
      {
        "slug": "core-l22-baoliu",
        "hanzi": "保留意见",
        "pinyin": "bǎo liú yì jiàn",
        "meaning": "bảo lưu ý kiến",
        "example": "现在需要礼貌保留意见。",
        "translation": "Bây giờ cần bảo lưu ý kiến lịch sự.",
        "audioUrl": null
      },
      {
        "slug": "core-22-05",
        "hanzi": "原因",
        "pinyin": "yuán yīn",
        "meaning": "lý do",
        "example": "我们正在说明不同意原因。",
        "translation": "Chúng tôi đang nêu lý do không đồng ý.",
        "audioUrl": null
      },
      {
        "slug": "core-22-06",
        "hanzi": "事实",
        "pinyin": "shì shí",
        "meaning": "sự thật",
        "example": "请确认是否已经基于事实讨论。",
        "translation": "Vui lòng xác nhận đã thảo luận dựa trên sự thật chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-22-07",
        "hanzi": "证据",
        "pinyin": "zhèng jù",
        "meaning": "bằng chứng",
        "example": "今天要提供支持证据。",
        "translation": "Hôm nay cần cung cấp bằng chứng hỗ trợ.",
        "audioUrl": null
      },
      {
        "slug": "core-22-08",
        "hanzi": "建议",
        "pinyin": "jiàn yì",
        "meaning": "đề nghị",
        "example": "可以马上提出建设性建议吗？",
        "translation": "Có thể đưa ra đề nghị mang tính xây dựng ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-l22-gongshi",
        "hanzi": "共识",
        "pinyin": "gòng shí",
        "meaning": "đồng thuận",
        "example": "完成寻找双方共识后请通知我。",
        "translation": "Sau khi hoàn thành việc tìm điểm đồng thuận hai bên, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-22-10",
        "hanzi": "决定",
        "pinyin": "jué dìng",
        "meaning": "quyết định",
        "example": "请及时尊重团队决定。",
        "translation": "Vui lòng tôn trọng quyết định của nhóm kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先提供具体反馈。",
          "pinyin": "Wǒ men xiān tí gōng jù tǐ fǎn kuì.",
          "translation": "Trước tiên, chúng ta cung cấp phản hồi cụ thể."
        },
        {
          "speaker": "B",
          "hanzi": "请先认可对方观点。",
          "pinyin": "Qǐng xiān rèn kě duì fāng guān diǎn.",
          "translation": "Vui lòng trước tiên công nhận quan điểm đối phương."
        },
        {
          "speaker": "A",
          "hanzi": "我会表达不同看法。",
          "pinyin": "Wǒ huì biǎo dá bù tóng kàn fǎ.",
          "translation": "Tôi sẽ bày tỏ cách nhìn khác."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要礼貌保留意见。",
          "pinyin": "Xiàn zài xū yào lǐ mào bǎo liú yì jiàn.",
          "translation": "Bây giờ cần bảo lưu ý kiến lịch sự."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在说明不同意原因。",
          "pinyin": "Wǒ men zhèng zài shuō míng bù tóng yì yuán yīn.",
          "translation": "Chúng tôi đang nêu lý do không đồng ý."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经基于事实讨论。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng jī yú shì shí tǎo lùn.",
          "translation": "Vui lòng xác nhận đã thảo luận dựa trên sự thật chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要提供支持证据。",
          "pinyin": "Jīn tiān yào tí gōng zhī chí zhèng jù.",
          "translation": "Hôm nay cần cung cấp bằng chứng hỗ trợ."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上提出建设性建议吗？",
          "pinyin": "Kě yǐ mǎ shàng tí chū jiàn shè xìng jiàn yì ma?",
          "translation": "Có thể đưa ra đề nghị mang tính xây dựng ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成寻找双方共识后请通知我。",
          "pinyin": "Wán chéng xún zhǎo shuāng fāng gòng shí hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc tìm điểm đồng thuận hai bên, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时尊重团队决定。",
          "pinyin": "Qǐng jí shí zūn zhòng tuán duì jué dìng.",
          "translation": "Vui lòng tôn trọng quyết định của nhóm kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "提供具体反馈",
          "pinyin": "tí gōng jù tǐ fǎn kuì",
          "translation": "cung cấp phản hồi cụ thể"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "先认可对方观点",
          "pinyin": "xiān rèn kě duì fāng guān diǎn",
          "translation": "trước tiên công nhận quan điểm đối phương"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "表达不同看法",
          "pinyin": "biǎo dá bù tóng kàn fǎ",
          "translation": "bày tỏ cách nhìn khác"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "礼貌保留意见",
          "pinyin": "lǐ mào bǎo liú yì jiàn",
          "translation": "bảo lưu ý kiến lịch sự"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "说明不同意原因",
          "pinyin": "shuō míng bù tóng yì yuán yīn",
          "translation": "nêu lý do không đồng ý"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "基于事实讨论",
          "pinyin": "jī yú shì shí tǎo lùn",
          "translation": "thảo luận dựa trên sự thật"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "提供支持证据",
          "pinyin": "tí gōng zhī chí zhèng jù",
          "translation": "cung cấp bằng chứng hỗ trợ"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "提出建设性建议",
          "pinyin": "tí chū jiàn shè xìng jiàn yì",
          "translation": "đưa ra đề nghị mang tính xây dựng"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "寻找双方共识",
          "pinyin": "xún zhǎo shuāng fāng gòng shí",
          "translation": "tìm điểm đồng thuận hai bên"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "尊重团队决定",
          "pinyin": "zūn zhòng tuán duì jué dìng",
          "translation": "tôn trọng quyết định của nhóm"
        }
      ],
      "notes": [
        {
          "title": "Khác ý không công kích",
          "pattern": "我理解……，不过……",
          "explanation": "Ghi nhận cân nhắc trước khi nêu rủi ro hoặc đề xuất khác."
        },
        {
          "title": "Hỏi căn cứ",
          "pattern": "请问这个判断的依据是？",
          "explanation": "Tập trung vào dữ kiện và tiêu chí thay vì đánh giá người nói."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-da-kenh",
    "slug": "ban-giao-va-theo-doi-sau-trao-doi",
    "title": "Bàn giao và theo dõi sau trao đổi",
    "summary": "Thực hành bàn giao và theo dõi sau trao đổi bằng tiếng Trung trong môi trường công sở.",
    "situation": "Đổi ca hoặc nghỉ phép",
    "estimatedMinutes": 14,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-23-01",
        "hanzi": "交接",
        "pinyin": "jiāo jiē",
        "meaning": "bàn giao",
        "example": "我们先进行工作交接。",
        "translation": "Trước tiên, chúng ta thực hiện bàn giao công việc.",
        "audioUrl": null
      },
      {
        "slug": "core-23-02",
        "hanzi": "事项",
        "pinyin": "shì xiàng",
        "meaning": "hạng mục",
        "example": "请列出交接事项。",
        "translation": "Vui lòng liệt kê hạng mục bàn giao.",
        "audioUrl": null
      },
      {
        "slug": "core-l23-zhuangtai",
        "hanzi": "状态",
        "pinyin": "zhuàng tài",
        "meaning": "trạng thái",
        "example": "我会说明当前状态。",
        "translation": "Tôi sẽ nêu trạng thái hiện tại.",
        "audioUrl": null
      },
      {
        "slug": "core-23-04",
        "hanzi": "文件",
        "pinyin": "wén jiàn",
        "meaning": "tài liệu",
        "example": "现在需要移交相关文件。",
        "translation": "Bây giờ cần bàn giao tài liệu liên quan.",
        "audioUrl": null
      },
      {
        "slug": "core-23-05",
        "hanzi": "权限",
        "pinyin": "quán xiàn",
        "meaning": "quyền truy cập",
        "example": "我们正在转交必要权限。",
        "translation": "Chúng tôi đang chuyển quyền truy cập cần thiết.",
        "audioUrl": null
      },
      {
        "slug": "core-23-06",
        "hanzi": "联系人",
        "pinyin": "lián xì rén",
        "meaning": "người liên hệ",
        "example": "请确认是否已经提供相关联系人。",
        "translation": "Vui lòng xác nhận đã cung cấp người liên hệ liên quan chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-23-07",
        "hanzi": "待办",
        "pinyin": "dài bàn",
        "meaning": "việc cần làm",
        "example": "今天要确认后续待办。",
        "translation": "Hôm nay cần xác nhận việc cần làm tiếp theo.",
        "audioUrl": null
      },
      {
        "slug": "core-l23-gengjin",
        "hanzi": "跟进",
        "pinyin": "gēn jìn",
        "meaning": "theo dõi",
        "example": "可以马上安排后续跟进吗？",
        "translation": "Có thể sắp xếp theo dõi tiếp ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-23-09",
        "hanzi": "记录",
        "pinyin": "jì lù",
        "meaning": "biên bản",
        "example": "完成发送沟通记录后请通知我。",
        "translation": "Sau khi hoàn thành việc gửi biên bản trao đổi, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-23-10",
        "hanzi": "关闭",
        "pinyin": "guān bì",
        "meaning": "khép lại",
        "example": "请及时确认事项已经关闭。",
        "translation": "Vui lòng xác nhận hạng mục đã khép lại kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先进行工作交接。",
          "pinyin": "Wǒ men xiān jìn xíng gōng zuò jiāo jiē.",
          "translation": "Trước tiên, chúng ta thực hiện bàn giao công việc."
        },
        {
          "speaker": "B",
          "hanzi": "请列出交接事项。",
          "pinyin": "Qǐng liè chū jiāo jiē shì xiàng.",
          "translation": "Vui lòng liệt kê hạng mục bàn giao."
        },
        {
          "speaker": "A",
          "hanzi": "我会说明当前状态。",
          "pinyin": "Wǒ huì shuō míng dāng qián zhuàng tài.",
          "translation": "Tôi sẽ nêu trạng thái hiện tại."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要移交相关文件。",
          "pinyin": "Xiàn zài xū yào yí jiāo xiāng guān wén jiàn.",
          "translation": "Bây giờ cần bàn giao tài liệu liên quan."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在转交必要权限。",
          "pinyin": "Wǒ men zhèng zài zhuǎn jiāo bì yào quán xiàn.",
          "translation": "Chúng tôi đang chuyển quyền truy cập cần thiết."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经提供相关联系人。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng tí gōng xiāng guān lián xì rén.",
          "translation": "Vui lòng xác nhận đã cung cấp người liên hệ liên quan chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要确认后续待办。",
          "pinyin": "Jīn tiān yào què rèn hòu xù dài bàn.",
          "translation": "Hôm nay cần xác nhận việc cần làm tiếp theo."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上安排后续跟进吗？",
          "pinyin": "Kě yǐ mǎ shàng ān pái hòu xù gēn jìn ma?",
          "translation": "Có thể sắp xếp theo dõi tiếp ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成发送沟通记录后请通知我。",
          "pinyin": "Wán chéng fā sòng gōu tōng jì lù hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc gửi biên bản trao đổi, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时确认事项已经关闭。",
          "pinyin": "Qǐng jí shí què rèn shì xiàng yǐ jīng guān bì.",
          "translation": "Vui lòng xác nhận hạng mục đã khép lại kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "进行工作交接",
          "pinyin": "jìn xíng gōng zuò jiāo jiē",
          "translation": "thực hiện bàn giao công việc"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "列出交接事项",
          "pinyin": "liè chū jiāo jiē shì xiàng",
          "translation": "liệt kê hạng mục bàn giao"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "说明当前状态",
          "pinyin": "shuō míng dāng qián zhuàng tài",
          "translation": "nêu trạng thái hiện tại"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "移交相关文件",
          "pinyin": "yí jiāo xiāng guān wén jiàn",
          "translation": "bàn giao tài liệu liên quan"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "转交必要权限",
          "pinyin": "zhuǎn jiāo bì yào quán xiàn",
          "translation": "chuyển quyền truy cập cần thiết"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "提供相关联系人",
          "pinyin": "tí gōng xiāng guān lián xì rén",
          "translation": "cung cấp người liên hệ liên quan"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "确认后续待办",
          "pinyin": "què rèn hòu xù dài bàn",
          "translation": "xác nhận việc cần làm tiếp theo"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "安排后续跟进",
          "pinyin": "ān pái hòu xù gēn jìn",
          "translation": "sắp xếp theo dõi tiếp"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "发送沟通记录",
          "pinyin": "fā sòng gōu tōng jì lù",
          "translation": "gửi biên bản trao đổi"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "确认事项已经关闭",
          "pinyin": "què rèn shì xiàng yǐ jīng guān bì",
          "translation": "xác nhận hạng mục đã khép lại"
        }
      ],
      "notes": [
        {
          "title": "Bàn giao theo cấu trúc",
          "pattern": "状态 + 下一步 + 资料 + 联系人",
          "explanation": "Bốn mục giúp người nhận tiếp tục mà không tìm lại bối cảnh."
        },
        {
          "title": "Xác nhận đã tiếp nhận",
          "pattern": "请确认收到",
          "explanation": "Dùng với nội dung quan trọng; không mặc định việc gửi đồng nghĩa người nhận đã đọc."
        }
      ]
    }
  },
  {
    "moduleSlug": "giao-tiep-da-kenh",
    "slug": "kiem-tra-tong-hop-giao-tiep-cong-so-cot-loi",
    "title": "Kiểm tra tổng hợp Giao tiếp công sở cốt lõi",
    "summary": "Thực hành kiểm tra tổng hợp giao tiếp công sở cốt lõi bằng tiếng Trung trong môi trường công sở.",
    "situation": "Đánh giá cuối lộ trình",
    "estimatedMinutes": 16,
    "isFree": false,
    "vocabulary": [
      {
        "slug": "core-24-01",
        "hanzi": "场景",
        "pinyin": "chǎng jǐng",
        "meaning": "tình huống",
        "example": "我们先完成综合场景。",
        "translation": "Trước tiên, chúng ta hoàn thành tình huống tổng hợp.",
        "audioUrl": null
      },
      {
        "slug": "core-24-02",
        "hanzi": "礼貌",
        "pinyin": "lǐ mào",
        "meaning": "lịch sự",
        "example": "请保持礼貌表达。",
        "translation": "Vui lòng duy trì cách nói lịch sự.",
        "audioUrl": null
      },
      {
        "slug": "core-24-03",
        "hanzi": "清晰",
        "pinyin": "qīng xī",
        "meaning": "rõ ràng",
        "example": "我会清晰传达信息。",
        "translation": "Tôi sẽ truyền đạt thông tin rõ ràng.",
        "audioUrl": null
      },
      {
        "slug": "core-24-04",
        "hanzi": "倾听",
        "pinyin": "qīng tīng",
        "meaning": "lắng nghe",
        "example": "现在需要认真倾听对方。",
        "translation": "Bây giờ cần chăm chú lắng nghe đối phương.",
        "audioUrl": null
      },
      {
        "slug": "core-24-05",
        "hanzi": "确认",
        "pinyin": "què rèn",
        "meaning": "xác nhận",
        "example": "我们正在确认关键信息。",
        "translation": "Chúng tôi đang xác nhận thông tin quan trọng.",
        "audioUrl": null
      },
      {
        "slug": "core-24-06",
        "hanzi": "协作",
        "pinyin": "xié zuò",
        "meaning": "phối hợp",
        "example": "请确认是否已经主动开展协作。",
        "translation": "Vui lòng xác nhận đã chủ động phối hợp chưa.",
        "audioUrl": null
      },
      {
        "slug": "core-24-07",
        "hanzi": "汇报",
        "pinyin": "huì bào",
        "meaning": "báo cáo",
        "example": "今天要结构化汇报进度。",
        "translation": "Hôm nay cần báo cáo tiến độ có cấu trúc.",
        "audioUrl": null
      },
      {
        "slug": "core-24-08",
        "hanzi": "解决",
        "pinyin": "jiě jué",
        "meaning": "giải quyết",
        "example": "可以马上共同解决问题吗？",
        "translation": "Có thể cùng giải quyết vấn đề ngay không?",
        "audioUrl": null
      },
      {
        "slug": "core-24-09",
        "hanzi": "跟进",
        "pinyin": "gēn jìn",
        "meaning": "theo dõi",
        "example": "完成及时跟进事项后请通知我。",
        "translation": "Sau khi hoàn thành việc theo dõi hạng mục kịp thời, vui lòng báo cho tôi.",
        "audioUrl": null
      },
      {
        "slug": "core-24-10",
        "hanzi": "总结",
        "pinyin": "zǒng jié",
        "meaning": "tổng kết",
        "example": "请及时总结沟通结果。",
        "translation": "Vui lòng tổng kết kết quả trao đổi kịp thời.",
        "audioUrl": null
      }
    ],
    "content": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "我们先完成综合场景。",
          "pinyin": "Wǒ men xiān wán chéng zōng hé chǎng jǐng.",
          "translation": "Trước tiên, chúng ta hoàn thành tình huống tổng hợp."
        },
        {
          "speaker": "B",
          "hanzi": "请保持礼貌表达。",
          "pinyin": "Qǐng bǎo chí lǐ mào biǎo dá.",
          "translation": "Vui lòng duy trì cách nói lịch sự."
        },
        {
          "speaker": "A",
          "hanzi": "我会清晰传达信息。",
          "pinyin": "Wǒ huì qīng xī chuán dá xìn xī.",
          "translation": "Tôi sẽ truyền đạt thông tin rõ ràng."
        },
        {
          "speaker": "B",
          "hanzi": "现在需要认真倾听对方。",
          "pinyin": "Xiàn zài xū yào rèn zhēn qīng tīng duì fāng.",
          "translation": "Bây giờ cần chăm chú lắng nghe đối phương."
        },
        {
          "speaker": "A",
          "hanzi": "我们正在确认关键信息。",
          "pinyin": "Wǒ men zhèng zài què rèn guān jiàn xìn xī.",
          "translation": "Chúng tôi đang xác nhận thông tin quan trọng."
        },
        {
          "speaker": "B",
          "hanzi": "请确认是否已经主动开展协作。",
          "pinyin": "Qǐng què rèn shì fǒu yǐ jīng zhǔ dòng kāi zhǎn xié zuò.",
          "translation": "Vui lòng xác nhận đã chủ động phối hợp chưa."
        },
        {
          "speaker": "A",
          "hanzi": "今天要结构化汇报进度。",
          "pinyin": "Jīn tiān yào jié gòu huà huì bào jìn dù.",
          "translation": "Hôm nay cần báo cáo tiến độ có cấu trúc."
        },
        {
          "speaker": "B",
          "hanzi": "可以马上共同解决问题吗？",
          "pinyin": "Kě yǐ mǎ shàng gòng tóng jiě jué wèn tí ma?",
          "translation": "Có thể cùng giải quyết vấn đề ngay không?"
        },
        {
          "speaker": "A",
          "hanzi": "完成及时跟进事项后请通知我。",
          "pinyin": "Wán chéng jí shí gēn jìn shì xiàng hòu qǐng tōng zhī wǒ.",
          "translation": "Sau khi hoàn thành việc theo dõi hạng mục kịp thời, vui lòng báo cho tôi."
        },
        {
          "speaker": "B",
          "hanzi": "请及时总结沟通结果。",
          "pinyin": "Qǐng jí shí zǒng jié gōu tōng jié guǒ.",
          "translation": "Vui lòng tổng kết kết quả trao đổi kịp thời."
        }
      ],
      "phrases": [
        {
          "speaker": "Cụm từ 01",
          "hanzi": "完成综合场景",
          "pinyin": "wán chéng zōng hé chǎng jǐng",
          "translation": "hoàn thành tình huống tổng hợp"
        },
        {
          "speaker": "Cụm từ 02",
          "hanzi": "保持礼貌表达",
          "pinyin": "bǎo chí lǐ mào biǎo dá",
          "translation": "duy trì cách nói lịch sự"
        },
        {
          "speaker": "Cụm từ 03",
          "hanzi": "清晰传达信息",
          "pinyin": "qīng xī chuán dá xìn xī",
          "translation": "truyền đạt thông tin rõ ràng"
        },
        {
          "speaker": "Cụm từ 04",
          "hanzi": "认真倾听对方",
          "pinyin": "rèn zhēn qīng tīng duì fāng",
          "translation": "chăm chú lắng nghe đối phương"
        },
        {
          "speaker": "Cụm từ 05",
          "hanzi": "确认关键信息",
          "pinyin": "què rèn guān jiàn xìn xī",
          "translation": "xác nhận thông tin quan trọng"
        },
        {
          "speaker": "Cụm từ 06",
          "hanzi": "主动开展协作",
          "pinyin": "zhǔ dòng kāi zhǎn xié zuò",
          "translation": "chủ động phối hợp"
        },
        {
          "speaker": "Cụm từ 07",
          "hanzi": "结构化汇报进度",
          "pinyin": "jié gòu huà huì bào jìn dù",
          "translation": "báo cáo tiến độ có cấu trúc"
        },
        {
          "speaker": "Cụm từ 08",
          "hanzi": "共同解决问题",
          "pinyin": "gòng tóng jiě jué wèn tí",
          "translation": "cùng giải quyết vấn đề"
        },
        {
          "speaker": "Cụm từ 09",
          "hanzi": "及时跟进事项",
          "pinyin": "jí shí gēn jìn shì xiàng",
          "translation": "theo dõi hạng mục kịp thời"
        },
        {
          "speaker": "Cụm từ 10",
          "hanzi": "总结沟通结果",
          "pinyin": "zǒng jié gōu tōng jié guǒ",
          "translation": "tổng kết kết quả trao đổi"
        }
      ],
      "notes": [
        {
          "title": "Rõ và gọn",
          "pattern": "事实 + 影响 + 行动 + 时间",
          "explanation": "Cấu trúc này dùng được trong tin nhắn, cuộc gọi, họp và bàn giao."
        },
        {
          "title": "Chọn đúng kênh",
          "pattern": "按照权限和保密要求沟通",
          "explanation": "Thông tin nhạy cảm phải đi đúng kênh, quyền truy cập và chính sách tổ chức."
        }
      ],
      "challenge": {
        "title": "Kiểm tra tổng hợp Giao tiếp công sở cốt lõi",
        "description": "Đạt 5/6 câu để hoàn thành lộ trình.",
        "passScore": 5,
        "questions": [
          {
            "prompt": "Tin nhắn công việc rõ nên có gì?",
            "options": [
              "Bối cảnh, việc cần làm và thời hạn",
              "Chỉ một từ ‘gấp’",
              "Nhiều biểu tượng nhưng không có yêu cầu"
            ],
            "correctOption": 0,
            "explanation": "Ba phần giúp người nhận hiểu vì sao được liên hệ và cần phản hồi thế nào."
          },
          {
            "prompt": "Khi gọi điện, bước mở đầu phù hợp là gì?",
            "options": [
              "Nói tên, bộ phận và mục đích cuộc gọi",
              "Hỏi ngay thông tin nhạy cảm",
              "Bật loa ngoài mà không báo"
            ],
            "correctOption": 0,
            "explanation": "Giới thiệu ngắn giúp người nghe xác định người gọi và bối cảnh."
          },
          {
            "prompt": "我补充一点 dùng trong họp để làm gì?",
            "options": [
              "Bổ sung một ý",
              "Phản đối hoàn toàn",
              "Kết thúc họp"
            ],
            "correctOption": 0,
            "explanation": "补充一点 là cách xin thêm một ý ngắn vào trao đổi."
          },
          {
            "prompt": "Không đồng ý với đồng nghiệp, cách nào chuyên nghiệp?",
            "options": [
              "我理解您的考虑，不过我有一个不同的看法。",
              "你完全错了。",
              "我不想听。"
            ],
            "correctOption": 0,
            "explanation": "Ghi nhận góc nhìn trước khi nêu ý khác giúp tập trung vào vấn đề thay vì con người."
          },
          {
            "prompt": "Bàn giao tốt cần nêu gì?",
            "options": [
              "Trạng thái, việc còn lại, tài liệu và người liên hệ",
              "Chỉ nói đã bàn giao",
              "Chỉ gửi một ảnh"
            ],
            "correctOption": 0,
            "explanation": "Các mục này giúp người nhận tiếp tục công việc mà không phải tìm lại bối cảnh."
          },
          {
            "prompt": "Khi xử lý thông tin nhạy cảm, khóa học yêu cầu gì?",
            "options": [
              "Dùng đúng kênh, quyền truy cập và chính sách tổ chức",
              "Gửi vào nhóm đông người cho nhanh",
              "Chụp màn hình chia sẻ tự do"
            ],
            "correctOption": 0,
            "explanation": "Ngôn ngữ giao tiếp không thay thế quy định bảo mật và phân quyền của tổ chức."
          }
        ]
      }
    }
  }
];

export const coreWorkplaceCourseStats = {
  lessons: coreWorkplaceLessons.length,
  minutes: coreWorkplaceLessons.reduce((total, lesson) => total + lesson.estimatedMinutes, 0),
  freeLessons: coreWorkplaceLessons.filter((lesson) => lesson.isFree).length,
  vocabulary: new Set(coreWorkplaceLessons.flatMap((lesson) => lesson.vocabulary.map((word) => word.slug))).size,
  modules: coreWorkplaceModules.length,
};
