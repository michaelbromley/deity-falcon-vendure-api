import gql from 'graphql-tag';

// language="GraphQL"
export const PRODUCT_FRAGMENT = gql`
    fragment ProductWithVariants on Product {
        id
        name
        slug
        description
        assets {
            id
            type
            preview
        }
        facetValues {
            name
        }
        featuredAsset {
            preview
        }
        optionGroups {
            id
            code
            name
            options {
                id
                code
                name
            }
        }
        variants {
            id
            name
            sku
            featuredAsset {
                id
                preview
            }
            facetValues {
                name
            }
            options {
                id
                code
                name
            }
            price
            currencyCode
        }
    }
`;

export const GET_PRODUCTS_LIST = gql`
    query GetProductsList($options: ProductListOptions) {
        products(options: $options) {
            items {
                ...ProductWithVariants
            }
            totalItems
        }
    }
${PRODUCT_FRAGMENT}`;

export const GET_PRODUCT = gql`
    query GetProduct($id: ID!) {
        product(id: $id) {
            ...ProductWithVariants
        }
    }
${PRODUCT_FRAGMENT}`;

export const GET_ALL_COLLECTIONS = gql`
    query GetCollectionList($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                children {
                    id
                    name
                }
                description
                parent {
                    id
                    name
                }
            }
            totalItems
        }
    }
`;

export const GET_COLLECTION = gql`
    query GetCollection($id: ID!) {
        collection(id: $id) {
            id
            name
            description
            children {
                id
                name
            }
        }
    }
`;

export const SEARCH_PRODUCTS = gql`
    query SearchProducts($input: SearchInput!) {
        search(input: $input) {
            items {
                productId
                productVariantId
                productVariantName
                description
                productPreview
                sku
                slug
                price {
                    ...on PriceRange {
                        min
                        max
                    }
                    ...on SinglePrice {
                        value
                    }
                }
                currencyCode
                productName
            }
            totalItems,
            facetValues {
                count
                facetValue {
                    id
                    name
                    facet {
                        id
                        code
                        name
                    }
                }
            }
        }
    }
`;

export const PARTIAL_ORDER_FRAGMENT = gql`
    fragment PartialOrder on Order {
        id
        active
        code
        lines {
            productVariant {
                id
                sku
                name
            }
            unitPriceWithTax
            quantity
        }
    }
`;

export const ADD_TO_ORDER = gql`
    mutation AddToOrder($id: ID!, $qty: Int!) {
        addItemToOrder(productVariantId: $id, quantity: $qty) {
            ...PartialOrder
        }
    }
    ${PARTIAL_ORDER_FRAGMENT}
`;

export const ADJUST_ITEM_QTY = gql`
    mutation AdjustItemQty($id: ID!, $qty: Int!) {
        adjustOrderLine(orderLineId: $id, quantity: $qty) {
            ...PartialOrder
        }
    }
    ${PARTIAL_ORDER_FRAGMENT}
`;

export const REMOVE_ITEM = gql`
    mutation RemoveItem($id: ID!) {
        removeOrderLine(orderLineId: $id) {
            ...PartialOrder
        }
    }
    ${PARTIAL_ORDER_FRAGMENT}
`;

export const ORDER_ADDRESS_FRAGMENT = gql`
    fragment OrderAddress on OrderAddress {
        company
        fullName
        streetLine1
        streetLine2
        city
        postalCode
        countryCode
        province
        phoneNumber
    }
`;

export const FULL_ORDER_FRAGMENT = gql`
    fragment FullOrder on Order {
        createdAt
        id
        code
        state
        active
        subTotal
        shipping
        totalBeforeTax
        currencyCode
        total
        payments {
            id
            method
            amount
            transactionId
        }
        lines {
            id
            unitPriceWithTax
            totalPrice
            quantity
            featuredAsset {
                preview
            }
            productVariant {
                id
                name
                sku
                options {
                    name
                }
            }
        }
        billingAddress {
            ...OrderAddress
        }
        shippingAddress {
            ...OrderAddress
        }
        customer {
            id
            firstName
            lastName
        }
    }
    ${ORDER_ADDRESS_FRAGMENT}
`;

