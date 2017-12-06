import React from 'react';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';

// HEADER
// Banner at top of page

const WelcomeHeader = () => {
    return (
        <header>
            <div className='bannerWrapper'>
                <Link to={`/`}>
                    <h1>Can You Make It?</h1>
                </Link>                
            </div>
        </header>
    )
}

export default WelcomeHeader