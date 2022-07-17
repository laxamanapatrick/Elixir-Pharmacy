import React from 'react'
import { Flex, HStack, Input, Select, Text, VStack } from '@chakra-ui/react'

export const RawMaterialsInformation = () => {
    return (
        <Flex justifyContent='center' flexDirection='column' w='full'>
            <VStack w='full' spacing={6}>
                <Text bgColor='secondary' w='full' color='white' textAlign='center' fontWeight='semibold'>Raw Materials Information</Text>
                <Flex w='95%' justifyContent='space-between'>
                    <VStack alignItems='start' w='40%' mx={5}>
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Item Code: </Text>\
                            <Select w='full'>
                                <option></option>
                            </Select>
                        </HStack>
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Item Description: </Text>
                            <Input w='95%' readOnly />
                        </HStack>
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>UOM: </Text>
                            <Select w='full'>
                                <option></option>
                            </Select>
                        </HStack>
                    </VStack>
                    <VStack alignItems='start' w='40%' mx={5}>
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} py={2.5} fontSize='xs'>Supplier: </Text>
                            <Select w='full'>
                                <option></option>
                            </Select>
                        </HStack>
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Expiration Date: </Text>
                            <Input w='full' type='date' />
                        </HStack>
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Quantity: </Text>
                            <Input w='full' type='number' />
                        </HStack>
                    </VStack>
                </Flex>
            </VStack>
        </Flex>
    )
}
