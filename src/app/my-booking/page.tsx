import React from 'react';
import {getServerSession} from "next-auth";

const MyBooking = async () => {
    const session = await getServerSession()
    return (
        <div>
            <h1>My booking</h1>
            {session ? <p>Welcome, {session.user.email}</p> : <p>Please sign in</p>}
        </div>
    );
};

export default MyBooking;