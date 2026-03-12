import { useState } from 'react';

const sections = [
  {
    id: 'gioi-thieu',
    label: 'Giới thiệu Tea Mango',
    title: 'GIỚI THIỆU TEA MANGO',
    content: [
      'Tea Mango hiện là thương hiệu đồ uống trà sữa nổi tiếng tại Việt Nam, nhanh chóng chinh phục trái tim của hàng triệu khách hàng yêu thích trà và các loại đồ uống từ xoài nhiệt đới. Thương hiệu Tea Mango đang như một cơn gió mát lành lan tỏa khắp các tỉnh thành, mang đến trải nghiệm thưởng thức độc đáo và khác biệt.',
      'Tea Mango ra đời với sứ mệnh mang đến những ly trà thơm ngon, chất lượng cao từ nguyên liệu tự nhiên. Mỗi sản phẩm đều được chế biến tỉ mỉ, đảm bảo hương vị đặc trưng của xoài tươi kết hợp cùng trà thượng hạng.',
      'Trong suốt quá trình phát triển, Tea Mango luôn tập trung vào việc kết hợp và tạo ra những sản phẩm chất lượng cao nhất, phải tạo được sự khác biệt so với những sản phẩm cùng loại trên thị trường. Chỉ số chất lượng của tất cả các nguyên liệu và các thành phần được sử dụng trong Tea Mango đều đạt tiêu chuẩn an toàn thực phẩm nghiêm ngặt. Tea Mango hoàn toàn không sử dụng hương liệu phụ gia độc hại.',
      'Để luôn có được loại trà ngon nhất, Tea Mango đã ký hợp đồng với những nông dân ở vùng cao. Chăm sóc tại những vườn xoài với điều kiện khí hậu lý tưởng, cùng với việc lựa chọn tỉ mỉ từng đầu-hai-lá, trà đã pha không chỉ toả ra một hương vị ngọt ngào mà còn có mùi thơm đặc biệt.',
    ],
  },
  {
    id: 'cau-chuyen',
    label: 'Câu chuyện Tea Mango',
    title: 'CÂU CHUYỆN TEA MANGO',
    content: [
      'Tea Mango được thành lập bởi những người trẻ đam mê với văn hóa trà và mong muốn tạo ra một thương hiệu đồ uống đặc trưng của Việt Nam. Ý tưởng kết hợp giữa hương vị xoài nhiệt đới và trà thơm ngon đã tạo nên sức hút đặc biệt ngay từ những ngày đầu.',
      'Những ngày đầu tiên, Tea Mango chỉ là một quán nhỏ tại trung tâm thành phố với vài chục loại thức uống. Nhờ chất lượng và sự sáng tạo trong công thức pha chế, quán nhanh chóng trở thành điểm đến yêu thích của giới trẻ.',
      'Câu chuyện của Tea Mango là câu chuyện về niềm đam mê, sự kiên trì và khát vọng mang đến những ly trà ngon nhất cho người Việt. Mỗi công thức đều trải qua hàng trăm lần thử nghiệm để đạt được hương vị hoàn hảo nhất trước khi chính thức ra mắt khách hàng.',
      'Đến nay, Tea Mango đã có mặt tại nhiều tỉnh thành trên cả nước, với hệ thống cửa hàng phủ rộng từ Bắc vào Nam, phục vụ hàng triệu khách hàng mỗi ngày.',
    ],
  },
  {
    id: 'thanh-tuu',
    label: 'Thành tựu',
    title: 'THÀNH TỰU NỔI BẬT',
    content: [
      'Tea Mango tự hào với hàng loạt thành tựu đáng kể trong suốt quá trình phát triển. Thương hiệu đã giành được nhiều giải thưởng uy tín trong ngành F&B Việt Nam, khẳng định vị thế hàng đầu trên thị trường đồ uống.',
      'Năm 2022, Tea Mango được bình chọn là "Thương hiệu trà sữa được yêu thích nhất" bởi hàng trăm nghìn lượt bình chọn từ khách hàng trên toàn quốc. Đây là minh chứng rõ ràng nhất cho chất lượng và sự tin tưởng mà khách hàng dành cho thương hiệu.',
      'Tính đến nay, Tea Mango đã mở rộng chuỗi lên hơn 200 cửa hàng trên toàn quốc, tạo ra hơn 2.000 việc làm cho người lao động Việt Nam. Tốc độ tăng trưởng hàng năm đạt trên 40%, khẳng định sức mạnh và tiềm năng phát triển bền vững của thương hiệu.',
      'Tea Mango cũng đã nhận được chứng nhận an toàn thực phẩm từ các tổ chức kiểm định uy tín, đảm bảo mọi sản phẩm đều đạt tiêu chuẩn chất lượng cao nhất trước khi đến tay người tiêu dùng.',
    ],
  },
  {
    id: 'nhuong-quyen',
    label: 'Nhượng quyền thương hiệu',
    title: 'NHƯỢNG QUYỀN THƯƠNG HIỆU',
    content: [
      'Tea Mango mang đến cơ hội kinh doanh nhượng quyền hấp dẫn cho các nhà đầu tư muốn sở hữu một thương hiệu đồ uống uy tín. Với mô hình kinh doanh đã được kiểm chứng và hệ thống hỗ trợ toàn diện, đây là cơ hội vàng cho những ai muốn khởi nghiệp trong lĩnh vực F&B.',
      'Chương trình nhượng quyền của Tea Mango bao gồm: đào tạo bài bản về quy trình pha chế và vận hành, hỗ trợ thiết kế và thi công cửa hàng theo tiêu chuẩn thương hiệu, cung cấp nguyên liệu đầu vào chất lượng cao với giá ưu đãi, và hỗ trợ marketing liên tục từ trụ sở chính.',
      'Đối tác nhượng quyền Tea Mango được hưởng lợi từ thương hiệu đã được xây dựng và nhận diện rộng rãi, tệp khách hàng trung thành lớn, và sự hỗ trợ chuyên sâu từ đội ngũ chuyên gia giàu kinh nghiệm. Chi phí đầu tư ban đầu hợp lý với thời gian hoàn vốn nhanh.',
      'Hãy liên hệ với chúng tôi để nhận tư vấn chi tiết về chương trình nhượng quyền và trở thành một phần của đại gia đình Tea Mango trên khắp cả nước.',
    ],
  },
  {
    id: 'san-pham',
    label: 'Sản phẩm',
    title: 'SẢN PHẨM TEA MANGO',
    content: [
      'Tea Mango tự hào mang đến thực đơn phong phú với hơn 50 loại đồ uống đặc sắc, từ trà sữa truyền thống đến các loại trà hoa quả sáng tạo. Điểm nhấn đặc biệt là dòng sản phẩm từ xoài tươi – nguyên liệu chủ đạo tạo nên bản sắc riêng của thương hiệu.',
      'Các dòng sản phẩm chính bao gồm: Trà Sữa Xoài Tươi, Trà Xoài Hoa Cúc, Sinh Tố Xoài Dừa, Trà Đào Xoài Lạnh, và nhiều loại topping độc đáo như trân châu vàng, thạch xoài, pudding trứng. Mỗi sản phẩm đều có thể tùy chỉnh độ ngọt và đá theo sở thích cá nhân.',
      'Nguyên liệu được lựa chọn kỹ lưỡng từ các vùng trồng uy tín, đảm bảo tươi ngon và an toàn. Tea Mango cam kết không sử dụng chất bảo quản hay hương liệu nhân tạo, mang đến những ly đồ uống thật sự tự nhiên và lành mạnh.',
      'Thực đơn được cập nhật theo mùa với các sản phẩm giới hạn sáng tạo, luôn mang đến sự mới mẻ và hứng thú cho khách hàng. Đội ngũ R&D của Tea Mango không ngừng nghiên cứu và phát triển các công thức mới để đáp ứng xu hướng thị trường.',
    ],
  },
  {
    id: 'co-hoi',
    label: 'Cơ hội nghề nghiệp',
    title: 'CƠ HỘI NGHỀ NGHIỆP',
    content: [
      'Tea Mango luôn chào đón những tài năng trẻ đầy nhiệt huyết, sáng tạo và đam mê với ngành F&B. Chúng tôi tạo ra môi trường làm việc năng động, chuyên nghiệp và đầy cơ hội phát triển cho tất cả nhân viên.',
      'Các vị trí tuyển dụng thường xuyên bao gồm: Barista (nhân viên pha chế), Quản lý cửa hàng, Chuyên viên Marketing, Kỹ thuật viên R&D, Nhân viên kho vận và Chuyên viên phát triển nhượng quyền. Chúng tôi đánh giá cao sự nhiệt tình và tinh thần học hỏi hơn là kinh nghiệm.',
      'Tea Mango đầu tư mạnh vào việc đào tạo và phát triển nhân viên với các chương trình huấn luyện bài bản, lộ trình thăng tiến rõ ràng và chế độ đãi ngộ cạnh tranh. Nhân viên xuất sắc có cơ hội được cử đi đào tạo tại nước ngoài.',
      'Nếu bạn đam mê ngành F&B và muốn trở thành một phần của đội ngũ Tea Mango, hãy gửi CV của bạn đến địa chỉ tuyển dụng của chúng tôi. Cùng chúng tôi xây dựng tương lai và mang hương vị Tea Mango đến khắp nơi trên đất nước!',
    ],
  },
];