export const ACTIVE_ORDER = gql`
    query GetActiveOrder {
        activeOrder {
            ...FullOrder
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

export const ADDRESS_FRAGMENT = gql`
    fragment Address on Address {
        id
        company
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        phoneNumber
        country {
            id
            code
            name
        }
        defaultBillingAddress
        defaultShippingAddress
    }
`;

export const GET_CUSTOMER = gql`
    query GetCustomer {
        activeCustomer {
            id
            firstName
            lastName
            emailAddress
            addresses {
                ...Address
            }
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const GET_COUNTRY_LIST = gql`
    query GetCountryList {
        availableCountries {
            id
            name
            code
        }
    }
`;

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods {
        eligibleShippingMethods {
            id
            description
            price
        }
    }
`;

export const GET_ORDER_NEXT_STATES = gql`
    query GetNextStates {
        nextOrderStates
    }
`;

export const TRANSITION_ORDER_STATE = gql`
    mutation TransitionOrderToState($state: String!) {
        transitionOrderToState(state: $state) {
            id
            code
            state
        }
    }
`;

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod($addressInput: CreateAddressInput!, $shippingMethodId: ID!) {
        setOrderShippingAddress(input: $addressInput) {
            id
        }
        setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
            ...PartialOrder
            subTotal
            shipping
            totalBeforeTax
            currencyCode
            total
        }
    }
    ${PARTIAL_ORDER_FRAGMENT}
`;

export const ADD_PAYMENT_TO_ORDER = gql`
    mutation AddPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            id
            state
            code
        }
    }
`;

export const SET_CUSTOMER_FOR_ORDER = gql`
    mutation SetCustomerForOrder($input: CreateCustomerInput!) {
        setCustomerForOrder(input: $input) {
            id
        }
    }
`;

export const GET_ORDER_BY_CODE = gql`
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            ...FullOrder
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

export const CREATE_ACCOUNT = gql`
    mutation CreateAccount($input: RegisterCustomerInput!) {
        registerCustomerAccount(input: $input)
    }
`;

export const LOG_IN = gql`
    mutation LogIn($username: String!, $password: String!) {
        login(username: $username, password: $password, rememberMe: true) {
            user {
                id
                identifier
            }
        }
    }
`;

export const LOG_OUT = gql`
    mutation LogOut {
        logout
    }
`;

export const GET_ORDERS = gql`
    query GetCustomerOrders($options: OrderListOptions) {
        activeCustomer {
            orders(options: $options) {
                items {
                    ...FullOrder
                }
                totalItems
            }
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

export const GET_ORDER = gql`
    query GetOrder($id: ID!) {
        order(id: $id) {
            ...FullOrder
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

export const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            id
            firstName
            lastName
            emailAddress
        }
    }
`;

export const UPDATE_ADDRESS = gql`
    mutation UpdateAddress($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            ...Address
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const CREATE_ADDRESS = gql`
    mutation CreateAddress($input: CreateAddressInput!) {
        createCustomerAddress(input: $input) {
            ...Address
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const DELETE_ADDRESS = gql`
    mutation DeleteAddress($id: ID!) {
        deleteCustomerAddress(id: $id)
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($current: String!, $new: String!) {
        updateCustomerPassword(currentPassword: $current, newPassword: $new)
    }
`;

export const REQUEST_PASSWORD_RESET = gql`
    mutation RequestPasswordReset($emailAddress: String!) {
        requestPasswordReset(emailAddress: $emailAddress)
    }
`;

export const RESET_PASSWORD = gql`
    mutation ResetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
            user {
                id
            }
        }
    }
`;
