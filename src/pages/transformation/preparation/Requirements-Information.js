import React, { useEffect, useRef } from 'react'
import { Box, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'
import moment from 'moment'
import { ToastComponent } from '../../../components/Toast'

export const RequirementsInformation = ({ information, setWeight, setDisableSave, batch, weight }) => {

  const ref = useRef(null)

  useEffect(() => {
    if (weight === '') {
      window.setTimeout(() => {
        ref?.current?.focus()
      }, 500)
    }
  }, [weight])


  const weighHandler = (data) => {
    setWeight(data)
    const minAllowable = Number(information?.quantityNeeded) - (Number(information?.quantityNeeded) * 0.001)
    const maxAllowable = Number(information?.quantityNeeded) * 1.001

    console.log(minAllowable, maxAllowable)
    if (data < minAllowable || data > maxAllowable) {
      setDisableSave(true)
      // setWeight('')
    }
    else {
      setDisableSave(false)
    }
    // if (data) {
    //   setDisableSave(false)
    //   setWeight(data)
    // }
    // else {
    //   setDisableSave(true)
    //   // setWeight('')
    // }
  }

  return (
    <VStack spacing={5} mt={2} w='full' justifyContent='center'>
      <Text mb={3} fontWeight='semibold' w='90%' bgColor='secondary' color='white' textAlign='center'>Raw Materials Requirements Information</Text>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Item Code:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>{information.itemCode ? information.itemCode : ''}</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Item Description:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>{information.itemDescription ? information.itemDescription : ''}</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>MFG Date:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>{information.manufacturingDate ? moment(information.manufacturingDate).format("MM/DD/yyyy") : ''}</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Expiration Date:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>{information.expirationDate ? moment(information.expirationDate).format("MM/DD/yyyy") : ''}</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Balance:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>{information.balance ? information.balance : ''}</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Quantity Needed:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>{information.quantityNeeded ? information.quantityNeeded.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : ''}</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Batch:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>{information.batch ? information.batch : ''}</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Weighing Scale:</Text>
        <HStack w='45%'>
          <FaCloudscale fontSize='25px' />


          <Input
            onChange={(e) => weighHandler(e.target.value)}
            onWheel={(e) => e.target.blur()}
            ref={ref}
            value={weight}
            w='full' h={7} p={0} bgColor='#fff8dc' border='1px'
            type='number'
          />


        </HStack>
      </Flex>

    </VStack>
  )
}
