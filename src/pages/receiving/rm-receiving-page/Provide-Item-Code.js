import React from 'react'
import {
  Box,
  Flex,
  Text,
  VStack
} from '@chakra-ui/react'
import { FcSearch } from 'react-icons/fc'

const ProvideItemCode = () => {
  return (
    <Flex justifyContent='center'>
      <Box w='50%' mt='150px' height='50vh'>
        <VStack spacing='30px'>
          <Flex>
            <FcSearch fontSize='400px' />
          </Flex>
          <Flex>
            <Text fontWeight='semibold' color='secondary'>Provide or Scan Item Code</Text>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  )
}

export default ProvideItemCode