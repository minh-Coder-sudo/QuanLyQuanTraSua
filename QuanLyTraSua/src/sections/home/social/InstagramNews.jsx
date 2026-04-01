import ImgNews from '../../../assets/ImgNews.webp';
import ImgIns1 from '../../../assets/ImgIns1.png';
import ImgIns2 from '../../../assets/ImgIns2.png';
import ImgIns3 from '../../../assets/ImgIns3.png';
import ImgIns4 from '../../../assets/ImgIns4.png';
import ImgIns5 from '../../../assets/ImgIns5.png';
import ImgIns6 from '../../../assets/ImgIns6.png';

export default function InstagramNews() {
    return (
        <section className='bg-white py-24 px-12'>
            <div className='max-w-[1300px] mx-auto grid md:grid-cols-2 gap-20'>
                {/* INSTAGRAM */}

                <div>
                    <div className='flex justify-between items-center mb-8'>
                        <h2 className='text-5xl font-bold text-orange-500'>
                            INSTAGRAM
                        </h2>

                        <a
                            href='#'
                            className='font-bold text-black text-lg flex items-center gap-3 hover:gap-5 transition-all'
                        >
                            <span className='underline underline-offset-4'>
                                FOLLOW NGAY
                            </span>

                            <span className='text-2xl'>→</span>
                        </a>
                    </div>

                    {/* GRID */}

                    <div className='grid grid-cols-3 gap-6'>
                        <img
                            src={ImgIns1}
                            className='rounded-xl w-full h-[180px] object-cover'
                        />
                        <img
                            src={ImgIns4}
                            className='rounded-xl w-full h-[180px] object-cover'
                        />
                        <img
                            src={ImgIns3}
                            className='rounded-xl w-full h-[180px] object-cover'
                        />

                        <img
                            src={ImgIns5}
                            className='rounded-xl w-full h-[180px] object-cover'
                        />
                        <img
                            src={ImgIns2}
                            className='rounded-xl w-full h-[180px] object-cover'
                        />
                        <img
                            src={ImgIns6}
                            className='rounded-xl w-full h-[180px] object-cover'
                        />
                    </div>
                </div>

                {/* NEWS */}

                <div>
                    <div className='flex justify-between items-center mb-8'>
                        <h2 className='text-5xl font-bold text-orange-500'>
                            NEWS
                        </h2>

                        <a
                            href='#'
                            className='font-bold text-black text-lg flex items-center gap-3 hover:gap-5 transition-all'
                        >
                            <span className='underline underline-offset-4'>
                                XEM THÊM
                            </span>

                            <span className='text-2xl'>→</span>
                        </a>
                    </div>

                    <div className='rounded-2xl overflow-hidden'>
                        <img
                            src={ImgNews}
                            className='w-full h-[360px] object-cover'
                        />
                    </div>

                    <div className='mt-6 flex justify-between text-sm text-orange-500 font-semibold'>
                        <span>TeaMango</span>
                        <span>13.3.2026</span>
                    </div>

                    <p className='mt-4 text-lg font-bold text-black leading-relaxed'>
                        Bắt gặp Sài Gòn xưa trong món uống hiện đại. Hương vị
                        trà sữa được kết hợp tinh tế từ những lá trà tuyển chọn,
                        mang đến trải nghiệm vừa quen thuộc vừa mới mẻ.
                    </p>
                </div>
            </div>
        </section>
    );
}
