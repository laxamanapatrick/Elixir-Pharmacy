import { Button, ButtonGroup, Flex } from '@chakra-ui/react'
import React from 'react'

export const Submit = () => {
    return (
        <Flex w='90%' justifyContent='end'>
            <ButtonGroup size='xs'>
                <Button colorScheme='blue'>APPROVE</Button>
                <Button colorScheme='red'>REJECT</Button>
            </ButtonGroup>
        </Flex>
    )
}
