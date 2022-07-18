import React from 'react'
import { Flex, HStack, Input, Select, Text, VStack } from '@chakra-ui/react'

export const RawMaterialsInformation = ({ rawMatsInfo, setRawMatsInfo }) => {

    return (
        <Flex justifyContent='center' flexDirection='column' w='full'>
            <VStack w='full' spacing={6}>
                <Text bgColor='secondary' w='full' color='white' textAlign='center' fontWeight='semibold'>Raw Materials Information</Text>
                <Flex w='95%' justifyContent='space-between'>

                    <VStack alignItems='start' w='40%' mx={5}>

                        {/* Item Code */}
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Item Code: </Text>\
                            <Select
                                onChange={(e) => setRawMatsInfo({
                                    itemCode: e.target.value,
                                    supplier: rawMatsInfo.supplier,
                                    uom: rawMatsInfo.uom,
                                    expirationDate: rawMatsInfo.expirationDate,
                                    quantity: rawMatsInfo.quantity
                                })}
                                w='full' placeholder=' '
                            >
                                <option>Sample 1</option>
                                <option>Sample 2</option>
                            </Select>
                        </HStack>

                        {/* Item Description */}
                        {rawMatsInfo?.supplier && rawMatsInfo?.itemCode ?
                            <HStack w='full'>
                                <Text w='full' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Item Description: </Text>
                                <Input w='95%' readOnly />
                            </HStack>
                            : ''}

                        {/* UOM */}
                        {rawMatsInfo?.supplier && rawMatsInfo?.itemCode ?
                            < HStack w='full'>
                                <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>UOM: </Text>
                                <Select
                                    onChange={(e) => setRawMatsInfo({
                                        itemCode: rawMatsInfo.itemCode,
                                        supplier: rawMatsInfo.supplier,
                                        uom: e.target.value,
                                        expirationDate: rawMatsInfo.expirationDate,
                                        quantity: rawMatsInfo.quantity
                                    })}
                                    w='full' placeholder=' '
                                >
                                    <option>Sample 1</option>
                                    <option>Sample 2</option>
                                </Select>
                            </HStack>
                            : ''}

                    </VStack>

                    <VStack alignItems='start' w='40%' mx={5}>

                        {/* Supplier */}
                        <HStack w='full'>
                            <Text w='full' bgColor='secondary' color='white' pl={2} py={2.5} fontSize='xs'>Supplier: </Text>
                            <Select
                                onChange={(e) => setRawMatsInfo({
                                    itemCode: rawMatsInfo.itemCode,
                                    supplier: e.target.value,
                                    uom: rawMatsInfo.uom,
                                    expirationDate: rawMatsInfo.expirationDate,
                                    quantity: rawMatsInfo.quantity
                                })}
                                w='full' placeholder=' '
                            >
                                <option>Sample 1</option>
                                <option>Sample 2</option>
                            </Select>
                        </HStack>

                        {/* Expiration Date */}
                        {rawMatsInfo?.supplier && rawMatsInfo?.itemCode ?
                            <HStack w='full'>
                                <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Expiration Date: </Text>
                                <Input
                                    onChange={(e) => setRawMatsInfo({
                                        itemCode: rawMatsInfo.itemCode,
                                        supplier: rawMatsInfo.supplier,
                                        uom: rawMatsInfo.uom,
                                        expirationDate: e.target.value,
                                        quantity: rawMatsInfo.quantity
                                    })}
                                    w='full' type='date'
                                />
                            </HStack>
                            : ''}

                        {/* Quantity */}
                        {rawMatsInfo?.supplier && rawMatsInfo?.itemCode ?
                            <HStack w='full'>
                                <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Quantity: </Text>
                                <Input
                                    onChange={(e) => setRawMatsInfo({
                                        itemCode: rawMatsInfo.itemCode,
                                        supplier: rawMatsInfo.supplier,
                                        uom: rawMatsInfo.uom,
                                        expirationDate: rawMatsInfo.expirationDate,
                                        quantity: Number(e.target.value)
                                    })}
                                    w='full' type='number'
                                />
                            </HStack>
                            : ''}

                    </VStack>

                </Flex>
            </VStack >
        </Flex >
    )
}