export default function IntroductionTeaMango() {
  const [activeId, setActiveId] = useState('gioi-thieu');
  const active = sections.find((s) => s.id === activeId);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500">
          <span>Giới thiệu</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{active.label}</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-7xl px-6 py-10 flex gap-10 items-start">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-amber-700 text-2xl">•</span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-gray-800 uppercase">
                {active.title}
              </h1>
              <span className="text-amber-700 text-2xl">•</span>
            </div>
            <div className="mx-auto mt-2 flex flex-col items-center gap-1">
              <div className="w-48 h-px bg-gray-300" />
              <div className="w-32 h-px bg-gray-300" />
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-5 text-gray-700 leading-relaxed text-[15px]">
            {active.content.map((para, i) => (
              <p
                key={i}
                className={i === 2 ? 'text-amber-800' : ''}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-72 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Có thể bạn quan tâm
          </h2>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveId(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left transition-colors border border-gray-100
                    ${
                      activeId === section.id
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-white text-amber-700 hover:bg-amber-50'
                    }`}
                >
                  <span>{section.label}</span>
                  <span
                    className={`ml-2 flex items-center justify-center w-6 h-6 text-xs font-bold
                      ${
                        activeId === section.id
                          ? 'bg-white text-amber-700'
                          : 'bg-amber-700 text-white'
                      }`}
                  >
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
