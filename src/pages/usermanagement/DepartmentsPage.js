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
import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import { FcAddDatabase } from 'react-icons/fc'
import { RiEditBoxFill } from 'react-icons/ri'
import { GiChoice } from 'react-icons/gi'
import { useDisclosure } from '@chakra-ui/react';
import { ToastComponent } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../services/decode-user';
import { FaSearch } from 'react-icons/fa';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import PageScroll from '../../components/PageScroll';

const currentUser = decodeUser()

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    departmentName: yup.string().required("Department name is required"),
  })
})

const fetchDepartmentsApi = async () => {
  const res = await apiClient.get("User/GetAllDepartments")
  return res.data
}

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        departmentName: "",
        addedBy: currentUser.addedBy
      }
    }
  })

  const fetchDepartments = () => {
    fetchDepartmentsApi().then(res => {
      setDepartments(res)
    })
  }

  useEffect(() => {
    fetchDepartments()
    setIsLoading(false)
  }, [])

  const editHandler = (dep) => {
    openDrawer();
    setValue("formData", {
      id: dep.id,
      departmentName: dep.departmentName,
    }, { shouldValidate: true })

  }

  const newDepartmentHandler = () => {
    openDrawer()
    reset()
  }

  return (
    <Flex p={5} w="full" flexDirection="column">
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
                  <Th color='white'>Department Name</Th>
                  <Th color='white'>Added By</Th>
                  <Th color='white'>Date Added</Th>
                  <Th color='white'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {departments?.map(dep =>
                  <Tr key={dep.id}>
                    <Td>{dep.id}</Td>
                    <Td>{dep.departmentName}</Td>
                    <Td>{dep.addedBy}</Td>
                    <Td>{dep.dateAdded}</Td>
                    <Td>
                      <Button p={0} background='none' color='secondary' onClick={() => editHandler(dep)}>
                        <RiEditBoxFill />
                      </Button>
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
        <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary' onClick={newDepartmentHandler} _hover={{ bgColor: 'accent' }}>
          <Text color='white'>New Deparment</Text>
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
              fetchDepartments={fetchDepartments}
            />
          )
        }
      </Flex>
    </Flex>
  )
}

export default DepartmentsPage

const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchDepartments }) => {
  const [isLoading, setisLoading] = useState(false)
  const toast = useToast()

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"]
        setisLoading(true)
        const res = apiClient.post("User/AddNewDepartment", data.formData).then((res) => {
          ToastComponent("Success", "New department created", "success", toast)
          setisLoading(false)
          fetchDepartments()
          onClose(onClose)
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
        })
      } else {
        const res = apiClient.put(`User/UpdateDepartmentInfo/${data.formData.id}`, data.formData).then((res) => {
          ToastComponent("Success", "Department Updated", "success", toast)
          setisLoading(false)
          fetchDepartments()
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
              Department Form
            </DrawerHeader>
            <DrawerBody>

              <Stack spacing='7px'>

                <Flex mt={1.5}></Flex>

                <Box>
                  <FormLabel>Department Name:</FormLabel>
                  <Input
                    placeholder='Please enter Department Name'
                    {...register("formData.departmentName")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.departmentName?.message}</Text>
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