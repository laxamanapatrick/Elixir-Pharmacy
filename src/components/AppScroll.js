import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

const AppScroll = ({children}) => {

    const [screenSize, getDimension] = useState({
        dynamicHeight: window.innerHeight * 0.6
    })

    const setDimension = () => {
        getDimension({ dynamicHeight: window.innerHeight * 0.6})
    }

    useEffect(() => {
      window.addEventListener("resize", setDimension)
    
      return () => {
        window.removeEventListener("resize", setDimension)
      }
    }, [screenSize])

    return (
        <Box w="full" overflowY="auto" overflowX="auto"
            minHeight={`${Math.round(screenSize.dynamicHeight)}px`}
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

export default AppScroll;
