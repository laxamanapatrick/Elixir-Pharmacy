import { useToast } from '@chakra-ui/react';
import React from 'react';

export const ToastComponent = (title, message, type, toast) => {

    return toast({
        title: title,
        description: message,
        status: type,
        position: 'top-right',
        duration: 3000,
        isClosable: true,
    });
};


