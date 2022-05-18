import React, { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Stack
} from '@chakra-ui/react'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { Link } from 'react-router-dom'
import AddRequest from './transformation-planning/Add-Request'
import StatusOfRequest from './transformation-planning/Status-Of-Request'
import RequestReject from './transformation-planning/Request-Reject'
import PageScrollTransformation from '../../components/PageScroll-Transformation'

const TransformationPlanningPage = () => {

  const [navigation, setNavigation] = useState(null)

  return (
    <Flex px={5} pt={5} pb={0} w='full' flexDirection='column'>
      <Flex w='full' justifyContent='space-between'>
        <HStack spacing={0}>
          <Button
            bgColor={navigation === 1 ? 'secondary' : ''}
            color={navigation === 1 ? 'white' : ''}
            _hover={{ bgColor: 'accent', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            onClick={() => setNavigation(1)}
          >
            <Link to='/transformation/transformation-planning/add-request'>Add Request</Link>
          </Button>
          <Button
            bgColor={navigation === 2 ? 'secondary' : ''}
            color={navigation === 2 ? 'white' : ''}
            _hover={{ bgColor: 'accent', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            onClick={() => setNavigation(2)}
          >
            <Link to='/transformation/transformation-planning/status-of-request'>Status of Request</Link>
          </Button>
          <Button
            bgColor={navigation === 3 ? 'secondary' : ''}
            color={navigation === 3 ? 'white' : ''}
            _hover={{ bgColor: 'accent', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            onClick={() => setNavigation(3)}
          >
            <Link to='/transformation/transformation-planning/request-reject'>Request Reject</Link>
          </Button>
        </HStack>

        <Button
          background='none'
          color='secondary'
          size='xs'
          onClick={() => setNavigation(3)}
        >
          <Link to='/transformation/transformation-planning/request-reject'><IoMdNotificationsOutline fontSize='25px' /></Link>
        </Button>
      </Flex>
      <Flex border='1px' borderColor='gray.300'>
        {/* <PageScrollTransformation> */}
        {navigation === 1 ?
          (
            <AddRequest />
          )
          :
          navigation === 2 ?
            (
              <StatusOfRequest />
            )
            :
            navigation === 3 ?
              (
                <RequestReject />
              )
              :
              ""
        }
        {/* </PageScrollTransformation> */}
      </Flex>
    </Flex >
  )
}

export default TransformationPlanningPage