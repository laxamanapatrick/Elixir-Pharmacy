import { Box, Button, ButtonGroup, Flex, HStack, Input, VStack } from '@chakra-ui/react'
import React from 'react'

const Calculator = () => {

  const numberHandler = (data) => {
  }

  return (
    <Flex w='full' p={10}>

      <Flex w='full' justifyContent='center' mt='240px'>


        <VStack onClick={(e) => numberHandler(e.target.value)}>
      
        <Box w='full'>
          <Input
          borderWidth='2px'
          w='full' 
          readOnly
          />
        </Box>

          <HStack>
            <ButtonGroup>
              <Button value='7'>7</Button>
              <Button value='8'>8</Button>
              <Button value='9'>9</Button>
              <Button fontSize='10px' fontWeight='bold'>AC</Button>
              <Button>/</Button>
            </ButtonGroup>
          </HStack>
          <HStack>
            <ButtonGroup>
              <Button value='4'>4</Button>
              <Button value='5'>5</Button>
              <Button value='6'>6</Button>
              <Button>-</Button>
              <Button>X</Button>
            </ButtonGroup>
          </HStack>

          <VStack alignItems='start'>

            <HStack>
              <HStack mt='-50px'>
                <Button value='1'>1</Button>
                <Button value='2'>2</Button>
                <Button value='3'>3</Button>
              </HStack>
              <HStack>
                <ButtonGroup>
                  <Button py='45px'>=</Button>
                  <Button py='45px'>+</Button>
                </ButtonGroup>
              </HStack>
            </HStack>

            <HStack>
              <HStack mt='-56px'>
                <ButtonGroup>
                  <Button px='40px' value={0}>0</Button>
                  <Button>.</Button>
                </ButtonGroup>
              </HStack>
            </HStack>

          </VStack>

        </VStack>

      </Flex>

    </Flex>
  )
}

export default Calculator