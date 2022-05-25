import React from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react';

const PageScrollTransformation = ({ children, minHeight, maxHeight }) => {
    return (
        <Box overflowY="auto" overflowX="auto" m={0.5}
            w="full"
            minHeight={minHeight}
            maxHeight={maxHeight}
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
        </Box>
    )
};

export default PageScrollTransformation