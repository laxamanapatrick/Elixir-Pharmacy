import React, { useState, useEffect } from 'react'
import {
    Button,
    ButtonGroup,
    Flex,
    Heading,
    HStack,
    Input,
    Select,
    Text,
    VStack
} from '@chakra-ui/react'
import DatePicker from 'react-datepicker'
import apiClient from '../../../../services/apiClient'

export const RawMaterialsInformation = () => {

    const [formulas, setFormulas] = useState([])

    const fetchFormula = async () => {
        try {
            const res = await apiClient.get('Transformation/GetAllActiveFormula')
            setFormulas(res.data)
        } catch (error) {
        }
    }

    useEffect(() => {
        try {
            fetchFormula()
          } catch (error) {
          }
    }, [])

    return (
        <Flex w='90%' flexDirection='column'>
            <Flex justifyContent='center' bgColor='secondary' p={1}>
                <Heading color='white' fontSize='l' fontWeight='semibold'>Raw Materials Information</Heading>
            </Flex>
            <Flex justifyContent='space-between' mt={3}>
                <VStack>
                    <HStack w='full'>
                        <Text fontSize='xs' fontWeight='semibold' w='40%'>
                            Item Code:
                        </Text>
                        {
                            formulas.length > 0 ? (
                                <Select
                                    placeholder='Item Code'
                                >
                                    {formulas?.map((formula, i) => (
                                        <option key={i} value={formula.itemCode}>{formula.itemCode}</option>
                                    ))}
                                </Select>
                            ) : "loading"
                        }
                    </HStack>
                    <HStack w='full'>
                        <Text fontSize='xs' fontWeight='semibold' w='40%'>
                            Item Description:
                        </Text>
                        <Input bgColor='gray.200' />
                    </HStack>
                    <HStack w='full'>
                        <Text fontSize='xs' fontWeight='semibold' w='40%'>
                            UOM:
                        </Text>
                        <Input bgColor='gray.200' />
                    </HStack>
                </VStack>
                <VStack>
                    <HStack w='full'>
                        <Text fontSize='xs' fontWeight='semibold' w='40%'>
                            Prod Plan:
                        </Text>
                        <DatePicker
                            minDate={new Date()}
                        />
                    </HStack>
                    <HStack w='full'>
                        <Text fontSize='xs' fontWeight='semibold' w='40%'>
                            Version:
                        </Text>
                        <Input bgColor='#ffffe0' />
                    </HStack>
                    <HStack w='full'>
                        <Text fontSize='xs' fontWeight='semibold' w='40%'>
                            Batch:
                        </Text>
                        <Input bgColor='#ffffe0' />
                    </HStack>
                    <HStack w='full'>
                        <Text fontSize='xs' fontWeight='semibold' w='40%'>
                            Quantity:
                        </Text>
                        <Input bgColor='gray.200' />
                    </HStack>
                </VStack>
            </Flex>
            <Flex justifyContent='end' mt={6} w='full' bgColor='gray.200'>
                <ButtonGroup size='xs'>
                    <Button colorScheme='blue'>REQUEST</Button>
                    <Button colorScheme='red'>CANCEL</Button>
                </ButtonGroup>
            </Flex>
        </Flex>
    )
}