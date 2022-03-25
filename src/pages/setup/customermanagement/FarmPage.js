import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel
} from '@chakra-ui/react';
import apiClient from '../../../services/apiClient';
import { FcAddDatabase } from 'react-icons/fc'
import { RiEditBoxFill } from 'react-icons/ri'
import { GiChoice } from 'react-icons/gi'
import { useDisclosure } from '@chakra-ui/react';
import { ToastComponent } from '../../../components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../../services/decode-user';
import PageScroll from '../../../components/PageScroll';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import { FaSearch } from 'react-icons/fa';

const currentUser = decodeUser()

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    farmName: yup.string().required("Farm is required"),
  })
})

const fetchFarmApi = async () => {
  const res = await apiClient.get(`Customer/GetAllActiveFarms`)
  return res.data
}

const FarmPage = () => {
  const [farms, setFarms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        farmName: "",
        addedBy: currentUser.addedBy
      }
    }
  })

  const fetchFarm = () => {
    fetchFarmApi().then(res => {
      setIsLoading(false)
      setFarms(res)
    })
  }

  useEffect(() => {
    fetchFarm()
  }, [])

  //No status parameters for item category

  const editHandler = (farm) => {
    openDrawer();
    setValue("formData", {
      id: farm.id,
      farmName: farm.farmName,
    }, { shouldValidate: true })

  }

  const newFarmHandler = () => {
    openDrawer()
    reset()
  }

  return (
    <Flex p={5} w="full" flexDirection="column">

      {/* <Flex mb={2.5} justifyContent='end'>
            <HStack>
              <Text>STATUS: </Text>
              <Select onChange={(e) => statusHandler(e.target.value)}>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Select>
            </HStack>
          </Flex> */}

      <PageScroll>
        {
          isLoading ? (
            <Stack width="full">
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          ) : (
            <Table variant='striped' size='sm'>
              <Thead>
                <Tr bgColor='secondary'>
                  <Th color='white'>Id</Th>
                  <Th color='white'>Farm Name</Th>
                  <Th color='white'>Added By</Th>
                  <Th color='white'>Date Added</Th>
                  <Th color='white'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {farms?.map(farm =>
                  <Tr key={farm.id}>
                    <Td>{farm.id}</Td>
                    <Td>{farm.farmName}</Td>
                    <Td>{farm.addedBy}</Td>
                    <Td>{farm.dateAdded}</Td>
                    <Td>

                      <Button p={0} background='none' color='secondary' onClick={() => editHandler(farm)}>
                        <RiEditBoxFill />
                      </Button>

                      {/* <Popover>
                            <PopoverTrigger>
                              <Button p={0} background='none'><GiChoice /></Button>
                            </PopoverTrigger>
                            <Portal>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                  <VStack>
                                    {cat.isActive === true ? <Text>Are you sure you want to set this category inactive?</Text> : <Text>Are you sure you want to set this category active?</Text>}
                                    <Button bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} onClick={() => changeStatusHandler(cat.id, cat.isActive)}>Yes</Button>
                                  </VStack>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover> */}

                    </Td>
                  </Tr>
                )
                }
              </Tbody>
            </Table>
          )
        }
      </PageScroll>
      <Flex justifyContent='space-between' mt={5}>
        <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary' onClick={newFarmHandler} _hover={{ bgColor: 'accent' }}>
          <Text color='white'>New Farm</Text>
        </Button>
        {
          isDrawerOpen && (
            <DrawerComponent
              isOpen={isDrawerOpen}
              onClose={closeDrawer}
              register={register}
              errors={errors}
              isValid={isValid}
              handleSubmit={handleSubmit}
              fetchFarm={fetchFarm}
            />
          )
        }
      </Flex>
    </Flex>
  )
}

export default FarmPage

const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchFarm }) => {
  const [isLoading, setisLoading] = useState(false)
  const toast = useToast()

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"]
        setisLoading(true)
        const res = apiClient.post("Customer/AddNewFarm", data.formData).then((res) => {
          ToastComponent("Success", "New farm created", "success", toast)
          setisLoading(false)
          fetchFarm()
          onClose(onClose)
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
        })
      } else {
        const res = apiClient.put(`Customer/UpdateFarm/${data.formData.id}`, data.formData).then((res) => {
          ToastComponent("Success", "Farm Updated", "success", toast)
          setisLoading(false)
          fetchFarm()
          onClose(onClose)
        }).catch(err => {
          ToastComponent("Update Failed", err.response.data, "warning", toast)
        })
      }

    } catch (err) {
    }
  }

  return (
    <Flex>

      <Drawer
        isOpen={isOpen}
        placement='center'
        onClose={onClose}
      >
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Farm Form
            </DrawerHeader>
            <DrawerBody>

              <Stack spacing='7px'>

                <Flex mt={1.5}></Flex>

                <Box>
                  <FormLabel>Farm Name:</FormLabel>
                  <Input
                    placeholder='Please enter Department Name'
                    {...register("formData.farmName")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.farmName?.message}</Text>
                </Box>

              </Stack>

            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                bgColor='secondary'
                color='white'
                _hover={{ bgColor: 'accent' }}
                disabled={!isValid}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </DrawerFooter>

          </DrawerContent>
        </form>
      </Drawer>
    </Flex>


  )
}