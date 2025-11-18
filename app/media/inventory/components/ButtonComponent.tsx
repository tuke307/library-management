"use client";
import React from 'react';
import { setAllMediaExists } from "@/actions/media";
import { Button } from '@heroui/react';

interface ButtonComponentProps {
    onButtonClick: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ onButtonClick }) => {
    const handleResetClick = async () => {
        await setAllMediaExists(false);
        onButtonClick();
    };

    const handleSetClick = async () => {
        await setAllMediaExists(true);
        onButtonClick();
    };

    return (
        <div>
            <Button color='danger' variant='flat' onClick={handleResetClick}>alle zurücksetzen</Button>
            <Button color='warning' variant='flat' onClick={handleSetClick}>alle setzen</Button>
        </div>
    );
};

export default ButtonComponent;