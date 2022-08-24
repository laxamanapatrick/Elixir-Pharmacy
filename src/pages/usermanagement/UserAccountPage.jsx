import {
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
  VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
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
import DrawerComponent from './Drawer';
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
    fullName: yup.string().required("Full Name is required"),
    userName: yup.string().required("Username is required").min(5, "Username must be at least 5 characters"),
    password: yup.string().required("Password is required").min(5, "Password must be at least 5 characters"),
    userRoleId: yup.string().required("User Role is required"),
    departmentId: yup.string().required("Department is required"),

  })
})

const fetchUserApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(`User/GetAllUsersWithPaginationOrig/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`);
  return res.data
}

const UserAccountPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast()
  const [pageTotal, setPageTotal] = useState(undefined);
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

  const [disableEdit, setDisableEdit] = useState(false)

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        fullName: "",
        userName: "",
        password: "",
        userRoleId: "",
        departmentId: "",
        addedBy: currentUser.userName,
        modifiedBy: ""
      }
    }
  })

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },

  });

  const fetchUsers = () => {
    fetchUserApi(currentPage, pageSize, status, search).then(res => {
      setIsLoading(false)
      setUsers(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [status, pageSize, currentPage, search]);


  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value)
    setPageSize(pageSize)
  }

  const statusHandler = (data) => {
    setStatus(data)
  }

  const changeStatusHandler = (id, status) => {
    let routeLabel;
    if (status) {
      routeLabel = "InActiveUser"
    } else {
      routeLabel = "ActivateUser"
    }

    apiClient.put(`/User/${routeLabel}/${id}`, { id: id }).then((res) => {
      ToastComponent("Success", "Status updated", "success", toast)
      fetchUsers()
    }).catch(err => {
      console.log(err);
    })
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  const editHandler = (user) => {
    setDisableEdit(true)
    openDrawer();
    setValue("formData", {
      id: user.id,
      fullName: user.fullName,
      userName: user.userName,
      password: user.password,
      userRoleId: user.userRoleId,
      departmentId: user.departmentId,
      modifiedBy: currentUser.userName
    }, { shouldValidate: true })
  }

  const newUserHandler = () => {
    setDisableEdit(false)
    openDrawer()
    reset()
  }

  return (
    <Flex p={5} w="full" flexDirection='column'>
      <Flex mb={2} justifyContent='space-between'>
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: Username' onChange={(e) => searchHandler(e.target.value)} focusBorderColor='accent' />
          </InputGroup>

        </HStack>
        <HStack>
          <Text>STATUS: </Text>

          <Select onChange={(e) => statusHandler(e.target.value)}>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Select>
        </HStack>
      </Flex>

      {/* Table of data start */}

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
            <Table variant='striped' size="sm">
              <Thead>
                <Tr bgColor="secondary" >
                  <Th color="white">Id</Th>
                  <Th color="white">Full Name</Th>
                  <Th color="white">Username</Th>
                  <Th color="white">Department</Th>
                  <Th color="white">User Role</Th>
                  <Th color="white">Added By</Th>
                  {/* <Th color="white">Mofified By</Th> */}
                  <Th color="white">Date Added</Th>
                  <Th color="white">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.user?.map(user =>
                  <Tr key={user.id}
                  >
                    <Td>{user.id}</Td>
                    <Td>{user.fullName}</Td>
                    <Td>{user.userName}</Td>
                    <Td>{user.department}</Td>
                    <Td>{user.userRole}</Td>
                    <Td>{user.addedBy}</Td>
                    {/* <Td>{user.modifiedBy}</Td> */}
                    <Td>{user.dateAdded}</Td>
                    <Td>
                      <HStack>
                        <Button p={0} background='none' color='secondary' onClick={() => editHandler(user)}>
                          <RiEditBoxFill />
                        </Button>
                        <Popover>
                          <PopoverTrigger>
                            <Button p={0} background='none'><GiChoice /></Button>
                          </PopoverTrigger>
                          <Portal>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverBody>
                                <VStack>
                                  {user.status === true ? <Text>Are you sure you want to set this user inactive?</Text> : <Text>Are you sure you want to set this user active?</Text>}
                                  <Button bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} onClick={() => changeStatusHandler(user.id, user.status)}>Yes</Button>
                                </VStack>
                              </PopoverBody>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                      </HStack>
                    </Td>
                  </Tr>
                )
                }
              </Tbody>
            </Table>
          )
        }
      </PageScroll>

      {/* Table data end */}

      <Flex justifyContent='space-between' mt={5}>
        <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary' onClick={newUserHandler} _hover={{ bgColor: 'accent' }}>
          <Text color='white'>New User</Text>
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
              fetchUsers={fetchUsers}
              disableEdit={disableEdit}
            />
          )
        }

        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{"<<"}</PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: 'accent', color: 'white' }}
                    p={3}
                    bg="secondary"
                    color='white'
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{">>"}</PaginationNext>
                <Select onChange={handlePageSizeChange} variant='filled'>
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>

      </Flex>
    </Flex >
  )

};

export default UserAccountPage;
