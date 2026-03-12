import ImgNews from '../../../assets/ImgNews.webp';

export default function InstagramNews() {
    return (
        <section className='bg-white py-20 w-full px-10'>
            <div className='grid md:grid-cols-2 gap-10'>
                {/* INSTAGRAM */}
                <div>
                    <h2 className='text-3xl text-orange-500 font-bold mb-6'>
                        INSTAGRAM
                    </h2>

                    <div className='grid grid-cols-3 gap-4'>
                        <img
                            src={ImgNews}
                            alt='Instagram Post 1'
                            className='w-full h-40 object-cover'
                        />
                        <img
                            src={ImgNews}
                            alt='Instagram Post 2'
                            className='w-full h-40 object-cover'
                        />
                        <img
                            src={ImgNews}
                            alt='Instagram Post 3'
                            className='w-full h-40 object-cover'
                        />
                    </div>
                </div>

                {/* NEWS */}
                <div>
                    <h2 className='text-3xl text-orange-500 font-bold mb-6'>
                        NEWS
                    </h2>
                    <div className='grid grid-cols-3 gap-4'>
                        <img
                            src={ImgNews}
                            alt='Instagram Post 1'
                            className='w-full h-40 object-cover'
                        />
                    </div>
                    <p className='text-black font-bold'>
                        Bắt gặp Sài Gòn xưa trong món uống hiện đại. Hương vị
                        trà sữa được kết hợp tinh tế từ những lá trà tuyển chọn,
                        mang đến trải nghiệm vừa quen thuộc vừa mới mẻ.
                    </p>
                </div>
            </div>
        </section>
    );
}
