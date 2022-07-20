import React from 'react'
import { Button, ButtonGroup, Flex } from '@chakra-ui/react'

export const ActionButtons = ({ listDataTempo, selectorId }) => {
    return (
        <Flex w='full' justifyContent='end'>
            <ButtonGroup size='xs'>
                <Button colorScheme='yellow' color='white' px={5} disabled={!selectorId}>Edit</Button>
                <Button colorScheme='blue' px={5} disabled={listDataTempo.length === 0}>Save</Button>
                <Button colorScheme='red' px={3} disabled={!selectorId}>Cancel</Button>
            </ButtonGroup>
        </Flex>
    )
}
