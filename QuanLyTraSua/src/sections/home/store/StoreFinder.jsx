export default function StoreFinder() {
    return (
        <section className='bg-[#f3eee5]  py-32 text-center'>
            <h2 className='text-6xl text-black font-bold mb-12 -ml-200'>
                Tìm cửa hàng gần bạn
            </h2>

            <div className='flex flex-col md:flex-row gap-6 justify-center'>
                <select className='border border-orange-500 px-8 py-4 rounded-full text-orange-500 font-bold  text-lg'>
                    <option>Chọn Thành phố</option>
                </select>

                <select className='border border-orange-500 px-8 py-4 rounded-full text-orange-500 font-bold text-lg'>
                    <option>Chọn Quận/Huyện</option>
                </select>
            </div>
        </section>
    );
}
