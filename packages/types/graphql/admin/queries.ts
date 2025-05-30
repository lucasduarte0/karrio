import gql from "graphql-tag";

// -----------------------------------------------------------
// System Connection Operations
// -----------------------------------------------------------
//#region

export const GET_SYSTEM_CONNECTIONS = gql`
  query GetSystemConnections($filter: CarrierFilter) {
    system_carrier_connections(filter: $filter) {
      edges {
        node {
          id
          carrier_name
          carrier_id
          display_name
          test_mode
          active
          capabilities
          credentials
          config
          metadata
          object_type
        }
        cursor
      }
      page_info {
        has_next_page
        has_previous_page
        start_cursor
        end_cursor
      }
    }
  }
`;

export const GET_SYSTEM_CONNECTION = gql`
  query GetSystemConnection($id: String!) {
    system_carrier_connection(id: $id) {
      id
      carrier_name
      carrier_id
      display_name
      test_mode
      active
      capabilities
      credentials
      config
      metadata
      object_type
    }
  }
`;

export const CREATE_SYSTEM_CONNECTION = gql`
  mutation CreateSystemConnection($data: CreateConnectionMutationInput!) {
    create_system_carrier_connection(input: $data) {
      errors {
        field
        messages
      }
      connection {
        id
        carrier_name
        carrier_id
        display_name
        test_mode
        active
        capabilities
        credentials
        config
        metadata
        object_type
      }
    }
  }
`;

export const UPDATE_SYSTEM_CONNECTION = gql`
  mutation UpdateSystemConnection($data: UpdateConnectionMutationInput!) {
    update_system_carrier_connection(input: $data) {
      errors {
        field
        messages
      }
      connection {
        id
        carrier_name
        carrier_id
        display_name
        test_mode
        active
        capabilities
        credentials
        config
        metadata
        object_type
      }
    }
  }
`;

export const DELETE_SYSTEM_CONNECTION = gql`
  mutation DeleteSystemConnection($data: DeleteConnectionMutationInput!) {
    delete_system_carrier_connection(input: $data) {
      errors {
        field
        messages
      }
      id
    }
  }
`;

//#endregion

// -----------------------------------------------------------
// User Operations
// -----------------------------------------------------------
//#region

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      full_name
      is_staff
      is_active
      is_superuser
      last_login
      permissions
    }
  }
