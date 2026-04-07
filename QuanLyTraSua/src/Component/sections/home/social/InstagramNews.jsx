import ImgNews from '../../../../assets/ImgNews.webp';
import ImgIns1 from '../../../../assets/ImgIns1.png';
import ImgIns2 from '../../../../assets/ImgIns2.png';
import ImgIns3 from '../../../../assets/ImgIns3.png';
import ImgIns4 from '../../../../assets/ImgIns4.png';
import ImgIns5 from '../../../../assets/ImgIns5.png';
import ImgIns6 from '../../../../assets/ImgIns6.png';

export default function InstagramNews() {
    const images = [ImgIns1, ImgIns2, ImgIns3, ImgIns4, ImgIns5, ImgIns6];

    return (
        <section className='bg-white py-20 px-6 md:px-12'>
            <div className='max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12'>
                {/* INSTAGRAM */}
                <div>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-4xl md:text-5xl font-extrabold text-orange-500'>
                            INSTAGRAM
                        </h2>

                        <a
                            href='#'
                            className='font-semibold text-black text-base flex items-center gap-2 hover:gap-4 transition-all'
                        >
                            <span className='underline underline-offset-4'>
                                FOLLOW NGAY
                            </span>
                            <span className='text-xl'>→</span>
                        </a>
                    </div>

                    {/* GRID IMAGE */}
                    <div className='grid grid-cols-3 gap-4'>
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className='overflow-hidden rounded-xl'
                            >
                                <img
                                    src={img}
                                    className='w-full h-[140px] md:h-[180px] object-cover hover:scale-110 transition duration-300'
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEWS */}
                <div>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-4xl md:text-5xl font-extrabold text-orange-500'>
                            NEWS
                        </h2>

                        <a
                            href='#'
                            className='font-semibold text-black text-base flex items-center gap-2 hover:gap-4 transition-all'
                        >
                            <span className='underline underline-offset-4'>
                                XEM THÊM
                            </span>
                            <span className='text-xl'>→</span>
                        </a>
                    </div>

                    {/* IMAGE */}
                    <div className='rounded-2xl overflow-hidden shadow-lg'>
                        <img
                            src={ImgNews}
                            className='w-full h-[250px] md:h-[320px] object-cover hover:scale-105 transition duration-300'
                        />
                    </div>

                    {/* INFO */}
                    <div className='mt-4 flex justify-between text-sm text-orange-500 font-semibold'>
                        <span>TeaMango</span>
                        <span>13.3.2026</span>
                    </div>

                    {/* CONTENT */}
                    <p className='mt-3 text-base md:text-lg font-semibold text-black leading-relaxed'>
                        Bắt gặp Sài Gòn xưa trong món uống hiện đại. Hương vị
                        trà sữa được kết hợp tinh tế từ những lá trà tuyển chọn,
                        mang đến trải nghiệm vừa quen thuộc vừa mới mẻ.
                    </p>
                </div>
            </div>
        </section>
    );
}
