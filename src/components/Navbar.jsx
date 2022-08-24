import React from 'react';
import { Badge, Box, Flex, HStack, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ menus, notification }) => {

    const { pathname } = useLocation()

    const navBars = [
        {
            title: 'QC Receiving',
            notifcation: notification?.qcReceiving?.posummarycount,
        },
        {
            title: 'Warehouse Receiving',
            notifcation: notification?.warehouseReceiving?.warehousecount,
        },
        {
            title: 'Raw Materials Nearly Expire',
            notifcation: notification?.nearlyExpire?.nearexpirecount,
        },
        {
            title: 'Cancelled PO',
            notifcation: notification?.cancelledPO?.cancelledpocount,
        },
        {
            title: 'Approval/Rejection Warehouse',
            notifcation: notification?.approvalRejectWarehouse?.approvalrejectcount,
        },
        {
            title: 'Warehouse Confirm Reject',
            notifcation: notification?.confirmReject?.confirmrejectcount,
        },
        {
            title: 'Approval Request',
            notifcation: notification?.approvalRequest?.approvalrequestcount,
        },
        {
            title: 'Preparation',
            notifcation: notification?.preparation?.preparationcount,
        },
        {
            title: 'Mixing',
            notifcation: notification?.mixing?.mixingcount,
        },
        {
            title: 'Preparation Schedule',
            notifcation: notification?.orderingFarm?.orderingfarmcount,
        },
        {
            title: 'Approval',
            notifcation: notification?.orderingApproval?.orderingapprovalcount,
        },
        {
            title: 'Move Order',
            notifcation: notification?.moveOrderList?.moveordercount,
        },
        {
            title: 'Transact Move Order',
            notifcation: notification?.transactMoveOrderList?.transactmoveordercount,
        },
        {
            title: 'For Approval MO',
            notifcation: notification?.forApprovalMoveOrder?.forapprovallistcount,
        },
        {
            title: 'Rejected MO',
            notifcation: notification?.rejectMoveOrder?.rejectlistcount,
        }
    ]

    return (
        <Flex>
            {menus.subMenu.map((sub) => (
                <Link to={sub.path} key={sub.title}>
                    <Box
                        p={2} borderRight='1px' borderBottom='1px' borderColor='primary' cursor='pointer'
                        bgColor={pathname.includes(sub.path) ? 'accent' : 'secondary'}
                        bgGradient={pathname.includes(sub.path) ? "linear(to-l, #003366, accent)" : 'secondary'}
                        boxShadow={pathname.includes(sub.path) ? '0 6px 6px' : ''}
                        _hover={{ bgGradient: "linear(to-l, #003366, accent)" }}
                    >
                        <HStack>
                            <Text color='white'>{sub.title}</Text>
                            {navBars.map((nav, i) => (
                                !pathname.includes(sub.path) ?
                                    sub.title === nav.title && <Badge key={i} bgColor='danger'><Text color='white'>{nav.notifcation === 0 ? '' : nav.notifcation}</Text></Badge> 
                                    :
                                    ''
                            )
                            )}
                        </HStack>
                    </Box>
                </Link>
            ))}
        </Flex>
    )
}
export default Navbar