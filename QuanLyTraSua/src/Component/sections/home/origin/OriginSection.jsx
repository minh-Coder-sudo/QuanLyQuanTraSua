import ImgOriginSection from '../../../../assets/ImgOriginSection.png';
export default function OriginSection() {
    return (
        <section className="grid md:grid-cols-2">
            <img src={ImgOriginSection} className="h-[600px] object-cover w-full" />

            <div className="bg-[#6c8f5b] text-white p-20 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-6">Tinh hoa trà trong từng ly trà sữa</h2>

                <p className="leading-relaxed mb-8 text-lg">
                    Những lá trà được tuyển chọn từ vùng trà chất lượng cao, kết hợp cùng sữa thơm béo và trân châu dẻo
                    dai, tạo nên ly trà sữa đậm vị và đầy cuốn hút. Mỗi ngụm trà là sự cân bằng hoàn hảo giữa hương trà
                    thanh mát và vị ngọt dịu, mang đến trải nghiệm thưởng thức khó quên.
                </p>

                <button className="border border-white px-8 py-3 w-fit hover:bg-white hover:text-[#6c8f5b] transition">
                    XEM THÊM
                </button>
            </div>
        </section>
    );
}
