import React from 'react';

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time))

async function GetMessage() {
    const getMessage = async () => {
        await wait(3000);
        const response = await fetch('http://localhost:7000/api/test');
        return await response.json()
    }

    const data = await getMessage();
    return (
        <pre>{JSON.stringify(data, null, 3)}</pre>
    );
}

export default GetMessage;