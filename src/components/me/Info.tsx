import React from 'react'

interface InfoProps {
    w?: string
    label: string,
    value: string
}

export const Info = ({ label, value, w }: InfoProps) => {
    return (
        <div className={`flex gap-1 rounded-md bg-blue-200 p-1 ${w} font-semibold`}>
            <p className="bold">{label}</p>
            <p>: </p>
            <p className='font-normal'>{value}</p>
        </div>
    )
}