`;

export const GET_USER = gql`
  query GetUser($email: String!) {
    user(email: $email) {
      id
      email
      full_name
      is_staff
      is_active
      is_superuser
      last_login
      permissions
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($filter: UserFilter) {
    users(filter: $filter) {
      edges {
        node {
          id
          email
          full_name
          is_staff
          is_active
          is_superuser
          last_login
          permissions
        }
        cursor
      }
      page_info {
        count
        has_next_page
        has_previous_page
        start_cursor
        end_cursor
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserMutationInput!) {
    create_user(input: $data) {
      user {
        id
        email
        full_name
        is_staff
        is_active
        is_superuser
        last_login
        permissions
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UpdateUserMutationInput!) {
    update_user(input: $data) {
      user {
        id
        email
        full_name
        is_staff
        is_active
        is_superuser
        last_login
        permissions
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($data: DeleteUserMutationInput!) {
    remove_user(input: $data) {
      errors {
        field
        messages
      }
      id
    }
  }
`;

//#endregion

// -----------------------------------------------------------
// Config Operations
// -----------------------------------------------------------
//#region
export const GET_CONFIGS = gql`
  query GetConfigs {
    configs {
      # Platform Config
      APP_NAME
      APP_WEBSITE

      # Email Config
      EMAIL_USE_TLS
      EMAIL_HOST_USER
      EMAIL_HOST_PASSWORD
      EMAIL_HOST
      EMAIL_PORT
      EMAIL_FROM_ADDRESS

      # Address Validation Service
      GOOGLE_CLOUD_API_KEY
      CANADAPOST_ADDRESS_COMPLETE_API_KEY

      # Data Retention
      ORDER_DATA_RETENTION
      TRACKER_DATA_RETENTION
      SHIPMENT_DATA_RETENTION
      API_LOGS_DATA_RETENTION

      # System Settings
      AUDIT_LOGGING
      ALLOW_SIGNUP
      ALLOW_ADMIN_APPROVED_SIGNUP
      ALLOW_MULTI_ACCOUNT

      # Feature Flags
      ADMIN_DASHBOARD
      MULTI_ORGANIZATIONS
      ORDERS_MANAGEMENT
      APPS_MANAGEMENT
      DOCUMENTS_MANAGEMENT
      DATA_IMPORT_EXPORT
      WORKFLOW_MANAGEMENT
      PERSIST_SDK_TRACING
    }
  }
`;

export const UPDATE_CONFIGS = gql`
  mutation UpdateConfigs($data: InstanceConfigMutationInput!) {
    update_configs(input: $data) {
      errors {
        field
        messages
      }
      configs {
        # Platform Config
        APP_NAME
        APP_WEBSITE

        # Email Config
        EMAIL_USE_TLS
        EMAIL_HOST_USER
        EMAIL_HOST_PASSWORD
        EMAIL_HOST
        EMAIL_PORT
        EMAIL_FROM_ADDRESS

        # Address Validation Service
        GOOGLE_CLOUD_API_KEY
        CANADAPOST_ADDRESS_COMPLETE_API_KEY

        # Data Retention
        ORDER_DATA_RETENTION
        TRACKER_DATA_RETENTION
        SHIPMENT_DATA_RETENTION
        API_LOGS_DATA_RETENTION

        # System Settings
        AUDIT_LOGGING
        ALLOW_SIGNUP
        ALLOW_ADMIN_APPROVED_SIGNUP
        ALLOW_MULTI_ACCOUNT

        # Feature Flags
        ADMIN_DASHBOARD
        MULTI_ORGANIZATIONS
        ORDERS_MANAGEMENT
        APPS_MANAGEMENT
        DOCUMENTS_MANAGEMENT
        DATA_IMPORT_EXPORT
        WORKFLOW_MANAGEMENT
        PERSIST_SDK_TRACING
      }
    }
  }
`;

//#endregion

// -----------------------------------------------------------
// Surcharge Operations
// -----------------------------------------------------------
//#region

export const GET_SURCHARGE = gql`
  query GetSurcharge($id: String!) {
    surcharge(id: $id) {
      id
      name
      amount
      surcharge_type
      object_type
      active
      services
      carriers
      carrier_accounts {
        id
        active
        carrier_id
      }
    }
  }
`;

export const GET_SURCHARGES = gql`
  query GetSurcharges($filter: SurchargeFilter) {
    surcharges(filter: $filter) {
      edges {
        node {
          id
          name
          amount
          surcharge_type
          object_type
          active
          services
          carriers
          carrier_accounts {
            id
            active
            carrier_id
          }
        }
        cursor
      }
      page_info {
        count
        has_next_page
        has_previous_page
        start_cursor
        end_cursor
      }
    }
  }
`;

export const CREATE_SURCHARGE = gql`
  mutation CreateSurcharge($data: CreateSurchargeMutationInput!) {
    create_surcharge(input: $data) {
      errors {
        field
        messages
      }
      surcharge {
        id
        name
        amount
        surcharge_type
        object_type
        active
        services
        carriers
        carrier_accounts {
          id
          active
          carrier_id
        }
      }
    }
  }
`;

export const UPDATE_SURCHARGE = gql`
  mutation UpdateSurcharge($data: UpdateSurchargeMutationInput!) {
    update_surcharge(input: $data) {
      errors {
        field
        messages
      }
      surcharge {
        id
        name
        amount
        surcharge_type
        object_type
        active
        services
        carriers
        carrier_accounts {
          id
          active
          carrier_id
        }
      }
    }
  }
`;

export const DELETE_SURCHARGE = gql`
  mutation DeleteSurcharge($data: DeleteMutationInput!) {
    delete_surcharge(input: $data) {
      errors {
        field
        messages
      }
      id
    }
  }
`;

//#endregion

// -----------------------------------------------------------
// Rate Sheet Operations
// -----------------------------------------------------------
//#region

export const GET_RATE_SHEET = gql`
  query GetRateSheet($id: String!) {
    rate_sheet(id: $id) {
      id
      name
      slug
      carrier_name
      object_type
      metadata
      services {
        id
        object_type
        service_name
        service_code
        carrier_service_code
        description
        active
        currency
        transit_days
        transit_time
        max_width
        max_height
        max_length
        dimension_unit
        max_weight
        weight_unit
        domicile
        international
        metadata
        zones {
          object_type
          label
          rate
          min_weight
          max_weight
          transit_days
          transit_time
          radius
          latitude
          longitude
          cities
          postal_codes
          country_codes
        }
      }
      carriers {
        id
        carrier_id
        carrier_name
        display_name
        active
        is_system
        test_mode
        capabilities
      }
    }
  }
`;

export const GET_RATE_SHEETS = gql`
  query GetRateSheets($filter: RateSheetFilter) {
    rate_sheets(filter: $filter) {
      edges {
        node {
          id
          name
          slug
          carrier_name
          object_type
          metadata
          services {
            id
            service_name
            service_code
            carrier_service_code
            description
            active
          }
          carriers {
            id
            carrier_id
            carrier_name
            display_name
            active
            is_system
            test_mode
            capabilities
          }
        }
        cursor
      }
      page_info {
        count
        has_next_page
        has_previous_page
        start_cursor
        end_cursor
      }
    }
  }
`;

export const CREATE_RATE_SHEET = gql`
  mutation CreateRateSheet($data: CreateRateSheetMutationInput!) {
    create_rate_sheet(input: $data) {
      errors {
        field
        messages
      }
      rate_sheet {
        id
        name
        slug
        carrier_name
        object_type
        metadata
        services {
          id
          service_name
          service_code
          carrier_service_code
          description
          active
          metadata
          zones {
            label
            rate
            min_weight
            max_weight
            transit_days
            transit_time
            radius
            latitude
            longitude
            cities
            postal_codes
            country_codes
          }
        }
        carriers {
          id
          carrier_id
          carrier_name
          display_name
          active
          is_system
          test_mode
          capabilities
        }
      }
    }
  }
`;

export const UPDATE_RATE_SHEET = gql`
  mutation UpdateRateSheet($data: UpdateRateSheetMutationInput!) {
    update_rate_sheet(input: $data) {
      errors {
        field
        messages
      }
      rate_sheet {
        id
        name
        slug
        carrier_name
        object_type
        metadata
        services {
          id
          service_name
          service_code
          carrier_service_code
          description
          active
          metadata
          zones {
            label
            rate
            min_weight
            max_weight
            transit_days
            transit_time
            radius
            latitude
            longitude
            cities
            postal_codes
            country_codes
          }
        }
        carriers {
          id
          carrier_id
          carrier_name
          display_name
          active
          is_system
          test_mode
          capabilities
        }
      }
    }
  }
`;

export const UPDATE_SERVICE_ZONE = gql`
  mutation UpdateServiceZone($data: UpdateServiceZoneMutationInput!) {
    update_service_zone(input: $data) {
      errors {
        field
        messages
      }
      rate_sheet {
        id
        services {
          id
          zones {
            label
            rate
            min_weight
            max_weight
            transit_days
            transit_time
            radius
            latitude
            longitude
            cities
            postal_codes
            country_codes
          }
        }
      }
    }
  }
`;

export const DELETE_RATE_SHEET = gql`
  mutation DeleteRateSheet($data: DeleteMutationInput!) {
    delete_rate_sheet(input: $data) {
      errors {
        field
        messages
      }
      id
    }
  }
`;

//#endregion

// -----------------------------------------------------------
// Organization Operations
// -----------------------------------------------------------
//#region

export const GET_ACCOUNTS = gql`
  query GetAccounts($filter: AccountFilter) {
    accounts(filter: $filter) {
      edges {
        node {
          id
          name
          slug
          is_active
          created
          modified
          usage {
            members
            total_errors
            order_volume
            total_requests
            total_trackers
            total_shipments
            unfulfilled_orders
            total_shipping_spend
          }
        }
        cursor
      }
      page_info {
        count
        has_next_page
        has_previous_page
        start_cursor
        end_cursor
      }
    }
  }
`;

export const CREATE_ORGANIZATION_ACCOUNT = gql`
  mutation CreateOrganizationAccount(
    $data: CreateOrganizationAccountMutationInput!
  ) {
    create_organization_account(input: $data) {
      account {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_ORGANIZATION_ACCOUNT = gql`
  mutation UpdateOrganizationAccount(
    $data: UpdateOrganizationAccountMutationInput!
  ) {
    update_organization_account(input: $data) {
      account {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const DISABLE_ORGANIZATION_ACCOUNT = gql`
  mutation DisableOrganizationAccount(
    $data: DisableOrganizationAccountMutationInput!
  ) {
    disable_organization_account(input: $data) {
      account {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const DELETE_ORGANIZATION_ACCOUNT = gql`
  mutation DeleteOrganizationAccount(
    $data: DeleteOrganizationAccountMutationInput!
  ) {
    delete_organization_account(input: $data) {
      account {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

//#endregion

// -----------------------------------------------------------
// Permission Operations
// -----------------------------------------------------------
//#region

export const GET_PERMISSION_GROUPS = gql`
  query GetPermissionGroups($filter: PermissionGroupFilter) {
    permission_groups(filter: $filter) {
      edges {
        node {
          id
          name
          permissions
        }
        cursor
      }
      page_info {
        count
        has_next_page
        has_previous_page
        start_cursor
        end_cursor
      }
    }
  }
`;

//#endregion
