import React, { ChangeEvent, SetStateAction } from 'react'
import { Input } from "@/components/ui/input"

interface InputWithLabelProps {
    label: string;
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>;
    placeholder: string;
    w?: string
}

const InputWithLabel = ({ label, value, setValue, placeholder, w }: InputWithLabelProps) => {

    const changeValue = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value)
    }
    return (
        <div className={`flex flex-col gap-1 ${w ? w : ''}`}>
            <label className="font-semibold text-sm">{label}</label>
            <Input
                type="text"
                placeholder={placeholder}
                className="font-semibold"
                value={value}
                onChange={changeValue}
            />
        </div>
    )
}

export default InputWithLabel