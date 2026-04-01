const products = [
    {
        name: 'Americano Nóng',
        price: '45.000đ',
        img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'
    },
    {
        name: 'Cappuccino Đá',
        price: '55.000đ',
        img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096'
    }
];

export default function ProductSection() {
    return (
        <section className='bg-[#ede7db] py-24'>
            <h2 className='text-center text-5xl font-bold mb-20 text-black'>
                “NHÀ” COLLECTION
            </h2>

            <div className='container mx-auto px-10'>
                <div className='grid md:grid-cols-4 gap-16 text-center'>
                    {products.map((item, index) => (
                        <div key={index} className='group'>
                            <div className='overflow-hidden rounded-lg'>
                                <img
                                    src={item.img}
                                    className='mx-auto transition duration-500 group-hover:scale-110'
                                />
                            </div>

                            <h3 className='mt-6 text-xl font-semibold'>
                                {item.name}
                            </h3>

                            <p className='text-orange-500 font-bold mt-2'>
                                {item.price}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
