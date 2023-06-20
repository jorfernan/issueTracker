import React from 'react';
import Contents from './Contents.jsx';

function NavBar() {
    return (
        <nav>
            <a href='/'>Home</a>
            {' | '}
            <a href='/#/issues'>Issues</a>
            {' | '}
            <a href='/#/report'>Reports</a>
        </nav>
    );
}

export default function Page() {
    return (
        <div>
            <NavBar />
            <Contents />
        </div>
    );
}