import { createStandaloneToast, extendTheme, withDefaultColorScheme, withDefaultVariant } from '@chakra-ui/react'

const theme = extendTheme({
    colors: {
        primary: "#27273A",
        secondary: "#33334C",
        accent: "#87CEAA",
        warning: "#eed202",
        success: "#48bb78",
        danger: "#f56565",
        table_accent: "#daf5ee"
    },
    components: {
        Input: {
            baseStyle: {
                borderRadius: "none",
            },
            variants: {
                filled: {
                    field: {
                        borderRadius: "none",
                        backgroundColor: "secondary",
                        color: 'white',
                        _focus: {
                            borderColor: "accent",
                        },
                        _active: {
                            borderColor: "accent",
                        },
                        _hover: {
                            backgroundColor: "secondary",
                            borderColor: "accent",
                        }
                    },
                },
                outline: {
                    field: {
                        borderRadius: "none",
                        _focus: {
                            borderColor: "purple.500",
                        },
                        _active: {
                            borderColor: "purple.500",
                        },
                    },
                },
            },
        },
        Button: {
            baseStyle: {
                borderRadius: "none"
            },
        },
        Select: {
            variants: {
                outline: {
                    field: {
                        borderRadius: "1px",
                    },
                },
            },

        },
    },

}, withDefaultVariant({
    variant: "outline",
    components: ["Input", "Select"],
}))

// const [successToast, errorToast] = createStandaloneToast()

// successToast({
//     title: "Login Successful",
//     description: "Welcome",
//     status: 'success',
//     position: 'top-right',
//     duration: 4000,
//     isClosable: true,
// })

// errorToast({
//     title: "Invalid Credentials",
//     description: "Please try again",
//     status: 'error',
//     position: 'top-right',
//     duration: 4000,
//     isClosable: true,
// })

export default theme