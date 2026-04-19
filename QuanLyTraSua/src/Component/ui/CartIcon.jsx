import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import useCartStore from '../../store/cartStore';

export default function CartIcon() {
    const cart = useCartStore((state) => state.cart);

    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    return (
        <Link
            to='/cart'
            className='relative flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 transition duration-300'
        >
            <FaShoppingCart className='text-lg' />

            {totalQty > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow'>
                    {totalQty}
                </span>
            )}
        </Link>
    );
}
