import React from 'react'
import {
  Box,
  Flex,
  Text,
  VStack
} from '@chakra-ui/react'
import { ImSad } from 'react-icons/im'

const ItemNotFound = () => {
  return (
    <Flex justifyContent='center'>
      <Box w='50%' mt='200px' height='50vh'>
        <VStack spacing='30px'>
          <Flex>
            <ImSad fontSize='300px' />
          </Flex>
          <Flex>
            <Text fontWeight='semibold' color='danger'>Data not found with this item Code</Text>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  )
}

export default ItemNotFound