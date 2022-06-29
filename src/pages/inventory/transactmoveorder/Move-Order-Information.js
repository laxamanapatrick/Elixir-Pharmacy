import React from 'react'
import { Flex, HStack, Input, Select, Text, VStack } from '@chakra-ui/react'
import DatePicker from 'react-datepicker'

export const MoveOrderInformation = () => {
    return (
        <Flex w='full' flexDirection='column' borderX='1px'>
            <VStack w='full' spacing={0} mb={2}>
                <Text w='full' textAlign='center' bgColor='secondary' color='white'>Transact Move Order</Text>
                <Text w='full' textAlign='center' bgColor='secondary' color='white'>Move Order Information</Text>
                <VStack w='99%'>
                    <HStack w='full' justifyContent='space-between' mt={2}>
                        <Text fontSize='sm'>Order ID:</Text>
                        <Input size='sm' />
                        <Text fontSize='sm'>Plate Number:</Text>
                        <Input size='sm' />
                        <Text fontSize='sm'>Delivery Date:</Text>
                        <DatePicker />
                    </HStack>
                    <HStack w='full' justifyContent='start' mt={2}>
                        <Text fontSize='sm'>Farm:</Text>
                        <Select size='sm' w='48%'>
                            <option>Hi</option>
                        </Select>
                        <Text fontSize='sm'>Address:</Text>
                        <Input w='full' size='sm' />
                    </HStack>
                </VStack>
            </VStack>
        </Flex>
    )
}
