import { useEffect, useState } from 'react';

export default function DarkToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className='px-4 py-2 bg-black text-white rounded'
        >
            {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}
