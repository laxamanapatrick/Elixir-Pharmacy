import React from 'react'
import { Box } from '@chakra-ui/react';

const PageScrollImportModal = ({children}) => {
    return (
        <Box w="full" overflowY="auto" overflowX="auto"
            minHeight="300px"
            maxHeight="680px"
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

export default PageScrollImportModal