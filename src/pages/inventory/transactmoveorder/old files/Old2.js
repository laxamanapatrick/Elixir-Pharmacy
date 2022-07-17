// import React from 'react'
// import { Flex, HStack, Input, Select, Text, VStack } from '@chakra-ui/react'
// import DatePicker from 'react-datepicker'

// export const MoveOrderInformation = ({ moveOrderInformation, deliveryDate, setDeliveryDate }) => {

//     return (
//         <Flex w='full' flexDirection='column' borderX='1px'>
//             <VStack w='full' spacing={0} mb={2}>
//                 <Text w='full' textAlign='center' bgColor='secondary' color='white'>Transact Move Order</Text>
//                 <Text w='full' textAlign='center' bgColor='secondary' color='white'>Move Order Information</Text>
//                 <VStack w='99%'>
//                     <HStack w='full' justifyContent='space-between' mt={2}>
//                         <Text fontSize='sm'>Order ID:</Text>
//                         <Text textAlign='center' w='full' fontSize='sm' bgColor='gray.200' border='1px' py={1}
//                         >
//                             {moveOrderInformation.orderNo ? moveOrderInformation.orderNo : 'Please select a list'}
//                         </Text>
//                         <Text fontSize='sm'>Delivery Status:</Text>
//                         <Text textAlign='center' w='full' fontSize='sm' bgColor='gray.200' border='1px' py={1}
//                         >
//                             {/* {moveOrderInformation.deliveryStatus ? moveOrderInformation.deliveryStatus : 'Please select a list'} */}
//                             {`Ask backend to change plate number to delivery status`}
//                         </Text>
//                         <Text fontSize='sm'>Delivery Date:</Text>
//                         <DatePicker
//                             onChange={(date) => setDeliveryDate(date)}
//                             selected={deliveryDate}
//                             minDate={new Date()}
//                         />
//                     </HStack>
//                     <HStack w='full' justifyContent='start' mt={2}>
//                         <Text fontSize='sm'>Farm Code:</Text>
//                         <Text textAlign='center' w='30.5%' fontSize='sm' bgColor='gray.200' border='1px' py={1}
//                         >
//                             {moveOrderInformation.farmCode ? moveOrderInformation.farmCode : 'Please select a list'}
//                         </Text>
//                         <Text fontSize='sm'>Farm Name:</Text>
//                         <Text textAlign='center' w='69.5%' fontSize='sm' bgColor='gray.200' border='1px' py={1}
//                         >
//                             {moveOrderInformation.farmName ? moveOrderInformation.farmName : 'Please select a list'}
//                         </Text>
//                     </HStack>
//                 </VStack>
//             </VStack>
//         </Flex>
//     )
// }
