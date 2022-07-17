import React from 'react'
import { Button, ButtonGroup, Flex } from '@chakra-ui/react'

export const ActionButtons = () => {
    return (
        <Flex w='full' justifyContent='end'>
            <ButtonGroup size='xs'>
                <Button colorScheme='blue' px={5}>Add</Button>
                <Button colorScheme='blue' px={5}>Save</Button>
                <Button colorScheme='red' px={3}>Cancel</Button>
            </ButtonGroup>
        </Flex>
    )
}
