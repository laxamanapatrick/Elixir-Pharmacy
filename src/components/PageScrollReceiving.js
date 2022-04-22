import React from 'react'
import { Box, Flex } from '@chakra-ui/react';

const PageScrollReceiving = ({ children }) => {
    return (
        <Box w="full" overflowY="auto" overflowX="auto" mt={4}
            minHeight="300px"
            maxHeight="695px"
            sx={{
                "&::-webkit-scrollbar": {
                    height: "5px",
                    width: "5px",
                    borderRadius: "1px",
                    backgroundColor: `rgba(0, 0, 0, 0.05)`,
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "accent",
                },
            }}
        >
            {children}
            <Flex
                mt={5}
                borderX='none'
                borderTop='none'
                borderWidth='5px'
                borderColor='secondary'>

            </Flex>
        </Box>
    )
};

export default PageScrollReceiving