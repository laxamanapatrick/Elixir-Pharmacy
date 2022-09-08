import React from 'react';

export const ToastComponent = (title, message, type, toast) => {

    return toast({
        title: title,
        description: message,
        status: type,
        position: 'top-right',
        duration: 2800,
        isClosable: true,
    });
};
