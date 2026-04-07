export default function Marquee() {
    const text =
        '• FRESHLY BREWED TEA • PREMIUM MILK • CHEWY BOBA • FRESHLY BREWED TEA • PREMIUM MILK • CHEWY BOBA';
    return (
        <div className='bg-[#e5e0d5] overflow-hidden whitespace-nowrap'>
            <div className='marquee flex py-10 text-[#6b5b4d] font-semibold text-sm md:text-base'>
                <span className='mx-8'>{text}</span>
                <span className='mx-8'>{text}</span>
                <span className='mx-8'>{text}</span>
                <span className='mx-8'>{text}</span>
            </div>
        </div>
    );
}
